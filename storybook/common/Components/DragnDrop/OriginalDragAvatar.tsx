import { createPortal } from 'react-dom';

export type OriginalDragAvatarProps = {
    children: React.ReactNode;
    container: Element | DocumentFragment | null;
};

export const OriginalDragAvatar = (props: OriginalDragAvatarProps) => {
    const { children } = props;

    const container = props.container ?? document.body;
    return createPortal(children, container);
};
