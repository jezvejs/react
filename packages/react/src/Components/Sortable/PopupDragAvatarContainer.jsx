import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

export const PopupDragAvatarContainer = (props) => {
    const { children } = props;

    const container = props.container ?? document.body;
    return createPortal(children, container);
};

PopupDragAvatarContainer.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
    container: PropTypes.object,
};
