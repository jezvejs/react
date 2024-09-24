import { removeEvents, setEvents } from '@jezvejs/dom';
import { useEffect, useMemo } from 'react';

import { useSlidableDragZone } from './useSlidableDragZone.tsx';
import { useSlidableDropTarget } from './useSlidableDropTarget.tsx';
import { UseSlidableProps } from './types.ts';

const defaultProps = {
    vertical: false,
    allowMouse: false,
    allowTouch: true,
    allowWheel: true,
    isReady: true,
};

export function useSlidable(p: UseSlidableProps) {
    const props = {
        ...defaultProps,
        ...p,
    };

    const {
        id,
        vertical,
        allowMouse,
        allowTouch,
        allowWheel,
        isReady,
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
            listener: (ev: Event) => {
                const e = ev as WheelEvent;
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
