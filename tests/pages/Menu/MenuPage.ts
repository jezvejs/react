import { Menu, MenuItemState, MenuState } from '@jezvejs/react-test';
import { expect, type Page } from '@playwright/test';

import { asyncMap } from 'utils/index.ts';

import { initialState } from './initialState.ts';
import {
    CollapsibleGroupsMenuItemState,
    MenuId,
    MenuPageComponents,
    MenuPageId,
    MenuPageState,
} from './types.ts';
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
import { initialComponents } from './defaultProps.ts';

const menuIds = Object.keys(initialComponents) as MenuId[];

const PAGE_ID_PREFIX = 'menu-menu--';

export class MenuPage implements MenuPageComponents {
    readonly page: Page;

    defaultMenu: Menu | null = null;

    checkboxSideMenu: Menu | null = null;

    groupsMenu: Menu | null = null;

    checkboxGroupMenu: Menu | null = null;

    collapsibleGroupMenu: Menu | null = null;

    // components: MenuPageComponents;

    pageId: MenuPageId | null;

    state: MenuPageState = initialState;

    constructor(page: Page) {
        this.page = page;
        this.pageId = this.getPageId();

        this.init();
    }

    init() {
        const pageId = this.pageId as MenuId;

        if (pageId && menuIds.includes(pageId)) {
            this.createMenu(pageId);
        } else if (this.pageId === 'docs') {
            menuIds.forEach((menuId) => this.createMenu(menuId));
        }
    }

    getPageId() {
        const url = new URL(this.page.url());
        const id = url.searchParams.get('id');
        if (!id?.startsWith(PAGE_ID_PREFIX)) {
            return null;
        }

        return id.substring(PAGE_ID_PREFIX.length) as MenuPageId;
    }

    async loadStoryById(storyId: string) {
        this.page.goto(`iframe.html?args=&globals=&id=${PAGE_ID_PREFIX}${storyId}&viewMode=story`);
    }

    async loadDefault() {
        this.loadStoryById('default');
    }

    async loadCheckboxSide() {
        this.loadStoryById('checkbox-side');
    }

    async loadGroups() {
        this.loadStoryById('groups');
    }

    async loadCheckboxGroups() {
        this.loadStoryById('checkbox-groups');
    }

    async loadCollapsibleGroups() {
        this.loadStoryById('collapsible-groups');
    }

    createMenu(menuId: MenuId) {
        if (!menuIds.includes(menuId)) {
            return;
        }

        this[menuId] = new Menu(this.page, this.page.locator(`#${menuId}`));
    }

    async assertState(state: MenuPageState) {
        const pageId = this.pageId as MenuId;
        if (pageId && menuIds.includes(pageId)) {
            await this.assertMenuState(pageId, state);
        } else {
            await asyncMap(menuIds, (menuId) => this.assertMenuState(menuId, state));
        }
    }

    isValidMenuId(menuId: MenuId) {
        return menuIds.includes(menuId) && !!this[menuId];
    }

    async assertMenuState(menuId: MenuId, state: MenuPageState) {
        if (!this.isValidMenuId(menuId)) {
            return;
        }

        await this[menuId]?.assertState(state[menuId] as MenuState);
    }

    async waitForLoad(menuId: MenuId | null = null) {
        await this.page.waitForLoadState('networkidle');

        if (menuId && this[menuId]) {
            await this[menuId].rootLocator.waitFor({ state: 'visible' });
        }
        this.pageId = menuId;

        this.init();
    }

    onClickMenuItem(menuId: MenuId, itemId: string) {
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

    onClickCheckboxGroupMenuItem(menuId: MenuId, itemId: string) {
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

    onClickCollapsibleGroupMenuItem(menuId: MenuId, itemId: string) {
        const menuState = this.state[menuId];
        const menuItems = menuState.items;

        const options = {
            includeGroupItems: true,
            includeChildItems: true,
        };

        const childItemIds: Record<string, object> = {};

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
                                    (child: MenuItemState) => {
                                        if (child.id) {
                                            childItemIds[child.id] = { visible: !item.expanded };
                                        }
                                        return child;
                                    },
                                    options,
                                ),
                            };
                        }

