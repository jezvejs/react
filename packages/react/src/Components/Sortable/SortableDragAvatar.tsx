import PropTypes from 'prop-types';

import { px } from '../../utils/common.ts';
import { useDragnDrop } from '../../utils/DragnDrop/DragnDropProvider.tsx';

import { PopupDragAvatarContainer } from './PopupDragAvatarContainer.tsx';

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

    const avatarState = {
        ...(state.avatarState ?? {}),
    };
    delete avatarState.columns;

    const contentProps = {
        ...avatarState,
        style: {
            ...(avatarState.style ?? {}),
            ...style,
        },
    };

    const content = (props.table)
        ? (<table {...contentProps} ><tbody>{props.children}</tbody></table>)
        : (<div {...contentProps} >{props.children}</div>);

    return (
        <PopupDragAvatarContainer container={props.container}>
            {content}
        </PopupDragAvatarContainer>
    );
};

SortableDragAvatar.propTypes = {
    id: PropTypes.string,
    table: PropTypes.bool,
    copyWidth: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
    container: PropTypes.object,
};
