import { CSSProperties, ReactNode } from 'react';

import { px } from '../../utils/common.ts';
import { useDragnDrop } from '../../utils/DragnDrop/DragnDropProvider.tsx';

import { PopupDragAvatarContainer } from './PopupDragAvatarContainer.tsx';
import { SortableState } from './types.ts';

export interface SortableDragAvatarProps {
    id?: string,
    table: boolean,
    copyWidth?: boolean,
    children: ReactNode,
    container?: Element | DocumentFragment,
}

export const SortableDragAvatar = (props: SortableDragAvatarProps) => {
    const dragnDrop = useDragnDrop();
    if (!dragnDrop) {
        return null;
    }

    const state = dragnDrop.getState() as SortableState;

    const style: CSSProperties = {
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
