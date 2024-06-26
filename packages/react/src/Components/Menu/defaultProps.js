import { MenuCheckbox } from './components/Checkbox/MenuCheckbox.jsx';
import { MenuGroupHeader } from './components/GroupHeader/MenuGroupHeader.jsx';
import { MenuGroupItem } from './components/GroupItem/MenuGroupItem.jsx';
import { MenuItem } from './components/ListItem/MenuItem.jsx';
import { MenuList } from './components/List/MenuList.jsx';
import { MenuSeparator } from './components/Separator/MenuSeparator.jsx';

import { getItemProps, isAvailableItem } from './helpers.js';

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
