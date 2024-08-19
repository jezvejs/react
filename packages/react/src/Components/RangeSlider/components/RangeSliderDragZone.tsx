import { getOffset } from '@jezvejs/dom';
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
import { StoreUpdater } from '../../../utils/Store/Store.ts';

// Local components
import { RangeSliderSelectedArea } from './RangeSliderSelectedArea.tsx';
import { RangeSliderValueSlider } from './RangeSliderValueSlider.tsx';

import { getMaxPos } from '../helpers.ts';
import {
    RangeSliderSelectedAreaProps,
    RangeSliderState,
    RangeSliderValueSliderProps,
    RangeSliderValueSliderType,
} from '../types.ts';
import { DragZone, OnDragStartParams } from '../../../utils/DragnDrop/types.ts';

export interface RangeSliderDragZoneProps {
    id: string;
    axis: 'x' | 'y';
    type?: 'startSlider' | 'endSlider' | 'selectedArea';
    range: boolean;
    onPosChange: (position: number) => void;
}

type RangeSliderDragZoneRef = HTMLDivElement | null;

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
                            mouseShift: {
                                x: sliderState.shiftX,
                                y: sliderState.shiftY,
                            },
                        };
                    },

                    getTargetElem() {
                        return currentTargetElemRef.current;
                    },

                    initFromEvent({ downX, downY }) {
                        if (!innerRef?.current) {
                            return false;
                        }

                        const offset = getOffset(innerRef.current);

                        const rect = innerRef.current.getBoundingClientRect();
                        const offsetRect = innerRef.current?.offsetParent?.getBoundingClientRect();

                        setState((prev) => ({
                            ...prev,
                            [sliderId]: {
                                ...prev[sliderId],
                                origLeft: innerRef.current?.offsetLeft,
                                shiftX: downX - offset.left,
                                shiftY: downY - offset.top,
                                rect,
                                offset: offsetRect,
                            },
                        }));

                        return true;
                    },

                    onDragMove(e: TouchEvent | MouseEvent) {
                        const client = DragMaster.getEventClientCoordinates(e);

                        const state = getState();
                        const currentState = state[sliderId];
                        const sliderState = (type !== 'endSlider')
                            ? state.startSlider
                            : currentState;

                        const pos = (props.axis === 'x')
                            ? (client.x - currentState.offset.left - currentState.shiftX)
                            : (client.y - currentState.offset.top - currentState.shiftY);

                        const maxPos = Math.round(
                            (props.axis === 'x')
                                ? (currentState.offset.width - (sliderState.rect?.width ?? 0))
                                : (currentState.offset.height - (sliderState.rect?.height ?? 0)),
                        );

                        const newPos = minmax(0, maxPos, pos);

                        const rect = innerRef.current?.getBoundingClientRect();
                        const offsetRect = innerRef.current?.offsetParent?.getBoundingClientRect();

                        setState((prev: RangeSliderState) => ({
                            ...prev,
                            [sliderId]: {
                                ...prev[sliderId],
                                left: (props.axis === 'x') ? newPos : prev[sliderId].left,
                                top: (props.axis === 'y') ? newPos : prev[sliderId].top,
                                rect,
                                offset: offsetRect,
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
                        setState((prev) => ({
                            ...prev,
                            [sliderId]: {
                                ...prev[sliderId],
                                left: prev[sliderId].origLeft,
                                top: prev[sliderId].origTop,
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
            maxPos: getMaxPos(innerRef.current, props),
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
