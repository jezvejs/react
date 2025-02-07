import { UseDragZoneProps, useDragZone, useDragnDrop } from '@jezvejs/react';
import {
    forwardRef,
    useImperativeHandle,
    useRef,
} from 'react';

import { usePortalElement } from '../../../../common/hooks/usePortalElement.tsx';

import { Box } from './Box.tsx';
import { OriginalDragAvatar } from './OriginalDragAvatar.tsx';

export type DefaultDragZoneRef = HTMLDivElement | null;

export type DefaultDragZoneProps = UseDragZoneProps & {
    Content?: React.FC,
};

export const DefaultDragZone = forwardRef<
    DefaultDragZoneRef,
    DefaultDragZoneProps
>((props, ref) => {
    const {
        dragOriginal = false,
        Content = Box,
        ...dragZoneProps
    } = props;

    const innerRef = useRef(null);
    useImperativeHandle<DefaultDragZoneRef, DefaultDragZoneRef>(ref, () => innerRef.current);

    const { getState } = useDragnDrop();

    const portalElement = usePortalElement();

    const {
        showOriginal,
        showAvatar,
        dragZoneRef,
        avatarRef,
    } = useDragZone<HTMLDivElement, HTMLDivElement>({
        ...dragZoneProps,
        dragOriginal,
    });

    const state = getState();

    const origProps = {
        ...state,
        id: props.id,
        title: props.title,
        absolutePos: props.absolutePos,
        dragging: false,
        hidden: !showOriginal,
    };

    const avatarProps = {
        ...state,
        id: props.id,
        title: props.title,
    };

    const content = <Content {...origProps} ref={dragZoneRef} />;

    const avatar = (showAvatar && (
        <OriginalDragAvatar container={portalElement}>
            <Content {...avatarProps} ref={avatarRef} />
        </OriginalDragAvatar>
    ));

    return (
        <div ref={innerRef}>
            {content}
            {avatar}
        </div>
    );
});

DefaultDragZone.displayName = 'DefaultDragZone';
