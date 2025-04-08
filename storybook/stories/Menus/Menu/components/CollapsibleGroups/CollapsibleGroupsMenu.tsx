import { useCallback, useMemo } from 'react';
import {
    Menu,
    MenuHelpers,
    MenuItemProps,
    MenuProps,
    MenuState,
    OnGroupHeaderClickParam,
} from '@jezvejs/react';

import { CollapsibleMenuGroupHeader } from './GroupHeader/CollapsibleMenuGroupHeader.tsx';
import { CollapsibleMenuGroupItem } from './GroupItem/CollapsibleMenuGroupItem.tsx';
import { CollapsibleMenuItemProps } from './types.ts';

export type CollapsibleGroupsMenuProps = Partial<MenuProps>;

export const CollapsibleGroupsMenu = (props: CollapsibleGroupsMenuProps) => {
    const toggleGroup = useCallback((state: MenuState, id: string) => ({
        ...state,
        items: MenuHelpers.mapItems<CollapsibleMenuItemProps>(state.items ?? [], (item) => (
            (item.type === 'group' && item.id.toString() === id)
                ? { ...item, expanded: !item.expanded }
                : item
        ), { includeGroupItems: true }),
    }), []);

    const onGroupHeaderClick = useCallback(({ item, setState }: OnGroupHeaderClickParam) => {
        setState((prev) => toggleGroup(prev, item.id));
    }, []);

    const isAvailableItem = useCallback((item: MenuItemProps, state: MenuState) => {
        if (!MenuHelpers.isAvailableItem(item, state)) {
            return false;
        }

        if (item.group) {
            const { getItemById } = MenuHelpers;
            const group = getItemById(item.group, state.items) as CollapsibleMenuItemProps;
            return !!group?.expanded;
        }

        return true;
    }, []);

    const components = useMemo(() => ({
        ...props.components,
        GroupHeader: CollapsibleMenuGroupHeader,
        GroupItem: CollapsibleMenuGroupItem,
    }), [props.components]);

    return (
        <Menu
            {...props}
            onGroupHeaderClick={onGroupHeaderClick}
            isAvailableItem={isAvailableItem}
            allowActiveGroupHeader
            components={components}
        />
    );
};
