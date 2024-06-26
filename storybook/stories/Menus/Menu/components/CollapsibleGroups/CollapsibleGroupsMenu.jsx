import { Menu, MenuHelpers } from '@jezvejs/react';

import { CollapsibleMenuGroupHeader } from './GroupHeader/CollapsibleMenuGroupHeader.jsx';
import { CollapsibleMenuGroupItem } from './GroupItem/CollapsibleMenuGroupItem.jsx';

export const CollapsibleGroupsMenu = (props) => {
    const toggleGroup = (state, id) => ({
        ...state,
        items: state.items.map((item) => (
            (item.type === 'group' && item.id.toString() === id)
                ? { ...item, expanded: !item.expanded }
                : item
        )),
    });

    const onGroupHeaderClick = ({ item, setState }) => {
        setState((prev) => toggleGroup(prev, item.id));
    };

    const isAvailableItem = (item, state) => {
        if (!MenuHelpers.isAvailableItem(item, state)) {
            return false;
        }

        if (item.group) {
            const group = MenuHelpers.getItemById(item.group, state.items);
            return group?.expanded;
        }

        return true;
    };

    const components = {
        ...props.components,
        GroupHeader: CollapsibleMenuGroupHeader,
        GroupItem: CollapsibleMenuGroupItem,
    };

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

CollapsibleGroupsMenu.propTypes = {
    ...Menu.propTypes,
};
