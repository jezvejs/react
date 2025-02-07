import { DragMaster, OnDragEndParams } from '@jezvejs/react';
import { useEffect, useRef } from 'react';

export type XAxisDropTargetProps = {
    id?: string;
    onDragEnd?: (params: OnDragEndParams) => void;
    children?: React.ReactNode;
};

export const XAxisDropTarget = (props: XAxisDropTargetProps) => {
    const dropTargetRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const dropTarget = {
            id: props.id ?? '',
            elem: dropTargetRef?.current,
            onDragEnd({ avatar }: OnDragEndParams) {
                avatar.onDragEnd?.();
            },
        };

        DragMaster.registerDropTarget(dropTarget);

        return () => DragMaster.unregisterDropTarget(dropTarget);
    }, []);

    return (
        <div ref={dropTargetRef} className="x-axis-area">
            {props.children}
        </div>
    );
};
