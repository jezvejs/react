import classNames from 'classnames';
import { Menu, MenuHelpers } from '@jezvejs/react';

import { CheckboxMenuGroupHeader } from './GroupHeader/CheckboxMenuGroupHeader.jsx';
import { CheckboxMenuGroupItem } from './GroupItem/CheckboxMenuGroupItem.jsx';

import './CheckboxGroupsMenu.scss';

export const CheckboxGroupsMenu = (props) => {
    const toggleGroup = (state, id) => ({
        ...state,
        items: state.items.map((item) => (
            (item.type === 'group' && item.id?.toString() === id)
                ? {
                    ...item,
                    selected: !item.selected,
                    items: MenuHelpers.mapItems(
                        item.items,
                        (child) => ({ ...child, selected: !item.selected }),
                    ),
                }
                : item
        )),
    });

    const onGroupHeaderClick = ({ item, setState }) => {
        setState((prev) => toggleGroup(prev, item.id));
    };

    const components = {
        ...props.components,
        GroupHeader: CheckboxMenuGroupHeader,
        GroupItem: CheckboxMenuGroupItem,
    };

    return (
        <Menu
            {...props}
            className={classNames(
                'checkbox-groups-menu',
                props.className,
            )}
            checkboxSide={'right'}
            defaultItemType={'checkbox'}
            onGroupHeaderClick={onGroupHeaderClick}
            allowActiveGroupHeader
            renderNotSelected
            components={components}
        />
    );
};

CheckboxGroupsMenu.propTypes = {
    ...Menu.propTypes,
};

CheckboxGroupsMenu.defaultProps = {
    ...Menu.defaultProps,
};
