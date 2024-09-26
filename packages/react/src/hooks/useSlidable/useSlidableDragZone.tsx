import { useRef } from 'react';

// Utils
import { DragMaster } from '../../utils/DragnDrop/DragMaster.ts';
import { useDragnDrop } from '../../utils/DragnDrop/DragnDropProvider.tsx';
import { DragAvatarInitParam, OnDragMoveParams, OnDragStartParams } from '../../utils/DragnDrop/types.ts';
import { useDragZone } from '../../utils/DragnDrop/useDragZone.tsx';
import { StoreUpdater } from '../../utils/Store/Store.ts';
import { Point } from '../../utils/types.ts';

import { PositionShift, SlidableState, UseSlidableDragZoneProps } from './types.ts';

export function useSlidableDragZone(props: UseSlidableDragZoneProps) {
    const avatarRef = useRef(null);
    const currentTargetElemRef = useRef<HTMLElement | null>(null);

    const dragDrop = useDragnDrop();
    const getState = () => dragDrop?.getState() as SlidableState ?? null;
    const setState = (update: StoreUpdater) => dragDrop?.setState(update);

    const getPositionForCoordinates = (coords: Point, state?: PositionShift): number => (
        (props.vertical)
            ? (coords.y - (state?.shiftY ?? 0))
            : (coords.x - (state?.shiftX ?? 0))
    );

    const isValidDragStartAngle = (pointA: Point, pointB: Point) => {
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

    const dragZoneProps = {
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

                initFromEvent(params: DragAvatarInitParam) {
                    const { downX, downY, e } = params;
                    const dragZoneEl = dragZone.dragZoneRef?.current as HTMLElement;
                    if (!dragZoneEl) {
                        return false;
                    }

                    const { allowMouse, allowTouch } = props;
                    const isTouch = ('touches' in e);
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
                    const shift = {
                        shiftX: coord.x - offset.left,
                        shiftY: coord.y - offset.top,
                    };
                    const position = getPositionForCoordinates(coord, shift);
                    const lastTime = e.timeStamp;

                    setState((prev) => ({
                        ...prev,
                        rect,
                        startPoint: { x: downX, y: downY },
                        moved: false,
                        ...shift,
                        position,
                        origPosition: position,
                        totalDistance: 0,
                        distance: 0,
                        lastTime,
                        velocity: 0,
                    }));

                    return true;
                },

                onDragMove(params: OnDragMoveParams) {
                    const { e } = params;
                    const state = getState();
                    if (!state.startPoint) {
                        return;
                    }

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
                    currentTargetElemRef.current = dragZoneEl as HTMLElement;

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

        onDragStart(params: OnDragStartParams) {
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
            return (typeof props.isReady === 'function')
                ? props.isReady()
                : true;
        },

        updatePosition(position: number) {
            if (typeof props.updatePosition === 'function') {
                props.updatePosition(position);
            }
        },
    };

    const dragZone = useDragZone(dragZoneProps);

    return dragZone;
}
