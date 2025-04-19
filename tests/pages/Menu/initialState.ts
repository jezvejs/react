import { MenuPageState } from './types.ts';
import { getCollapsibleGroupMenuItemProps, getMenuItemProps } from './utils.ts';

export const initialState: MenuPageState = {
    defaultMenu: {
        id: 'defaultMenu',
        visible: true,
        allowActiveGroupHeader: false,
        items: [
            getMenuItemProps({ id: 'selectBtnItem', title: 'Button item' }),
            getMenuItemProps({ id: 'linkItem', title: 'Link item', type: 'link' }),
            getMenuItemProps({ id: 'noIconItem', title: 'No icon item' }),
            getMenuItemProps({
                id: 'checkboxItem',
                title: 'Checkbox item',
                type: 'checkbox',
                selectable: true,
                selected: true,
            }),
        ],
        filteredItems: [],
    },
    checkboxSideMenu: {
        id: 'checkboxSideMenu',
        visible: true,
        allowActiveGroupHeader: false,
        items: [
            getMenuItemProps({ id: 'selectBtnItem', title: 'Button item' }),
            getMenuItemProps({ id: 'linkItem', title: 'Link item', type: 'link' }),
            getMenuItemProps({ id: 'noIconItem', title: 'No icon item' }),
            getMenuItemProps({
                id: 'checkboxItem',
                title: 'Checkbox item',
                type: 'checkbox',
                selectable: true,
                selected: true,
            }),
            getMenuItemProps({
                id: 'leftSideCheckboxItem',
                title: 'Checkbox item',
                type: 'checkbox',
                selectable: true,
                selected: true,
            }),
        ],
        filteredItems: [],
    },
    groupsMenu: {
        id: 'groupsMenu',
        visible: true,
        allowActiveGroupHeader: false,
        items: [
            getMenuItemProps({ id: 'noGroupItem1', title: 'No group item 1' }),
            getMenuItemProps({
                id: 'group1',
                title: 'Group 1',
                type: 'group',
                items: [
                    getMenuItemProps({ id: 'groupItem11', title: 'Group 1 item 1' }),
                    getMenuItemProps({ id: 'groupItem12', title: 'Group 1 item 2' }),
                    getMenuItemProps({ id: 'groupItem13', title: 'Group 1 item 3' }),
                ],
            }),
            getMenuItemProps({ id: 'noGroupItem2', title: 'No group item 2' }),
            getMenuItemProps({
                id: 'group2',
                title: 'Group 2',
                type: 'group',
                items: [
                    getMenuItemProps({ id: 'groupItem21', title: 'Group 2 item 1' }),
                ],
            }),
            getMenuItemProps({ id: 'noGroupItem3', title: 'No group item 3' }),
        ],
        filteredItems: [],
    },
    checkboxGroupMenu: {
        id: 'checkboxGroupMenu',
        visible: true,
        allowActiveGroupHeader: true,
        items: [
            getMenuItemProps({ id: 'noGroupItem1', title: 'No group item 1' }),
            getMenuItemProps({
                id: 'group1',
                title: 'Group 1',
                type: 'group',
                items: [
                    getMenuItemProps({ id: 'groupItem11', title: 'Group 1 item 1' }),
                    getMenuItemProps({ id: 'groupItem12', title: 'Group 1 item 2', disabled: true }),
                    getMenuItemProps({ id: 'groupItem13', title: 'Group 1 item 3' }),
                ],
            }),
            getMenuItemProps({ id: 'noGroupItem2', title: 'No group item 2' }),
            getMenuItemProps({
                id: 'group2',
                title: 'Group 2',
                type: 'group',
                disabled: true,
                items: [
                    getMenuItemProps({ id: 'groupItem21', title: 'Group 2 item 1' }),
                ],
            }),
            getMenuItemProps({ id: 'noGroupItem3', title: 'No group item 3' }),
        ],
        filteredItems: [],
    },
    collapsibleGroupMenu: {
        id: 'collapsibleGroupMenu',
        visible: true,
        allowActiveGroupHeader: true,
        items: [
            getCollapsibleGroupMenuItemProps({ id: 'noGroupItem1', title: 'No group item 1' }),
            getCollapsibleGroupMenuItemProps({
                id: 'group1',
                title: 'Group 1',
                type: 'group',
                expanded: false,
                items: [
                    getCollapsibleGroupMenuItemProps({
                        id: 'groupItem11',
                        title: 'Group 1 item 1',
                        visible: false,
                    }),
                    getCollapsibleGroupMenuItemProps({
                        id: 'groupItem12',
                        title: 'Group 1 item 2',
                        disabled: true,
                        visible: false,
                    }),
                    getCollapsibleGroupMenuItemProps({
                        id: 'groupItem13',
                        title: 'Group 1 item 3',
                        visible: false,
                    }),
                ],
            }),
            getCollapsibleGroupMenuItemProps({ id: 'noGroupItem2', title: 'No group item 2' }),
            getCollapsibleGroupMenuItemProps({
                id: 'group2',
                title: 'Group 2',
                type: 'group',
                disabled: true,
                expanded: false,
                items: [
                    getCollapsibleGroupMenuItemProps({
                        id: 'groupItem21',
                        title: 'Group 2 item 1',
                        visible: false,
                    }),
                ],
            }),
            getMenuItemProps({ id: 'noGroupItem3', title: 'No group item 3' }),
        ],
    },
};
