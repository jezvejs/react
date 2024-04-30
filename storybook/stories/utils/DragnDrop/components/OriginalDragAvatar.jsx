import { createPortal } from 'react-dom';

export const OriginalDragAvatar = (props) => {
    const { children } = props;

    const container = props.container ?? document.body;
    return createPortal(children, container);
};
