import { asArray } from '@jezvejs/types';
import classNames from 'classnames';

import { MenuItemProps, MenuState } from '../../../Menu/types.ts';
import { PopupMenu } from '../../PopupMenu.tsx';
import { PopupMenuParentItemComponent, PopupMenuParentItemProps } from '../../types.ts';
import { PopupPositions } from '../../../../hooks/usePopupPosition/types.ts';
import { MenuHelpers } from '../../../Menu/MenuContainer.tsx';

const defaultProps = {
    selectable: true,
    items: [],
    components: {
    },
};

export const PopupMenuParentItem: PopupMenuParentItemComponent = (p: PopupMenuParentItemProps) => {
    const props = {
        ...defaultProps,
        ...p,
        components: {
            ...defaultProps.components,
            ...(p?.components ?? {}),
        },
    };

    const { id, className } = props;

    const items = asArray(props.items);

    const containerProps = {
        id: `${id}_submenu`,
        className: classNames('menu-item menu-group', className),
        'data-parent': id,
        parentId: id,
        items: items.map((item: MenuItemProps) => ({
            ...item,
            parentId: id,
            handleHideOnSelect: () => props.handleHideOnSelect?.(item),
            disabled: props.disabled || item.disabled,
        })),
        position: {
            position: 'right-start' as PopupPositions,
        },
        fixed: true,
        handleHideOnSelect: () => props.handleHideOnSelect?.(),

        isAvailableItem: (item: MenuItemProps, state: MenuState) => (
            MenuHelpers.isAvailableItem(item, state)
        ),
    };

    const { ListItem } = props.components;
    if (!ListItem) {
        return null;
    }

    const itemProps = {
        ...props,
    };

    return (
        <PopupMenu {...containerProps}>
            <ListItem {...itemProps} />
        </PopupMenu>
    );
};

PopupMenuParentItem.selector = '.menu-item.menu-item-parent';
