import { MenuItemType, MenuState } from '@jezvejs/react-test';

export interface CollapsibleGroupsMenuItemState {
    id?: string;
    title: string;
    type: MenuItemType;
    visible: boolean;
    disabled: boolean;
    active: boolean;
    selectable: boolean;
    selected: boolean;
    expanded?: boolean;
    items?: CollapsibleGroupsMenuItemState[];
}

export interface CollapsibleGroupsMenuState {
    id: string;
    visible: boolean;
    items: CollapsibleGroupsMenuItemState[];
    allowActiveGroupHeader: boolean;
}

export interface MenuPageState {
    defaultMenu: MenuState;
    checkboxSideMenu: MenuState;
    groupsMenu: MenuState;
    checkboxGroupMenu: MenuState;
    collapsibleGroupMenu: CollapsibleGroupsMenuState;
}
