import { getOffset } from '@jezvejs/dom';
import {
    useEffect,
    useRef,
} from 'react';
import PropTypes from 'prop-types';
import { DragMaster } from './DragMaster.js';
import { useDragnDrop } from './DragnDropProvider.jsx';

export function useDragZone(props) {
    const {
        dragOriginal = false,
        ...dragZoneProps
    } = props;

    const dragZoneRef = useRef(null);
    const avatarRef = useRef(null);
    const animationFrameRef = useRef(null);
    const currentTargetElemRef = useRef(null);

    const { getState, setState } = useDragnDrop();

    const state = getState();
    const showOriginal = !state.dragging || !dragOriginal;
    const showAvatar = state.dragging && state.draggingId === props.id;

    useEffect(() => {
        if (!dragZoneRef?.current) {
            return;
        }

        const dragZone = {
            makeAvatar() {
                const { id } = props;

                return {
                    id,
                    elem: avatarRef.current,
                    getDragInfo() {
                        return {
                            id,
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
                    cancelAnimation() {
                        if (animationFrameRef.current) {
                            cancelAnimationFrame(animationFrameRef.current);
                            animationFrameRef.current = 0;
                        }
                    },
                    onDragMove(e) {
                        this.cancelAnimation();

                        const page = DragMaster.getEventPageCoordinates(e);
                        const client = DragMaster.getEventClientCoordinates(e);

                        currentTargetElemRef.current = DragMaster.getElementUnderClientXY(
                            avatarRef?.current,
                            client.x,
                            client.y,
                        );

                        animationFrameRef.current = requestAnimationFrame(() => {
                            animationFrameRef.current = 0;

                            setState((prev) => ({
                                ...prev,
                                left: page.x - prev.shiftX,
                                top: page.y - prev.shiftY,
                                dragging: true,
                                draggingId: props.id,
                            }));
                        });
                    },
                    onDragCancel() {
                        this.cancelAnimation();

                        setState((prev) => ({
                            ...prev,
                            left: prev.origLeft,
                            top: prev.origTop,
                            dragging: false,
                        }));
                    },
                    onDragEnd() {
                        this.cancelAnimation();
                    },
                };
            },
            onDragStart(params) {
                const avatar = dragZone.makeAvatar();
                avatar?.initFromEvent?.(params);

                return avatar;
            },
            ...dragZoneProps,
            elem: dragZoneRef.current,
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

    return {
        dragZoneRef,
        avatarRef,
        showOriginal,
        showAvatar,
    };
}

useDragZone.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    left: PropTypes.number,
    top: PropTypes.number,
    dragOriginal: PropTypes.bool,
    absolutePos: PropTypes.bool,
};
