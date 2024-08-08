import { getOffset } from '@jezvejs/dom';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';
import PropTypes from 'prop-types';

// Utils
import { minmax } from '../../../utils/common.ts';
import { DragMaster } from '../../../utils/DragnDrop/DragMaster.ts';
import { useDragnDrop } from '../../../utils/DragnDrop/DragnDropProvider.tsx';

// Local components
import { RangeSliderValueSlider } from './RangeSliderValueSlider.tsx';
import { RangeSliderSelectedArea } from './RangeSliderSelectedArea.tsx';

import { getMaxPos } from '../helpers.ts';

// eslint-disable-next-line react/display-name
export const RangeSliderDragZone = forwardRef((props, ref) => {
    const {
        type = 'startSlider',
    } = props;
    const sliderId = type;

    const innerRef = useRef(null);
    useImperativeHandle(ref, () => innerRef.current);

    const avatarRef = useRef(null);
    const currentTargetElemRef = useRef(null);

    const { getState, setState } = useDragnDrop();

    useEffect(() => {
        if (!innerRef?.current) {
            return;
        }

        const dragZone = {
            elem: innerRef.current,
            mouseMoveThreshold: 0,
            touchMoveTimeout: 0,
            onDragStart(params) {
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
                        const offsetRect = innerRef.current.offsetParent.getBoundingClientRect();

                        setState((prev) => ({
                            ...prev,
                            [sliderId]: {
                                ...prev[sliderId],
                                origLeft: innerRef.current.offsetLeft,
                                shiftX: downX - offset.left,
                                shiftY: downY - offset.top,
                                rect,
                                offset: offsetRect,
                            },
                        }));

                        return true;
                    },
                    onDragMove(e) {
                        const client = DragMaster.getEventClientCoordinates(e);

                        const state = getState();
                        const currentState = state[sliderId];
                        const sliderState = (type !== 'endSlider') ? state.startSlider : currentState;

                        const pos = (props.axis === 'x')
                            ? (client.x - currentState.offset.left - currentState.shiftX)
                            : (client.y - currentState.offset.top - currentState.shiftY);

                        const maxPos = Math.round(
                            (props.axis === 'x')
                                ? (currentState.offset.width - (sliderState.rect?.width ?? 0))
                                : (currentState.offset.height - (sliderState.rect?.height ?? 0)),
                        );

                        const newPos = minmax(0, maxPos, pos);

                        const rect = innerRef.current.getBoundingClientRect();
                        const offsetRect = innerRef.current.offsetParent.getBoundingClientRect();

                        setState((prev) => ({
                            ...prev,
                            [sliderId]: {
                                ...prev[sliderId],
                                left: (props.axis === 'x') ? newPos : prev.left,
                                top: (props.axis === 'y') ? newPos : prev.top,
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
                        currentTargetElemRef.current = innerRef.current.parentElement;

                        props.onPosChange?.(newPos);
                    },
                    onDragCancel() {
                        setState((prev) => ({
                            ...prev,
                            [sliderId]: {
                                ...prev[sliderId],
                                left: prev.origLeft,
                                top: prev.origTop,
                            },
                            dragging: false,
                        }));
                    },
                };

                avatar.initFromEvent(params);

                return avatar;
            },
        };

        DragMaster.makeDraggable(dragZone);
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
        const observer = new ResizeObserver(onResize);
        observer.observe(innerRef.current.offsetParent);

        return () => {
            observer.disconnect();
        };
    }, [innerRef]);

    return (
        (type === 'selectedArea')
            ? <RangeSliderSelectedArea {...props} ref={innerRef} />
            : <RangeSliderValueSlider {...props} ref={innerRef} />
    );
});

RangeSliderDragZone.propTypes = {
    id: PropTypes.string,
    axis: PropTypes.oneOf(['x', 'y']),
    type: PropTypes.oneOf(['startSlider', 'endSlider', 'selectedArea']),
    onPosChange: PropTypes.func,
};