                        const additionalProps = (item.id && childItemIds[item.id]) ?? {};

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

    async clickMenuItem(menuId: MenuId, itemId: string) {
        expect(this.isValidMenuId(menuId)).toBeTruthy();

        const expectedState = this.onClickMenuItem(menuId, itemId);

        await this[menuId]?.clickById(itemId);
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

        if (targetItem?.type === 'group') {
            await this[menuId]?.clickHeaderById(itemId);
        } else {
            await this[menuId]?.clickById(itemId);
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

        if (targetItem?.type === 'group') {
            await this[menuId]?.clickHeaderById(itemId);
        } else {
            await this[menuId]?.clickById(itemId);
        }

        await this.assertState(expectedState);

        this.state = expectedState;
    }

    onFocusMenu(menuId: MenuId) {
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

    async focusMenu(menuId: MenuId) {
        expect(this.isValidMenuId(menuId)).toBeTruthy();

        const expectedState = this.onFocusMenu(menuId);

        await this[menuId]?.focus();
        await this.assertState(expectedState);

        this.state = expectedState;
    }

    activateMenuItemById(menuId: MenuId, itemId: string | null) {
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

    activateNextItem(menuId: MenuId) {
        const menuState = this.state[menuId] as MenuState;
        const menuItems = menuState.items;

        const availCallback = (item: MenuItemState) => isAvailableItem(item, menuState);

        const options = {
            includeGroupItems: menuState.allowActiveGroupHeader,
            includeChildItems: false,
        };

        const activeItem = getActiveItem(menuState);
        let nextItem = (activeItem?.id)
            ? getNextItem(activeItem.id, menuItems, availCallback, options)
            : findMenuItem(menuItems, availCallback, options);

        if (activeItem && !nextItem) {
            nextItem = findMenuItem(menuItems, availCallback);
        }

        return this.activateMenuItemById(menuId, nextItem?.id ?? null);
    }

    activatePreviousItem(menuId: MenuId) {
        const menuState = this.state[menuId] as MenuState;
        const menuItems = menuState.items;

        const availCallback = (item: MenuItemState) => isAvailableItem(item, menuState);

        const options = {
            includeGroupItems: menuState.allowActiveGroupHeader,
            includeChildItems: false,
        };

        const activeItem = getActiveItem(menuState);

        let nextItem = (activeItem?.id)
            ? getPreviousItem(activeItem.id, menuItems, availCallback, options)
            : findLastMenuItem(menuItems, availCallback, options);

        if (activeItem && !nextItem) {
            nextItem = findLastMenuItem(menuItems, availCallback);
        }

        return this.activateMenuItemById(menuId, nextItem?.id ?? null);
    }

    onPressArrowDown(menuId: MenuId) {
        return this.activateNextItem(menuId);
    }

    onPressArrowUp(menuId: MenuId) {
        return this.activatePreviousItem(menuId);
    }

    onPressTab(menuId: MenuId) {
        const menuState = this.state[menuId] as MenuState;
        const menuItems = menuState.items;

        const availCallback = (item: MenuItemState) => isAvailableItem(item, menuState);

        const activeItem = getActiveItem(menuState);
        const lastItem = findLastMenuItem(menuItems, availCallback);

        if (activeItem && lastItem && activeItem.id === lastItem.id) {
            return this.activateMenuItemById(menuId, null);
        }

        return this.activateNextItem(menuId);
    }

    getKeyPressExpectedState(menuId: MenuId, key: string) {
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

    async pressKey(menuId: MenuId, key: string) {
        expect(this.isValidMenuId(menuId)).toBeTruthy();

        const expectedState = this.getKeyPressExpectedState(menuId, key);

        await this.page.keyboard.press(key);
        await this.assertState(expectedState);

        this.state = expectedState;
    }
}
