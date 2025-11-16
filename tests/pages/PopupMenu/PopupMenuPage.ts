import {
    Button,
    Menu,
    MenuItemState,
    MenuState,
} from '@jezvejs/react-test';
import { expect, type Page } from '@playwright/test';

import { asyncMap } from 'shared/utils.ts';

import { initialState } from './initialState.ts';
import {
    PopupMenuButtonId,
    PopupMenuId,
    PopupMenuPageComponents,
    PopupMenuPageComponentsIds,
    PopupMenuPageId,
    PopupMenuPageState,
} from './types.ts';
import {
    findLastMenuItem,
    findMenuItem,
    getActiveItem,
    getNextItem,
    getPopupIdByButton,
    getPopupIdByPage,
    getPreviousItem,
    isAvailableItem,
    mapItems,
} from './utils.ts';
import { initialComponents, initialPopupMenuComponents } from './defaultProps.ts';
import { popupMenuButtonIds, popupMenuPageIds } from './constants.ts';

const popupMenuIds = Object.keys(initialPopupMenuComponents) as PopupMenuId[];

const PAGE_ID_PREFIX = 'menu-popupmenu--';

export class PopupMenuPage {
    readonly page: Page;

    components: PopupMenuPageComponents = initialComponents;

    pageId: PopupMenuPageId | null = null;

    state: PopupMenuPageState = initialState;

    constructor(page: Page) {
        this.page = page;

        this.initPage(this.getPageId());
    }

    initPage(storyId: PopupMenuPageId | null) {
        this.pageId = storyId;

        this.init();
    }

    init() {
        const componentId = getPopupIdByPage(this.pageId);

        if (componentId && popupMenuIds.includes(componentId)) {
            this.createPopupMenu(componentId);
        } else if (this.pageId === 'docs') {
            popupMenuIds.forEach((menuId) => this.createPopupMenu(menuId));
        }
    }

    getPageId() {
        const url = new URL(this.page.url());
        const id = url.searchParams.get('id');
        if (!id?.startsWith(PAGE_ID_PREFIX)) {
            return null;
        }

        return id.substring(PAGE_ID_PREFIX.length) as PopupMenuPageId;
    }

    async loadStoryById(pageId: PopupMenuPageId) {
        await this.page.goto(`iframe.html?args=&globals=&id=${PAGE_ID_PREFIX}${pageId}&viewMode=story`);

        this.initPage(pageId);
    }

    async loadByComponentId(popupMenuId: PopupMenuId) {
        const pageId = popupMenuPageIds[popupMenuId] ?? null;
        const buttonId = popupMenuButtonIds[popupMenuId] ?? null;
        if (!pageId || !buttonId) {
            return;
        }

        await this.loadStoryById(pageId);
        await this.waitForLoad(buttonId);

        this.initPage(pageId);
    }

    async loadDefault() {
        await this.loadByComponentId('defaultPopupMenu');
    }

    async loadAbsolutePosition() {
        await this.loadByComponentId('absPositionPopupMenu');
    }

    async loadHideOnScroll() {
        await this.loadByComponentId('hideOnScrollPopupMenu');
    }

    async loadHideOnSelect() {
        await this.loadByComponentId('hideOnSelectPopupMenu');
    }

    async loadNestedMenus() {
        await this.loadByComponentId('nestedParentPopupMenu');
    }

    createPopupMenu(menuId: PopupMenuId | null | undefined) {
        if (!this.isValidMenuId(menuId)) {
            return;
        }

        this.components[menuId] = new Menu(this.page, this.page.locator(`#${menuId}`));

        const buttonId = popupMenuButtonIds[menuId] as PopupMenuButtonId;

        // console.log('createPopupMenu() menuId: ', menuId, ' buttonId: ', buttonId);

        if (buttonId) {
            this.components[buttonId] = new Button(this.page, this.page.locator(`#${buttonId}`));
        }
    }

    async assertState(state: PopupMenuPageState) {
        const pageId = this.pageId as PopupMenuId;
        if (pageId && popupMenuIds.includes(pageId)) {
            await this.assertMenuState(pageId, state);
        } else {
            await asyncMap(popupMenuIds, (menuId) => this.assertMenuState(menuId, state));
        }
    }

    isValidMenuId(menuId: string | null | undefined): menuId is PopupMenuId {
        const popupMenuId = menuId as PopupMenuId;
        return !!popupMenuId && popupMenuIds.includes(popupMenuId);
    }

    async assertMenuState(menuId: PopupMenuId, state: PopupMenuPageState) {
        if (!this.isValidMenuId(menuId)) {
            return;
        }

        await this.components[menuId]?.assertState(state[menuId] as MenuState);
    }

    async waitForLoad(menuId: PopupMenuPageComponentsIds | null = null) {
        await this.page.waitForLoadState('networkidle');

        if (menuId && this.components[menuId]) {
            await this.components[menuId].locator.waitFor({ state: 'visible' });
        }
        this.pageId = menuId as PopupMenuPageId;

        this.init();
    }

