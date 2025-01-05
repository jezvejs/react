import { asArray } from '@jezvejs/types';
import { useEffect, useMemo } from 'react';

import { MenuItemProps, MenuState } from '../../../Menu/types.ts';
import { PopupMenu } from '../../PopupMenu.tsx';
import { PopupMenuParentItemComponent, PopupMenuParentItemProps, PopupMenuState } from '../../types.ts';
import { PopupPositions } from '../../../../hooks/usePopupPosition/types.ts';
import { MenuHelpers } from '../../../Menu/MenuContainer.tsx';
import { useMenuStore } from '../../../Menu/hooks/useMenuStore.ts';

const defaultProps = {
    open: false,
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

    const { setState } = useMenuStore(props);

    const {
        id,
        parentId,
        container,
        position,
        open,
        activeItem,
    } = props;

    const items = useMemo(() => asArray(props.items), [props.items]);

    const setActive = (itemId: string | null) => {
        setState((prev: PopupMenuState) => MenuHelpers.setActiveItemById(prev, itemId));
    };

    const setMenuOpen = (value: boolean) => {
        setState((prev: PopupMenuState) => ({ ...prev, open: value }));
    };

    const handleOnClose = () => {
        setActive(id);
        setMenuOpen(false);
        props.onClose?.(id, parentId);
    };

    useEffect(() => {
        setState((prev) => ({
            ...prev,
            open: props.open ?? false,
        }));
    }, [props.open]);

    const containerProps = useMemo(() => ({
        id,
        'data-parent': parentId,
        parentId,
        items: items.map((item: MenuItemProps) => ({
            ...item,
            open: false,
            active: false,
            parentId: id,
            container,
            position,
            handleHideOnSelect: () => props.handleHideOnSelect?.(item),
            onClose: () => handleOnClose(),
            disabled: props.disabled || item.disabled,
        })),
        container,
        open,
        active: open,
        activeItem: null,
        position: {
            position: 'right-start' as PopupPositions,
            ...position,
            scrollOnOverflow: false,
        },
        fixed: true,
        useParentContext: true,
        hideOnScroll: false,
        handleHideOnSelect: () => props.handleHideOnSelect?.(),
        onClose: () => handleOnClose(),

        isAvailableItem: (item: MenuItemProps, state: MenuState) => (
            MenuHelpers.isAvailableItem(item, state)
        ),
    }), [id, parentId, items, open, activeItem]);

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
