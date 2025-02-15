import { DragMaster, DropTarget, OnDragEndParams } from '@jezvejs/react';
import { useEffect, useRef } from 'react';

import { DefaultDragZone } from './DefaultDragZone.tsx';
import { BoxProps } from './Box.tsx';

export type DefaultDropTargetProps = DropTarget & {
    id: string;
    items?: BoxProps[];
    dragOriginal?: boolean;
    onDragEnd?: (param: OnDragEndParams) => void;
};

export const DefaultDropTarget = (props: DefaultDropTargetProps) => {
    const dropTargetRef = useRef(null);

    useEffect(() => {
        const dropTarget = {
            ...props,
            id: props.id,
            elem: dropTargetRef?.current,
            onDragEnd(params: OnDragEndParams) {
                const { avatar, e } = params;

                const avatarInfo = avatar.getDragInfo(e);
                avatar.onDragEnd?.();

                props.onDragEnd?.({
                    avatar,
                    avatarInfo,
                    e,
                    dropTarget,
                });
            },
        };

        DragMaster.registerDropTarget(dropTarget);

        return () => DragMaster.unregisterDropTarget(dropTarget);
    }, []);

    return (
        <div ref={dropTargetRef} className="inner-drop">
            {props.items?.map((item) => (
                <DefaultDragZone key={`defdragzone_${item.id}`} {...item} id={item?.id ?? ''} />
            ))}
        </div>
    );
};
