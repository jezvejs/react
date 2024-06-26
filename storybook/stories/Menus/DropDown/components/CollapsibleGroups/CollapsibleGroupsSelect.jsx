import { DropDown, DropDownHelpers, MenuHelpers } from '@jezvejs/react';

import { DropDownCollapsibleGroupsMenu } from './Menu/CollapsibleGroupsMenu.jsx';
import { DropDownCollapsibleMenuGroupHeader } from './GroupHeader/CollapsibleMenuGroupHeader.jsx';
import { DropDownCollapsibleMenuGroupItem } from './GroupItem/CollapsibleMenuGroupItem.jsx';

import { actions, reducer } from './reducer.js';

const isAvailableItem = (item, state) => {
    if (!DropDownHelpers.defaultIsAvailableItem(item, state)) {
        return false;
    }

    if (item.group) {
        const group = MenuHelpers.getItemById(item.group, state.items);
        return group?.expanded;
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

export const CollapsibleGroupsSelect = (p) => {
    const props = {
        ...defaultProps,
        ...p,
        components: {
            ...defaultProps.components,
            ...(p?.components ?? {}),
        },
    };

    const onGroupHeaderClick = ({ item, dispatch }) => {
        dispatch(actions.toggleGroup(item.id));
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

CollapsibleGroupsSelect.propTypes = {
    ...DropDown.propTypes,
};
