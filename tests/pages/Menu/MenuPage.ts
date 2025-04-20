import { Menu } from '@jezvejs/react-test';
import { expect, type Page } from '@playwright/test';

import { asyncMap } from '../../utils/index.ts';

import { initialState } from './initialState.ts';
import { CollapsibleGroupsMenuItemState, MenuPageState } from './types.ts';
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
