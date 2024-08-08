import { removeEvents, setEvents } from '@jezvejs/dom';
import { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { useSlidableDragZone } from './useSlidableDragZone.tsx';
import { useSlidableDropTarget } from './useSlidableDropTarget.tsx';

export function useSlidable(props) {
    const {
        vertical,
        allowMouse,
        allowTouch,
        allowWheel,
        isReady = true,
        updatePosition,
        onDragEnd = null,
        onDragCancel = null,
    } = props;

    const {
        dragZoneRef,
        avatarRef,
    } = useSlidableDragZone({
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
        onDragEnd,
    });

    // Mouse wheel handler
    const wheelHandler = useMemo(() => ({
        wheel: {
            listener: (e) => {
                const elem = dragZoneRef?.current;
                if (!elem?.contains(e.target)) {
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
    }));

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

useSlidable.propTypes = {
    id: PropTypes.string,
    isReady: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.func,
    ]),
    updatePosition: PropTypes.func,
    onDragCancel: PropTypes.func,
    onDragEnd: PropTypes.func,
    onWheel: PropTypes.func,
    vertical: PropTypes.bool,
    allowMouse: PropTypes.bool,
    allowTouch: PropTypes.bool,
    allowWheel: PropTypes.bool,
};
