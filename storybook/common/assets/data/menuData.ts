import { MenuItemType } from '@jezvejs/react';

import SelectIcon from '../icons/select.svg';
import SearchIcon from '../icons/search.svg';

export const getDefaultItems = () => ([{
    id: 'selectBtnItem',
    icon: SelectIcon,
    title: 'Button item',
}, {
    id: 'separator1',
    type: 'separator' as MenuItemType,
}, {
    id: 'linkItem',
    type: 'link' as MenuItemType,
    title: 'Link item',
    icon: SearchIcon,
    url: '#123',
}, {
    id: 'noIconItem',
    title: 'No icon item',
}, {
    id: 'checkboxItem',
    type: 'checkbox' as MenuItemType,
    title: 'Checkbox item',
    selected: true,
}]);

export const getHorizontalItems = () => ([{
    id: 'selectBtnItem',
    title: 'Button item',
}, {
    id: 'separator1',
    type: 'separator' as MenuItemType,
}, {
    id: 'linkItem',
    type: 'link' as MenuItemType,
    title: 'Link item',
    url: '#123',
}, {
    id: 'noIconItem',
    title: 'Item 3',
}]);

export const groupItems = [{
    id: 'noGroupItem1',
    title: 'No group item 1',
}, {
    id: 'group1',
    type: 'group' as MenuItemType,
    title: 'Group 1',
    items: [{
        id: 'groupItem11',
        title: 'Group 1 item 1',
        group: 'group1',
    }, {
        id: 'groupItem12',
        title: 'Group 1 item 2',
        group: 'group1',
    }, {
        id: 'groupItem13',
        title: 'Group 1 item 3',
        group: 'group1',
    }],
}, {
    id: 'noGroupItem2',
    title: 'No group item 2',
}, {
    id: 'group2',
    type: 'group' as MenuItemType,
    title: 'Group 2',
    items: [{
        id: 'groupItem21',
        title: 'Group 2 item 1',
        group: 'group2',
    }],
}, {
    id: 'noGroupItem3',
    title: 'No group item 3',
}];

export const collapsibleGroupItems = [{
    id: 'noGroupItem1',
    title: 'No group item 1',
}, {
    id: 'group1',
    type: 'group' as MenuItemType,
    title: 'Group 1',
    expanded: false,
    items: [{
        id: 'groupItem11',
        title: 'Group 1 item 1',
        group: 'group1',
    }, {
        id: 'groupItem12',
        title: 'Group 1 item 2',
        group: 'group1',
    }, {
        id: 'groupItem13',
        title: 'Group 1 item 3',
        group: 'group1',
    }],
}, {
    id: 'noGroupItem2',
    title: 'No group item 2',
}, {
    id: 'group2',
    type: 'group' as MenuItemType,
    title: 'Group 2',
    expanded: false,
    items: [{
        id: 'groupItem21',
        title: 'Group 2 item 1',
        group: 'group2',
    }],
}, {
    id: 'noGroupItem3',
    title: 'No group item 3',
}];

export const checkboxGroupItems = [{
    id: 'noGroupItem1',
    title: 'No group item 1',
    type: 'checkbox' as MenuItemType,
}, {
    id: 'group1',
    type: 'group' as MenuItemType,
    title: 'Group 1',
    items: [{
        id: 'groupItem11',
        title: 'Group 1 item 1',
        type: 'checkbox' as MenuItemType,
    }, {
        id: 'groupItem12',
        title: 'Group 1 item 2',
        type: 'checkbox' as MenuItemType,
        disabled: true,
    }, {
        id: 'groupItem13',
        title: 'Group 1 item 3',
        type: 'checkbox' as MenuItemType,
    }],
}, {
    id: 'noGroupItem2',
    title: 'No group item 2',
    type: 'checkbox' as MenuItemType,
}, {
    id: 'group2',
    type: 'group' as MenuItemType,
    title: 'Group 2',
    disabled: true,
    items: [{
        id: 'groupItem21',
        title: 'Group 2 item 1',
        type: 'checkbox' as MenuItemType,
    }],
}, {
    id: 'noGroupItem3',
    title: 'No group item 3',
    type: 'checkbox' as MenuItemType,
}];
