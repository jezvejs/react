import { getOffset } from '@jezvejs/dom';
import { DragMaster, useDragnDrop } from '@jezvejs/react';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
} from 'react';
import PropTypes from 'prop-types';

import { Box } from './Box.jsx';
import { OriginalDragAvatar } from './OriginalDragAvatar.jsx';

// eslint-disable-next-line react/display-name
export const DefaultDragZone = forwardRef((props, ref) => {
    const {
        dragOriginal = false,
        ...dragZoneProps
    } = props;

    const innerRef = useRef(null);
    useImperativeHandle(ref, () => innerRef.current);

    const dragZoneRef = useRef(null);
    const avatarRef = useRef(null);
    const animationFrameRef = useRef(null);
    const currentTargetElemRef = useRef(null);

    const { state, getState, setState } = useDragnDrop();

    const portalElement = useMemo(() => (
        document.getElementById('custom-root')
    ), []);

    const showOriginal = !state.dragging || !dragOriginal;
    const showAvatar = state.dragging && state.draggingId === props.id;

    useEffect(() => {
        if (!dragZoneRef?.current) {
            return;
        }

        const dragZone = {
            ...dragZoneProps,
            elem: dragZoneRef.current,
            onDragStart(params) {
                const avatar = {
                    id: props.id,
                    elem: avatarRef.current,
                    getDragInfo() {
                        return {
                            id: props.id,
                            mouseShift: {
                                x: getState().shiftX,
                                y: getState().shiftY,
                            },
                        };
                    },
                    getTargetElem() {
                        return currentTargetElemRef.current;
                    },
                    initFromEvent({ downX, downY }) {
                        const offset = getOffset(dragZoneRef.current);
                        setState((prev) => ({
                            ...prev,
                            origLeft: prev.left,
                            origTop: prev.top,
                            shiftX: downX - offset.left,
                            shiftY: downY - offset.top,
                        }));

                        return true;
                    },
                    onDragMove(e) {
                        const page = DragMaster.getEventPageCoordinates(e);
                        const client = DragMaster.getEventClientCoordinates(e);

                        if (animationFrameRef.current) {
                            cancelAnimationFrame(animationFrameRef.current);
                        }

                        animationFrameRef.current = requestAnimationFrame(() => {
                            animationFrameRef.current = 0;

                            setState((prev) => ({
                                ...prev,
                                left: page.x - prev.shiftX,
                                top: page.y - prev.shiftY,
                                dragging: true,
                                draggingId: props.id,
                            }));

                            currentTargetElemRef.current = DragMaster.getElementUnderClientXY(
                                avatarRef?.current,
                                client.x,
                                client.y,
                            );
                        });
                    },
                    onDragCancel() {
                        setState((prev) => ({
                            ...prev,
                            left: prev.origLeft,
                            top: prev.origTop,
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
            left: (props.absolutePos) ? props.left : 0,
            origLeft: (props.absolutePos) ? props.left : 0,
            top: (props.absolutePos) ? props.top : 0,
            origTop: (props.absolutePos) ? props.top : 0,
            dragging: false,
        }));
    }, [props.left, props.top, props.absolutePos]);

    const origProps = {
        ...state,
        id: props.id,
        title: props.title,
        left: state.origLeft,
        top: state.origTop,
        absolutePos: props.absolutePos,
        dragging: false,
        hidden: !showOriginal,
    };

    const avatarProps = {
        ...state,
        id: props.id,
        title: props.title,
    };

    const box = <Box {...origProps} ref={dragZoneRef} />;

    const avatar = (showAvatar && (
        <OriginalDragAvatar container={portalElement}>
            <Box {...avatarProps} ref={avatarRef} />
        </OriginalDragAvatar>
    ));

    return (
        <div ref={innerRef}>
            {box}
            {avatar}
        </div>
    );
});

DefaultDragZone.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    left: PropTypes.number,
    top: PropTypes.number,
    dragOriginal: PropTypes.bool,
    absolutePos: PropTypes.bool,
};