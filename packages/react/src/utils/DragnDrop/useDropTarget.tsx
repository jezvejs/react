import { getOffset } from '@jezvejs/dom';
import { useEffect, useRef } from 'react';
import { DragMaster } from './DragMaster.ts';
import { DragAvatar, DropTarget, OnDragEndParams } from './types.ts';

export interface UseDropTargetProps extends DropTarget {
    getTargetElem?: (avatar: DragAvatar, e?: Event) => HTMLElement | null,

    hideHoverIndication?: (avatar?: DragAvatar) => void,

    showHoverIndication?: (avatar: DragAvatar) => void,

    applyNewTarget?: (avatar: DragAvatar, elem: HTMLElement) => void,
}

export function useDropTarget(props: UseDropTargetProps) {
    const dropTargetRef = useRef<Element | null>(null);

    useEffect(() => {
        const dropTarget: DropTarget = {
            ...props,

            elem: dropTargetRef?.current,

            onDragEnd(params: OnDragEndParams) {
                const { avatar, e } = params;

                const elem = dropTargetRef?.current;
                const offset = getOffset(elem);
                const border = {
                    top: elem?.clientTop ?? 0,
                    left: elem?.clientLeft ?? 0,
                };

                const avatarInfo = avatar.getDragInfo?.(e);
                avatar.onDragEnd?.();

                props.onDragEnd?.({
                    ...params,
                    avatarInfo,
                    dropTarget,
                    offset,
                    border,
                });
            },
        };

        DragMaster.registerDropTarget(dropTarget);

        return () => DragMaster.unregisterDropTarget(dropTarget);
    }, []);

    return {
        dropTargetRef,
    };
}
