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

export const CollapsibleGroupsSelect = (props) => {
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

CollapsibleGroupsSelect.defaultProps = {
    ...DropDown.defaultProps,
    allowActiveGroupHeader: true,
    components: {
        ...DropDown.defaultProps.components,
        Menu: DropDownCollapsibleGroupsMenu,
        GroupHeader: DropDownCollapsibleMenuGroupHeader,
        GroupItem: DropDownCollapsibleMenuGroupItem,
    },
};
