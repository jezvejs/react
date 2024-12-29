import { asArray } from '@jezvejs/types';
import { useMemo } from 'react';

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

    const { id, container, position } = props;

    const items = useMemo(() => asArray(props.items), [props.items]);

    const containerProps = useMemo(() => ({
        id: `${id}_submenu`,
        'data-parent': id,
        parentId: id,
        items: items.map((item: MenuItemProps) => ({
            ...item,
            parentId: id,
            container,
            position,
            handleHideOnSelect: () => props.handleHideOnSelect?.(item),
            disabled: props.disabled || item.disabled,
        })),
        container,
        position: {
            position: 'right-start' as PopupPositions,
            ...position,
            scrollOnOverflow: false,
        },
        fixed: true,
        useParentContext: true,
        hideOnScroll: false,
        handleHideOnSelect: () => props.handleHideOnSelect?.(),

        isAvailableItem: (item: MenuItemProps, state: MenuState) => (
            MenuHelpers.isAvailableItem(item, state)
        ),
    }), [id, items]);

    const itemProps = useMemo(() => ({
        ...props,
    }), [props]);

    const { ListItem } = props.components;
    if (!ListItem) {
        return null;
    }

    return (
        <PopupMenu {...containerProps}>
            <ListItem {...itemProps} />
        </PopupMenu>
    );
};

PopupMenuParentItem.selector = '.menu-item.menu-item-parent';
