import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';

// Utils
import { minmax } from '../../../utils/common.ts';
import { DragMaster } from '../../../utils/DragnDrop/DragMaster.ts';
import { useDragnDrop } from '../../../utils/DragnDrop/DragnDropProvider.tsx';
import { DragAvatarInitParam, DragZone, OnDragStartParams } from '../../../utils/DragnDrop/types.ts';
import { StoreUpdater } from '../../../utils/Store/Store.ts';

// Local components
import { RangeSliderSelectedArea } from './RangeSliderSelectedArea.tsx';
import { RangeSliderValueSlider } from './RangeSliderValueSlider.tsx';

import { getMaxPos } from '../helpers.ts';
import {
    RangeSliderDragZoneProps,
    RangeSliderDragZoneRef,
    RangeSliderSelectedAreaProps,
    RangeSliderState,
    RangeSliderValueSliderProps,
    RangeSliderValueSliderType,
} from '../types.ts';

// eslint-disable-next-line react/display-name
export const RangeSliderDragZone = forwardRef<
    RangeSliderDragZoneRef,
    RangeSliderDragZoneProps
>((props, ref) => {
    const {
        type = 'startSlider',
    } = props;
    const sliderId = type;

    const innerRef = useRef<RangeSliderDragZoneRef>(null);
    useImperativeHandle<
        RangeSliderDragZoneRef,
        RangeSliderDragZoneRef
    >(ref, () => (
        innerRef?.current
    ));

    const avatarRef = useRef<HTMLElement | null>(null);
    const currentTargetElemRef = useRef<HTMLElement | null>(null);

    const dragDrop = useDragnDrop();
    const getState = () => dragDrop?.getState() as RangeSliderState ?? null;
    const setState = (update: StoreUpdater) => dragDrop?.setState(update);

    useEffect(() => {
        if (!innerRef?.current) {
            return;
        }

        const dragZoneProps = {
            id: props.id,
            elem: innerRef.current,
            mouseMoveThreshold: 0,
            touchMoveTimeout: 0,

            onDragStart(params: OnDragStartParams) {
                const avatar = {
                    id: props.id,
                    elem: avatarRef.current,

                    getDragInfo() {
                        const sliderState = getState()[sliderId];
                        return {
                            id: props.id,
                            mouseShift: { ...sliderState.shift },
                        };
                    },

                    getTargetElem() {
                        return currentTargetElemRef.current;
                    },

                    initFromEvent(initParams: DragAvatarInitParam) {
                        const { downX, downY } = initParams;
                        if (!innerRef?.current) {
                            return false;
                        }

                        const original = {
                            left: innerRef.current.offsetLeft,
                            top: innerRef.current.offsetTop,
                        };

                        const rect = innerRef.current.getBoundingClientRect();
                        const shift = {
                            x: downX - rect.left,
                            y: downY - rect.top,
                        };

                        const { offsetParent } = innerRef.current;
                        const border = {
                            left: offsetParent?.clientLeft ?? 0,
                            top: offsetParent?.clientTop ?? 0,
                        };

                        const offsetRect = offsetParent?.getBoundingClientRect();
                        const offset = {
                            top: offsetRect?.top ?? 0,
                            left: offsetRect?.left ?? 0,
                        };

                        setState((prev: RangeSliderState) => ({
                            ...prev,
                            [sliderId]: {
                                ...prev[sliderId],
                                original,
                                shift,
                                offset,
                                border,
                            },
                        }));

                        return true;
                    },

                    onDragMove(e: TouchEvent | MouseEvent) {
                        const client = DragMaster.getEventClientCoordinates(e);

                        const state = getState();
                        const currentState = state[sliderId];
                        const { offset, shift, border } = currentState;

                        const pos = (props.axis === 'x')
                            ? (client.x - offset.left - shift.x - border.left)
                            : (client.y - offset.top - shift.y - border.top);

                        const { maxPos } = state;
                        const newPos = minmax(0, maxPos, pos);

                        setState((prev: RangeSliderState) => ({
                            ...prev,
                            [sliderId]: {
                                ...prev[sliderId],
                                left: (props.axis === 'x') ? newPos : prev[sliderId].left,
                                top: (props.axis === 'y') ? newPos : prev[sliderId].top,
                            },
                            dragging: true,
                            draggingId: props.id,
                            maxPos,
                        }));

                        if (!innerRef?.current) {
                            return;
                        }

                        if (currentTargetElemRef) {
                            currentTargetElemRef.current = innerRef.current.parentElement;
                        }

                        props.onPosChange?.(newPos);
                    },

                    onDragCancel() {
                        setState((prev: RangeSliderState) => ({
                            ...prev,
                            [sliderId]: {
                                ...prev[sliderId],
                                ...prev[sliderId].original,
                            },
                            dragging: false,
                        }));
                    },
                };

                avatar.initFromEvent(params);

                return avatar;
            },
        };

        DragMaster.makeDraggable(dragZoneProps as DragZone);
    }, [innerRef]);

    const onResize = () => {
        if (sliderId !== 'startSlider') {
            return;
        }

        setState((prev) => ({
            ...prev,
            maxPos: getMaxPos(innerRef.current, props.axis),
        }));
    };

    useEffect(() => {
        if (!innerRef?.current?.offsetParent) {
            return undefined;
        }

        const observer = new ResizeObserver(onResize);
        observer.observe(innerRef.current.offsetParent);

        return () => {
            observer.disconnect();
        };
    }, [innerRef]);

    if (type === 'selectedArea') {
        const selectedAreaProps: RangeSliderSelectedAreaProps = {
            ...props,
        };

        return (
            <RangeSliderSelectedArea {...selectedAreaProps} ref={innerRef} />
        );
    }

    const valueSliderProps: RangeSliderValueSliderProps = {
        ...props,
        type: props.type as RangeSliderValueSliderType,
    };

    return (
        <RangeSliderValueSlider {...valueSliderProps} ref={innerRef} />
    );
});
