import { MenuCheckbox } from './components/Checkbox/MenuCheckbox.tsx';
import { MenuGroupHeader } from './components/GroupHeader/MenuGroupHeader.tsx';
import { MenuGroupItem } from './components/GroupItem/MenuGroupItem.tsx';
import { MenuItem } from './components/ListItem/MenuItem.tsx';
import { MenuList } from './components/List/MenuList.tsx';
import { MenuSeparator } from './components/Separator/MenuSeparator.tsx';

import { getItemProps, isAvailableItem } from './helpers.ts';

export const itemDefaultProps = {
    type: 'button',
    selectable: true,
    selected: false,
    disabled: false,
    renderNotSelected: false,
    components: {
        Check: null,
    },
};

export const getItemDefaultProps = () => itemDefaultProps;

export const defaultProps = {
    defaultItemType: 'button',
    iconAlign: 'left',
    checkboxSide: 'left',
    disabled: false,
    tabThrough: true,
    tabIndex: 0,
    loopNavigation: true,
    preventNavigation: false,
    focusItemOnHover: true,
    header: null,
    footer: null,
    onItemClick: null,
    isAvailableItem,
    getItemProps,
    getItemDefaultProps,
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