    onClickMenuButton(menuId: PopupMenuId) {
        const menuState = this.state[menuId];

        const expectedState = {
            ...this.state,
            [menuId]: {
                ...menuState,
                visible: !(menuState?.visible ?? false),
            },
        };

        return expectedState;
    }

    async clickMenuButton(menuButtonId: PopupMenuButtonId) {
        const menuId = getPopupIdByButton(menuButtonId);
        expect(this.isValidMenuId(menuId)).toBeTruthy();
        if (!menuId) {
            return;
        }

        const expectedState = this.onClickMenuButton(menuId);

        await this.components[menuButtonId]?.click();

        const expectedVisibility = expectedState[menuId]?.visible;
        const menuLocator = this.page.locator(`#${menuId}`);
        await menuLocator.waitFor({ state: expectedVisibility ? 'visible' : 'hidden' });

        await this.assertState(expectedState);

        this.state = expectedState;
    }

    onClickMenuItem(menuId: PopupMenuId, itemId: string) {
        const menuState = this.state[menuId];
        const menuItems = menuState?.items ?? [];

        const options = {
            includeGroupItems: menuState?.allowActiveGroupHeader ?? false,
            includeChildItems: false,
        };

        const hideOnSelect = menuState?.hideOnSelect ?? true;

        const expectedState = {
            ...this.state,
            [menuId]: {
                ...menuState,
                visible: !hideOnSelect,
                items: mapItems(menuItems, (item) => (
                    (item.id === itemId)
                        ? ({ ...item, selected: !item.selected, active: !hideOnSelect })
                        : ({ ...item, active: false })
                ), options),
            },
        };

        return expectedState;
    }

    async clickMenuItem(menuId: PopupMenuId, itemId: string) {
        expect(this.isValidMenuId(menuId)).toBeTruthy();

        const expectedState = this.onClickMenuItem(menuId, itemId);

        await this.components[menuId]?.clickById(itemId);
        await this.assertState(expectedState);

        this.state = expectedState;
    }

    async clickDefaultMenuItem(itemId: string) {
        return this.clickMenuItem('defaultPopupMenu', itemId);
    }

    async clickAbsPositionMenuItem(itemId: string) {
        return this.clickMenuItem('absPositionPopupMenu', itemId);
    }

    async clickHideOnScrollMenuItem(itemId: string) {
        return this.clickMenuItem('hideOnScrollPopupMenu', itemId);
    }

    async clickHideOnSelectMenuItem(itemId: string) {
        return this.clickMenuItem('hideOnSelectPopupMenu', itemId);
    }

    onFocusMenu(menuId: PopupMenuId) {
        const menuState = this.state[menuId];

        const options = {
            includeGroupItems: menuState?.allowActiveGroupHeader ?? false,
            includeChildItems: false,
        };

        const expectedState = {
            ...this.state,
            ...(Object.fromEntries(
                Object.entries(this.state).map(([id, value]) => ([
                    id,
                    this.isValidMenuId(id) ? (
                        {
                            ...value,
                            items: mapItems(
                                ((!!value && 'items' in value) ? value?.items : []) ?? [],
                                (item) => ({ ...item, active: false }),
                                options,
                            ),
                        })
                        : ({ ...value }),
                ])),
            )),
        };

        return expectedState;
    }

    async focusMenu(menuId: PopupMenuId) {
        expect(this.isValidMenuId(menuId)).toBeTruthy();

        const expectedState = this.onFocusMenu(menuId);

        await this.components[menuId]?.focus();
        await this.assertState(expectedState);

        this.state = expectedState;
    }

    activateMenuItemById(menuId: PopupMenuId, itemId: string | null) {
        expect(this.isValidMenuId(menuId)).toBeTruthy();

        const menuState = this.state[menuId];
        const menuItems = menuState?.items ?? [];

        const options = {
            includeGroupItems: menuState?.allowActiveGroupHeader ?? false,
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

    activateNextItem(menuId: PopupMenuId) {
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

    activatePreviousItem(menuId: PopupMenuId) {
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

    onPressArrowDown(menuId: PopupMenuId) {
        return this.activateNextItem(menuId);
    }

    onPressArrowUp(menuId: PopupMenuId) {
        return this.activatePreviousItem(menuId);
    }

    onPressTab(menuId: PopupMenuId) {
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

    getKeyPressExpectedState(menuId: PopupMenuId, key: string) {
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

    async pressKey(menuId: PopupMenuId, key: string) {
        expect(this.isValidMenuId(menuId)).toBeTruthy();

        const expectedState = this.getKeyPressExpectedState(menuId, key);

        await this.page.keyboard.press(key);
        await this.assertState(expectedState);

        this.state = expectedState;
    }
}
