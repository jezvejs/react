import { MenuItemState } from '@jezvejs/react-test';
import { CollapsibleGroupsMenuItemState, MenuPageComponents } from './types.ts';

export const defaultMenuItemProps: MenuItemState = {
    id: '',
    title: '',
    type: 'button',
    visible: true,
    disabled: false,
    active: false,
    selected: false,
    selectable: false,
};

export const defaultCollapsibleGroupMenuItemProps: CollapsibleGroupsMenuItemState = {
    id: '',
    title: '',
    type: 'button',
    visible: true,
    disabled: false,
    active: false,
    selectable: false,
    selected: false,
    expanded: false,
    items: [],
};

export const initialComponents: MenuPageComponents = {
    defaultMenu: null,
    checkboxSideMenu: null,
    groupsMenu: null,
    checkboxGroupMenu: null,
    collapsibleGroupMenu: null,
};
