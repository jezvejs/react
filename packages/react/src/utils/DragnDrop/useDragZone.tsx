import { getOffset } from '@jezvejs/dom';
import { useEffect, useRef } from 'react';

// Utils
import { Point } from '../types.ts';

import { DragMaster } from './DragMaster.ts';
import { useDragnDrop } from './DragnDropProvider.tsx';
import {
    DragAvatarInfo,
    DragAvatarInitParam,
    DragnDropState,
    DragZone,
    OnDragMoveParams,
    OnDragStartParams,
} from './types.ts';

export interface UseDragZoneProps {
    id: string;
    title?: string;
    left?: number;
    top?: number;
    dragOriginal?: boolean;
    absolutePos?: boolean;

    mouseMoveThreshold?: number;
    touchMoveTimeout?: number;

    elem?: Element | null;
}

export function useDragZone(props: UseDragZoneProps) {
    const {
        dragOriginal = false,
        ...dragZoneProps
    } = props;

    const dragZoneRef = useRef<Element | null>(null);
    const avatarRef = useRef<HTMLElement | null>(null);
    const animationFrameRef = useRef<number>(0);
    const currentTargetElemRef = useRef<Element | null>(null);

    const { getState, setState } = useDragnDrop<DragnDropState>();

    const state = getState();
    const showOriginal = !!state && (!state.dragging || !dragOriginal);
    const showAvatar = !!state?.dragging && state.draggingId === props.id;

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
                    scrollRequested: false,
                    dragZone,

                    getDragInfo(): DragAvatarInfo {
                        const localState = getState();
                        return {
                            id,
                            mouseShift: {
                                x: localState?.shiftX ?? 0,
                                y: localState?.shiftY ?? 0,
                            },
                        };
                    },

                    getTargetElem() {
                        return currentTargetElemRef.current;
                    },

                    initFromEvent(params: DragAvatarInitParam) {
                        const offset = getOffset(dragZoneRef.current);
                        setState((prev: DragnDropState) => ({
                            ...prev,
                            origLeft: prev.left,
                            origTop: prev.top,
                            shiftX: params.downX - offset.left,
                            shiftY: params.downY - offset.top,
                        }));

                        return true;
                    },

                    cancelAnimation() {
                        if (animationFrameRef.current) {
                            cancelAnimationFrame(animationFrameRef.current);
                            animationFrameRef.current = 0;
                        }
                    },

                    /** Scroll document if needed on drag avatar to top or bottom of screen */
                    scrollDocument(coords: Point) {
                        const scrollMargin = 30;
                        const docElem = document.documentElement;

                        if (coords.y > docElem.clientHeight - scrollMargin) {
                            if (docElem.scrollTop + docElem.clientHeight === docElem.scrollHeight) {
                                return;
                            }

                            this.scrollRequested = true;
                            docElem.scrollTop += scrollMargin;
                        } else if (coords.y < scrollMargin) {
                            if (docElem.scrollTop === 0) {
                                return;
                            }

                            this.scrollRequested = true;
                            docElem.scrollTop -= scrollMargin;
                        }
                    },

                    onDragMove(params: OnDragMoveParams) {
                        const { e } = params;
                        this.cancelAnimation();

                        const page = DragMaster.getEventPageCoordinates(e);
                        const client = DragMaster.getEventClientCoordinates(e);

                        currentTargetElemRef.current = DragMaster.getElementUnderClientXY(
                            avatarRef.current,
                            client.x,
                            client.y,
                        );

                        animationFrameRef.current = requestAnimationFrame(() => {
                            animationFrameRef.current = 0;

                            setState((prev: DragnDropState) => ({
                                ...prev,
                                left: page.x - prev.shiftX,
                                top: page.y - prev.shiftY,
                                dragging: true,
                                draggingId: props.id,
                            }));

                            this.scrollDocument(client);
                        });
                    },

                    onDragCancel() {
                        this.cancelAnimation();

                        setState((prev: DragnDropState) => ({
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

            onDragStart(params: OnDragStartParams) {
                const avatar = dragZone.makeAvatar();
                avatar?.initFromEvent?.(params);

                return avatar;
            },

            ...dragZoneProps,

            elem: dragZoneRef.current,
        };

        DragMaster.makeDraggable(dragZone as DragZone);
    }, []);

    useEffect(() => {
        setState((prev) => ({
            ...prev,
            left: (props.absolutePos && props.left) ? props.left : 0,
            origLeft: (props.absolutePos && props.left) ? props.left : 0,
            top: (props.absolutePos && props.top) ? props.top : 0,
            origTop: (props.absolutePos && props.top) ? props.top : 0,
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
