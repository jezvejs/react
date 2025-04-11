import { expect, type Page } from '@playwright/test';
import {
    Menu,
    MenuState,
    MenuItemState,
    MenuItemType,
} from '@jezvejs/react-test';

import {
    findLastMenuItem,
    findMenuItem,
    getActiveItem,
    getItemById,
    getNextItem,
    getPreviousItem,
    isAvailableItem,
    mapItems,
} from './utils.ts';
import { asyncMap } from '../../utils/index.ts';

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

const defaultMenuItemProps: MenuItemState = {
    id: '',
    title: '',
    type: 'button',
    visible: true,
    disabled: false,
    active: false,
    selected: false,
    selectable: false,
};

const defaultCollapsibleGroupMenuItemProps: CollapsibleGroupsMenuItemState = {
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

const getMenuItemProps = (props: Partial<MenuItemState>): MenuItemState => ({
    ...defaultMenuItemProps,
    ...props,
});

const getCollapsibleGroupMenuItemProps = (
    props: Partial<CollapsibleGroupsMenuItemState>,
): CollapsibleGroupsMenuItemState => ({
    ...defaultCollapsibleGroupMenuItemProps,
    ...props,
});

const initialState: MenuPageState = {
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

const menuIds = [
    'defaultMenu',
    'checkboxSideMenu',
    'groupsMenu',
    'checkboxGroupMenu',
    'collapsibleGroupMenu',
];

export class MenuPage {
    readonly page: Page;

    defaultMenu: Menu | null = null;

    checkboxSideMenu: Menu | null = null;

    checkboxGroupMenu: Menu | null = null;

    collapsibleGroupMenu: Menu | null = null;

    singleMenuId: string;

    state: MenuPageState = initialState;

    constructor(page: Page, singleMenuId = '') {
        this.page = page;
        this.singleMenuId = singleMenuId;

        if (menuIds.includes(singleMenuId)) {
            this.createMenu(singleMenuId);
        } else {
            menuIds.forEach((menuId) => this.createMenu(menuId));
        }
    }

    createMenu(menuId: string) {
        if (!menuIds.includes(menuId)) {
            return;
        }

        this[menuId] = new Menu(this.page, this.page.locator(`#${menuId}`));
    }

    isSingleMenu() {
        return this.singleMenuId !== '' && menuIds.includes(this.singleMenuId);
    }

    async assertState(state: MenuPageState) {
        if (this.isSingleMenu()) {
            await this.assertMenuState(this.singleMenuId, state);
        } else {
            await asyncMap(menuIds, (menuId) => this.assertMenuState(menuId, state));
        }
    }

    isValidMenuId(menuId: string) {
        return menuIds.includes(menuId) && !!this[menuId];
    }

    async assertMenuState(menuId: string, state: MenuPageState) {
        if (!this.isValidMenuId(menuId)) {
            return;
        }

        await this[menuId].assertState(state[menuId]);
    }

    async waitForLoad(menuId = '') {
        await this.page.waitForLoadState('networkidle');

        if (menuId !== '' && this[menuId]) {
            await this[menuId].rootLocator.waitFor({ state: 'visible' });
        }
    }

    onClickMenuItem(menuId: string, itemId: string) {
        const menuState = this.state[menuId];
        const menuItems = menuState.items;

        const options = {
            includeGroupItems: menuState.allowActiveGroupHeader,
            includeChildItems: false,
        };

        const expectedState = {
            ...this.state,
            [menuId]: {
                ...this.state[menuId],
                items: mapItems(menuItems, (item) => (
                    (item.id === itemId)
                        ? ({ ...item, selected: !item.selected, active: true })
                        : ({ ...item, active: false })
                ), options),
            },
        };

        return expectedState;
    }

    onClickCheckboxGroupMenuItem(menuId: string, itemId: string) {
        const menuState = this.state[menuId];
        const menuItems = menuState.items;

        const options = {
            includeGroupItems: true,
            includeChildItems: true,
        };

        const expectedState = {
            ...this.state,
            [menuId]: {
                ...this.state[menuId],
                items: mapItems(
                    menuItems,
                    (item) => {
                        if (item.type === 'group' && item.id?.toString() === itemId) {
                            return {
                                ...item,
                                selected: !item.selected,
                                items: mapItems(
                                    item.items ?? [],
                                    (child) => ({ ...child, selected: !item.selected }),
                                    options,
                                ),
                            };
                        }

                        return (item.id === itemId)
                            ? ({ ...item, selected: !item.selected, active: true })
                            : ({ ...item, active: false });
                    },
                    options,
                ),
            },
        };

        return expectedState;
    }

    onClickCollapsibleGroupMenuItem(menuId: string, itemId: string) {
        const menuState = this.state[menuId];
        const menuItems = menuState.items;

        const options = {
            includeGroupItems: true,
            includeChildItems: true,
        };

        const childItemIds = {};

        const expectedState = {
            ...this.state,
            [menuId]: {
                ...this.state[menuId],
                items: mapItems(
                    menuItems,
                    (item: CollapsibleGroupsMenuItemState) => {
                        if (item.type === 'group' && item.id?.toString() === itemId) {
                            return {
                                ...item,
                                expanded: !item.expanded,
                                items: mapItems(
                                    item.items ?? [],
                                    (child) => {
                                        childItemIds[child.id] = { visible: !item.expanded };
                                        return child;
                                    },
                                    options,
                                ),
                            };
                        }

                        const additionalProps = childItemIds[item.id] ?? {};

                        const res = (item.id === itemId)
                            ? ({
                                ...item,
                                selected: !item.selected,
                                active: item.type !== 'group',
                                ...additionalProps,
                            })
                            : ({ ...item, active: false, ...additionalProps });

                        return res;
                    },
                    options,
                ),
            },
        };

        return expectedState;
    }

    async clickMenuItem(menuId: string, itemId: string) {
        expect(this.isValidMenuId(menuId)).toBeTruthy();

        const expectedState = this.onClickMenuItem(menuId, itemId);

        await this[menuId].clickById(itemId);
        await this.assertState(expectedState);

        this.state = expectedState;
    }

    async clickDefaultMenuItem(itemId: string) {
        return this.clickMenuItem('defaultMenu', itemId);
    }

    async clickCheckboxSideMenuItem(itemId: string) {
        return this.clickMenuItem('checkboxSideMenu', itemId);
    }

    async clickCheckboxGroupMenuItem(itemId: string) {
        const menuId = 'checkboxGroupMenu';
        expect(this.isValidMenuId(menuId)).toBeTruthy();

        const menuState = this.state[menuId];
        const menuItems = menuState.items;

        const targetItem = getItemById(itemId, menuItems);
        expect(targetItem).toBeTruthy();

        const expectedState = this.onClickCheckboxGroupMenuItem(menuId, itemId);

        if (targetItem.type === 'group') {
            await this[menuId].clickHeaderById(itemId);
        } else {
            await this[menuId].clickById(itemId);
        }

        await this.assertState(expectedState);

        this.state = expectedState;
    }

    async clickCollapsibleGroupMenuItem(itemId: string) {
        const menuId = 'collapsibleGroupMenu';
        expect(this.isValidMenuId(menuId)).toBeTruthy();

        const menuState = this.state[menuId];
        const menuItems = menuState.items;

        const targetItem = getItemById(itemId, menuItems);
        expect(targetItem).toBeTruthy();

        const expectedState = this.onClickCollapsibleGroupMenuItem(menuId, itemId);

        if (targetItem.type === 'group') {
            await this[menuId].clickHeaderById(itemId);
        } else {
            await this[menuId].clickById(itemId);
        }

        await this.assertState(expectedState);

        this.state = expectedState;
    }

    onFocusMenu(menuId) {
        const menuState = this.state[menuId];

        const options = {
            includeGroupItems: menuState.allowActiveGroupHeader,
            includeChildItems: false,
        };

        const expectedState = {
            ...this.state,
            ...(Object.fromEntries(
                Object.entries(this.state).map(([id, value]) => ([
                    id,
                    {
                        ...value,
                        items: mapItems(
                            value.items,
                            (item) => ({ ...item, active: false }),
                            options,
                        ),
                    },
                ])),
            )),
        };

        return expectedState;
    }

    async focusMenu(menuId: string) {
        expect(this.isValidMenuId(menuId)).toBeTruthy();

        const expectedState = this.onFocusMenu(menuId);

        await this[menuId].focus();
        await this.assertState(expectedState);

        this.state = expectedState;
    }

    activateMenuItemById(menuId: string, itemId: string | null) {
        expect(this.isValidMenuId(menuId)).toBeTruthy();

        const menuState = this.state[menuId];
        const menuItems = menuState.items;

        const options = {
            includeGroupItems: menuState.allowActiveGroupHeader,
            includeChildItems: false,
        };

        return {
            ...this.state,
            [menuId]: {
                ...this.state[menuId],
                items: mapItems(menuItems, (item) => (
                    ({ ...item, active: (item.id === itemId) })
                ), options),
            },
        };
    }

    activateNextItem(menuId: string) {
        const menuState = this.state[menuId];
        const menuItems = menuState.items;

        const availCallback = (item) => isAvailableItem(item, menuState);

        const options = {
            includeGroupItems: menuState.allowActiveGroupHeader,
            includeChildItems: false,
        };

        const activeItem = getActiveItem(menuState);
        let nextItem = (activeItem)
            ? getNextItem(activeItem.id, menuItems, availCallback, options)
            : findMenuItem(menuItems, availCallback, options);

        if (activeItem && !nextItem) {
            nextItem = findMenuItem(menuItems, availCallback);
        }

        return this.activateMenuItemById(menuId, nextItem?.id);
    }

    activatePreviousItem(menuId: string) {
        const menuState = this.state[menuId];
        const menuItems = menuState.items;

        const availCallback = (item) => isAvailableItem(item, menuState);

        const options = {
            includeGroupItems: menuState.allowActiveGroupHeader,
            includeChildItems: false,
        };

        const activeItem = getActiveItem(menuState);

        let nextItem = (activeItem)
            ? getPreviousItem(activeItem.id, menuItems, availCallback, options)
            : findLastMenuItem(menuItems, availCallback, options);

        if (activeItem && !nextItem) {
            nextItem = findLastMenuItem(menuItems, availCallback);
        }

        return this.activateMenuItemById(menuId, nextItem?.id);
    }

    onPressArrowDown(menuId: string) {
        return this.activateNextItem(menuId);
    }

    onPressArrowUp(menuId: string) {
        return this.activatePreviousItem(menuId);
    }

    onPressTab(menuId: string) {
        const menuState = this.state[menuId];
        const menuItems = menuState.items;

        const availCallback = (item) => isAvailableItem(item, menuState);

        const activeItem = getActiveItem(menuState);
        const lastItem = findLastMenuItem(menuItems, availCallback);

        if (activeItem && activeItem.id === lastItem.id) {
            return this.activateMenuItemById(menuId, null);
        }

        return this.activateNextItem(menuId);
    }

    getKeyPressExpectedState(menuId: string, key: string) {
        if (key === 'ArrowDown') {
            return this.onPressArrowDown(menuId);
        }
        if (key === 'ArrowUp') {
            return this.onPressArrowUp(menuId);
        }
        if (key === 'Tab') {
            return this.onPressTab(menuId);
        }

        return this.state;
    }

    async pressKey(menuId: string, key: string) {
        expect(this.isValidMenuId(menuId)).toBeTruthy();

        const expectedState = this.getKeyPressExpectedState(menuId, key);

        await this.page.keyboard.press(key);
        await this.assertState(expectedState);

        this.state = expectedState;
    }
}
