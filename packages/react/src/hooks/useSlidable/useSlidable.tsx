import { removeEvents, setEvents } from '@jezvejs/dom';
import { useEffect, useMemo } from 'react';

import { Point } from '../../utils/types.ts';

import { useSlidableDragZone } from './useSlidableDragZone.tsx';
import { useSlidableDropTarget } from './useSlidableDropTarget.tsx';

export interface UseSlidableProps {
    id: string;

    vertical: boolean;
    allowMouse: boolean;
    allowTouch: boolean;
    allowWheel: boolean;

    isReady: boolean | (() => boolean);

    updatePosition: (position: number) => void;

    onDragCancel: () => void;

    // onDragEnd: () => void;

    onWheel: (e: WheelEvent) => void;

    onSlideEnd?: (position: number, totalDistance: number, velocity: number) => void,
}

export interface SlidableState {
    id: string;

    vertical: boolean;
    allowMouse: boolean;
    allowTouch: boolean;
    allowWheel: boolean;

    moved: boolean;

    startPoint?: Point;

    lastTime: number;
    position: number;
    origPosition: number;

    distance: number;
    totalDistance: number;

    velocity: number;

    shiftX: number;
    shiftY: number;
}

export function useSlidable(props: UseSlidableProps) {
    const {
        id,
        vertical,
        allowMouse,
        allowTouch,
        allowWheel,
        isReady = true,
        updatePosition,
        onWheel,
        onSlideEnd,
        onDragCancel,
    } = props;

    const {
        dragZoneRef,
        avatarRef,
    } = useSlidableDragZone({
        id,
        vertical,
        allowMouse,
        allowTouch,
        isReady,
        updatePosition,
        onDragCancel,
    });

    const {
        dropTargetRef,
    } = useSlidableDropTarget({
        id,
        onWheel,
        onSlideEnd,
    });

    // Mouse wheel handler
    const wheelHandler = useMemo(() => ({
        wheel: {
            listener: (e: WheelEvent) => {
                const elem = dragZoneRef?.current;
                const target = e.target as HTMLElement;
                if (!elem?.contains(target)) {
                    return;
                }

                e.stopImmediatePropagation();
                e.preventDefault();

                if (e.deltaY === 0) {
                    return;
                }

                props.onWheel?.(e);
            },
            options: { passive: false, capture: true },
        },
    }), []);

    const setWheelHandler = () => {
        setEvents(document.documentElement, wheelHandler);
    };

    const removeWheelHandler = () => {
        removeEvents(document.documentElement, wheelHandler);
    };

    useEffect(() => {
        removeWheelHandler();

        if (allowWheel) {
            setWheelHandler();
        }

        return removeWheelHandler;
    }, [allowWheel]);

    return {
        dragZoneRef,
        avatarRef,
        dropTargetRef,
    };
}
