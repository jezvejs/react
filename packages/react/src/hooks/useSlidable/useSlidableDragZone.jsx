import PropTypes from 'prop-types';
import { isFunction } from '@jezvejs/types';
import { useRef } from 'react';

import { DragMaster } from '../../utils/DragnDrop/DragMaster.js';
import { useDragnDrop } from '../../utils/DragnDrop/DragnDropProvider.jsx';
import { useDragZone } from '../../utils/DragnDrop/useDragZone.jsx';

export function useSlidableDragZone(props) {
    const avatarRef = useRef(null);
    const currentTargetElemRef = useRef(null);

    const { getState, setState } = useDragnDrop();

    const getPositionForCoordinates = (coords, state) => (
        (props.vertical)
            ? (coords.y - (state?.shiftY ?? 0))
            : (coords.x - (state?.shiftX ?? 0))
    );

    const isValidDragStartAngle = (pointA, pointB) => {
        const dx = pointA.x - pointB.x;
        const dy = pointA.y - pointB.y;
        if (dx === 0 && dy === 0) {
            return false;
        }

        const angle = Math.abs(Math.atan2(dy, -dx) / Math.PI) * 180;
        return (props.vertical)
            ? (angle > 45 && angle < 135)
            : ((angle >= 0 && angle < 45) || (angle > 135 && angle <= 180));
    };

    const dragZone = useDragZone({
        ...props,

        mouseMoveThreshold: 0,
        touchMoveTimeout: 0,
        dragOriginal: true,

        makeAvatar() {
            return {
                id: props.id,
                elem: avatarRef.current,
                getDragInfo() {
                    const state = getState();
                    return {
                        id: props.id,
                        mouseShift: {
                            x: state.shiftX,
                            y: state.shiftY,
                        },
                    };
                },
                getTargetElem() {
                    return currentTargetElemRef.current;
                },
                initFromEvent({ downX, downY, e }) {
                    const dragZoneEl = dragZone.dragZoneRef?.current;
                    if (!dragZoneEl) {
                        return false;
                    }

                    const { allowMouse, allowTouch } = props;
                    const isTouch = !!e.touches;
                    if (
                        (isTouch && !allowTouch)
                        || (!isTouch && !allowMouse)
                    ) {
                        return false;
                    }

                    const coord = DragMaster.getEventPageCoordinates(e);
                    const rect = dragZoneEl.getBoundingClientRect();
                    const offset = {
                        left: dragZoneEl.offsetLeft,
                        top: dragZoneEl.offsetTop,
                    };
                    const position = getPositionForCoordinates(coord);
                    const lastTime = e.timeStamp;

                    setState((prev) => ({
                        ...prev,
                        rect,
                        startPoint: { x: downX, y: downY },
                        moved: false,
                        shiftX: coord.x - offset.left,
                        shiftY: coord.y - offset.top,
                        position,
                        origPosition: position,
                        totalDistance: 0,
                        distance: 0,
                        lastTime,
                        velocity: 0,
                    }));

                    return true;
                },
                onDragMove(e) {
                    const state = getState();

                    const coord = DragMaster.getEventPageCoordinates(e);
                    const dx = state.startPoint.x - coord.x;
                    const dy = state.startPoint.y - coord.y;
                    if (dx === 0 && dy === 0) {
                        return;
                    }

                    // On first move check angle
                    if (!state.moved) {
                        if (!isValidDragStartAngle(state.startPoint, coord)) {
                            DragMaster.getInstance().cancelDrag(e);
                            return;
                        }

                        setState((prev) => ({ ...prev, moved: true }));
                    }

                    const dragZoneEl = dragZone.dragZoneRef?.current;
                    currentTargetElemRef.current = dragZoneEl;

                    const position = getPositionForCoordinates(coord, state);
                    const distance = state.position - position;

                    const duration = e.timeStamp - state.lastTime;
                    const lastTime = e.timeStamp;

                    const velocity = (duration === 0)
                        ? 0
                        : ((state.distance - distance) / duration);

                    const totalDistance = state.origPosition - position;

                    setState((prev) => ({
                        ...prev,
                        position,
                        distance,
                        velocity,
                        lastTime,
                        totalDistance,
                    }));

                    if (Math.abs(totalDistance) > 0) {
                        props?.updatePosition?.(position);
                    }
                },
                onDragEnd() {
                    setState((prev) => ({
                        ...prev,
                        shiftX: 0,
                        shiftY: 0,
                    }));
                },
                onDragCancel() {
                    const state = getState();

                    if (Math.abs(state.totalDistance) > 0) {
                        props?.updatePosition?.(state.origPosition);
                    }

                    props?.onDragCancel?.();
                },
            };
        },

        onDragStart(params) {
            if (!this.isReady()) {
                return null;
            }

            const avatar = this.makeAvatar();
            if (!avatar?.initFromEvent?.(params)) {
                return null;
            }

            return avatar;
        },

        isReady() {
            return isFunction(props.isReady) ? props.isReady() : true;
        },

        updatePosition(position) {
            if (isFunction(props.updatePosition)) {
                props.updatePosition(position);
            }
        },
    });

    return dragZone;
}

useSlidableDragZone.propTypes = {
    id: PropTypes.string,
    onDragCancel: PropTypes.func,
    isReady: PropTypes.func,
    updatePosition: PropTypes.func,
    vertical: PropTypes.bool,
    allowMouse: PropTypes.bool,
    allowTouch: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
};
