import {
    DropDown,
    DropDownHelpers,
    DropDownProps,
    DropDownState,
    MenuHelpers,
    MenuItemProps,
    MenuState,
    OnGroupHeaderClickParam,
} from '@jezvejs/react';

import { DropDownCollapsibleGroupsMenu } from './Menu/CollapsibleGroupsMenu.tsx';
import { DropDownCollapsibleMenuGroupHeader } from './GroupHeader/CollapsibleMenuGroupHeader.tsx';
import { DropDownCollapsibleMenuGroupItem } from './GroupItem/CollapsibleMenuGroupItem.tsx';

import { actions, reducer } from './reducer.ts';
import { CollapsibleMenuItemProps } from './types.ts';

const isAvailableItem = (item: MenuItemProps, state: MenuState) => {
    const ddItem = item as object as CollapsibleMenuItemProps;
    const ddState = state as object as DropDownState;
    if (!DropDownHelpers.defaultIsAvailableItem(ddItem, ddState)) {
        return false;
    }

    if (item.group) {
        const group = MenuHelpers.getItemById<CollapsibleMenuItemProps>(
            item.group,
            state.items ?? [],
        );
        return !!group?.expanded;
    }

    return true;
};

const defaultProps = {
    allowActiveGroupHeader: true,
    components: {
        Menu: DropDownCollapsibleGroupsMenu,
        GroupHeader: DropDownCollapsibleMenuGroupHeader,
        GroupItem: DropDownCollapsibleMenuGroupItem,
    },
};

export type CollapsibleGroupsSelectProps = Partial<DropDownProps>;

export const CollapsibleGroupsSelect: React.FC<CollapsibleGroupsSelectProps> = (p) => {
    const props = {
        ...defaultProps,
        ...p,
        components: {
            ...defaultProps.components,
            ...(p?.components ?? {}),
        },
    };

    const onGroupHeaderClick = ({ item, dispatch }: OnGroupHeaderClickParam<DropDownState>) => {
        dispatch?.(actions.toggleGroup(item.id));
    };

    return (
        <DropDown
            {...props}
            reducers={reducer}
            onGroupHeaderClick={onGroupHeaderClick}
            isAvailableItem={isAvailableItem}
            allowActiveGroupHeader
        />
    );
};
