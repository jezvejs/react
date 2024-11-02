import { MenuCheckbox } from './components/Checkbox/MenuCheckbox.tsx';
import { MenuGroupHeader } from './components/GroupHeader/MenuGroupHeader.tsx';
import { MenuGroupItem } from './components/GroupItem/MenuGroupItem.tsx';
import { MenuItem } from './components/ListItem/MenuItem.tsx';
import { MenuList } from './components/List/MenuList.tsx';
import { MenuSeparator } from './components/Separator/MenuSeparator.tsx';

import { getItemProps, isAvailableItem } from './helpers.ts';
import { MenuItemType, MenuProps } from './types.ts';

export const itemDefaultProps = {
    type: 'button' as MenuItemType,
    selectable: true,
    selected: false,
    disabled: false,
    renderNotSelected: false,
    components: {
        Check: null,
    },
};

export const getItemDefaultProps = () => itemDefaultProps;

export const defaultProps: MenuProps = {
    id: '',
    itemSelector: null,
    defaultItemType: 'button',
    iconAlign: 'left',
    checkboxSide: 'left',
    multiple: false,
    disabled: false,
    tabThrough: true,
    loopNavigation: true,
    preventNavigation: false,
    focusItemOnHover: true,
    header: null,
    footer: null,
    onItemClick: null,
    isAvailableItem,
    getItemProps,
    getItemDefaultProps,
    onItemActivate: null,
    onGroupHeaderClick: null,
    renderNotSelected: false,
    allowActiveGroupHeader: false,
    activeItem: null,
    items: [],
    components: {
        Header: null,
        List: MenuList,
        ListItem: MenuItem,
        ListPlaceholder: null,
        Check: MenuCheckbox,
        Separator: MenuSeparator,
        GroupHeader: MenuGroupHeader,
        GroupItem: MenuGroupItem,
        Footer: null,
    },
};

export const getDefaultProps = () => defaultProps;
