import PropTypes from 'prop-types';

import { px } from '../../utils/common.js';
import { useDragnDrop } from '../../utils/DragnDrop/DragnDropProvider.jsx';

import { PopupDragAvatarContainer } from './PopupDragAvatarContainer.jsx';

export const SortableDragAvatar = (props) => {
    const { getState } = useDragnDrop();
    const state = getState();

    const style = {
        left: px(state.left),
        top: px(state.top),
    };

    if (state.dragging) {
        style.zIndex = 9999;
        style.position = 'absolute';
    }

    if (state.hidden) {
        style.display = 'none';
    }

    if (props.copyWidth) {
        style.width = px(state.width);
    }

    return (
        <PopupDragAvatarContainer container={props.container}>
            <div style={style} >
                {props.children}
            </div>
        </PopupDragAvatarContainer>
    );
};

SortableDragAvatar.propTypes = {
    id: PropTypes.string,
    copyWidth: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
    container: PropTypes.object,
};
