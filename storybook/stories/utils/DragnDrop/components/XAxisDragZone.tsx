import { getOffset } from '@jezvejs/dom';
import {
    DragMaster,
    useDragnDrop,
    minmax,
    px,
    UseDragZoneProps,
    OnDragStartParams,
    DragAvatarInitParam,
    OnDragMoveParams,
    DragnDropState,
} from '@jezvejs/react';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';

export type XAxisDragZoneRef = HTMLDivElement | null;

export type XAxisDragZoneProps = UseDragZoneProps & {
    Content?: React.FC,
};

export const XAxisDragZone = forwardRef<
    XAxisDragZoneRef,
    XAxisDragZoneProps
>((props, ref) => {
    const innerRef = useRef<XAxisDragZoneRef>(null);
    useImperativeHandle<XAxisDragZoneRef, XAxisDragZoneRef>(ref, () => innerRef.current);

    const dragZoneRef = useRef<XAxisDragZoneRef>(null);
    const avatarRef = useRef<XAxisDragZoneRef>(null);
    const currentTargetElemRef = useRef<Element | null>(null);

    const { getState, setState } = useDragnDrop<DragnDropState>();

    useEffect(() => {
        if (!dragZoneRef?.current) {
            return;
        }

        const dragZone = {
            id: props.id,
            elem: dragZoneRef.current,
            mouseMoveThreshold: 0,
            touchMoveTimeout: 0,
            onDragStart(params: OnDragStartParams) {
                const avatar = {
                    id: props.id,
                    elem: avatarRef.current,
                    getDragInfo() {
                        const st = getState();
                        return {
                            id: props.id,
                            mouseShift: {
                                x: st.shiftX,
                                y: st.shiftY,
                            },
                        };
                    },
                    getTargetElem() {
                        return currentTargetElemRef.current;
                    },
                    initFromEvent({ downX }: DragAvatarInitParam) {
                        const zoneElem = dragZoneRef.current;
                        const offset = getOffset(zoneElem);

                        const rect = zoneElem?.getBoundingClientRect();
                        const offsetRect = zoneElem?.offsetParent?.getBoundingClientRect();

                        setState((prev: DragnDropState) => ({
                            ...prev,
                            origLeft: zoneElem?.offsetLeft ?? 0,
                            shiftX: downX - offset.left,
                            rect,
                            offset: offsetRect,
                        }));

                        return true;
                    },
                    onDragMove({ e }: OnDragMoveParams) {
                        const client = DragMaster.getEventClientCoordinates(e);

                        const state = getState();
                        const { left, width } = state.offset ?? {};
                        const rectWidth = state.rect?.width ?? 0;
                        const x = client.x - (left ?? 0) - state.shiftX;
                        const maxPos = Math.round((width ?? 0) - rectWidth);

                        setState((prev: DragnDropState) => ({
                            ...prev,
                            left: minmax(0, maxPos, x),
                            dragging: true,
                            draggingId: props.id,
                        }));

                        currentTargetElemRef.current = dragZoneRef.current?.parentElement ?? null;
                    },
                    onDragCancel() {
                        setState((prev) => ({
                            ...prev,
                            left: prev.origLeft,
                            dragging: false,
                        }));
                    },
                };

                avatar.initFromEvent(params);

                return avatar;
            },
        };

        DragMaster.makeDraggable(dragZone);
    }, []);

    useEffect(() => {
        setState((prev: DragnDropState) => ({
            ...prev,
            left: props.left ?? 0,
            origLeft: props.left ?? 0,
            dragging: false,
        }));
    }, [props.left]);

    const state = getState();
    const sliderProps = {
        id: props.id,
        style: {
            left: px(state.left),
        },
    };

    return (
        <div
            {...sliderProps}
            className="x-axis-slider"
            ref={dragZoneRef}
        />
    );
});

XAxisDragZone.displayName = 'XAxisDragZone';
