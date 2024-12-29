import { getOffset } from '@jezvejs/dom';
import {
    DragMaster,
    useDragnDrop,
    minmax,
    px,
} from '@jezvejs/react';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';
import PropTypes from 'prop-types';

export const XAxisDragZone = forwardRef((props, ref) => {
    const innerRef = useRef(null);
    useImperativeHandle(ref, () => innerRef.current);

    const dragZoneRef = useRef(null);
    const avatarRef = useRef(null);
    const currentTargetElemRef = useRef(null);

    const { getState, setState } = useDragnDrop();

    useEffect(() => {
        if (!dragZoneRef?.current) {
            return;
        }

        const dragZone = {
            elem: dragZoneRef.current,
            mouseMoveThreshold: 0,
            touchMoveTimeout: 0,
            onDragStart(params) {
                const avatar = {
                    id: props.id,
                    elem: avatarRef.current,
                    getDragInfo() {
                        return {
                            id: props.id,
                            mouseShift: {
                                x: getState().shiftX,
                            },
                        };
                    },
                    getTargetElem() {
                        return currentTargetElemRef.current;
                    },
                    initFromEvent({ downX }) {
                        const offset = getOffset(dragZoneRef.current);

                        const rect = dragZoneRef.current.getBoundingClientRect();
                        const offsetRect = dragZoneRef.current.offsetParent.getBoundingClientRect();

                        setState((prev) => ({
                            ...prev,
                            origLeft: dragZoneRef.current.offsetLeft,
                            shiftX: downX - offset.left,
                            rect,
                            offset: offsetRect,
                        }));

                        return true;
                    },
                    onDragMove({ e }) {
                        const client = DragMaster.getEventClientCoordinates(e);

                        const state = getState();
                        const x = client.x - state.offset.left - state.shiftX;
                        const maxPos = Math.round(state.offset.width - state.rect.width);

                        setState((prev) => ({
                            ...prev,
                            left: minmax(0, maxPos, x),
                            dragging: true,
                            draggingId: props.id,
                        }));

                        currentTargetElemRef.current = dragZoneRef.current.parentElement;
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
        setState((prev) => ({
            ...prev,
            left: props.left,
            origLeft: props.left,
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
XAxisDragZone.propTypes = {
    id: PropTypes.string,
    left: PropTypes.number,
};
