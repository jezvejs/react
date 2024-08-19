import { createPortal } from 'react-dom';
import { ReactNode } from 'react';

export interface PopupDragAvatarContainerProps {
    children?: ReactNode,
    container?: Element | DocumentFragment,
}

export const PopupDragAvatarContainer = (props: PopupDragAvatarContainerProps) => {
    const { children } = props;

    const container = props.container ?? document.body;
    return createPortal(children, container);
};
