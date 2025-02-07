import classNames from 'classnames';
import {
    Menu,
    MenuHelpers,
    MenuProps,
    MenuState,
    OnGroupHeaderClickParam,
} from '@jezvejs/react';

import { CheckboxMenuGroupHeader } from './GroupHeader/CheckboxMenuGroupHeader.tsx';
import { CheckboxMenuGroupItem } from './GroupItem/CheckboxMenuGroupItem.tsx';

import './CheckboxGroupsMenu.scss';

export type CheckboxGroupsMenuProps = Partial<MenuProps>;
export type CheckboxGroupsMenuComponent = React.FC<CheckboxGroupsMenuProps>;

export const CheckboxGroupsMenu: CheckboxGroupsMenuComponent = (props) => {
    const toggleGroup = (state: MenuState, id: string) => ({
        ...state,
        items: (state.items ?? []).map((item) => (
            (item.type === 'group' && item.id?.toString() === id)
                ? {
                    ...item,
                    selected: !item.selected,
                    items: MenuHelpers.mapItems(
                        item.items ?? [],
                        (child) => ({ ...child, selected: !item.selected }),
                    ),
                }
                : item
        )),
    });

    const onGroupHeaderClick = ({ item, setState }: OnGroupHeaderClickParam) => {
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
