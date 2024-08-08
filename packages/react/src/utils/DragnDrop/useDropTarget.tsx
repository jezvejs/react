import { getOffset } from '@jezvejs/dom';
import { useEffect, useRef } from 'react';
import { DragMaster } from './DragMaster.ts';

interface useDropTargetProps {
    getTargetElem: () => void,
    hideHoverIndication: () => void,
    showHoverIndication: () => void,
    onDragMove: (params: object) => void,
    onDragEnd: (params: object) => void,
    onDragEnter: () => void,
    onDragLeave: () => void,
};

export function useDropTarget(props: useDropTargetProps) {
    const dropTargetRef = useRef(null);

    useEffect(() => {
        const dropTarget = {
            ...props,
            elem: dropTargetRef?.current,
            onDragEnd(params) {
                const { avatar, e } = params;

                const elem = dropTargetRef?.current;
                const offset = getOffset(elem);
                const border = {
                    top: elem.clientTop,
                    left: elem.clientLeft,
                };

                const avatarInfo = avatar.getDragInfo(e);
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
