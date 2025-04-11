import { expect, type Locator, type Page } from '@playwright/test';
import { MenuItem, MenuItemState } from '../MenuItem/MenuItem.ts';

export interface MenuState {
    id: string;
    visible: boolean;
    items: MenuItemState[];
    allowActiveGroupHeader: boolean;
}

/**
 * Menu test component
 */
export class Menu {
    readonly page: Page;

    readonly rootLocator: Locator;

    readonly itemsLocator: Locator;

    constructor(page: Page, rootLocator: Locator) {
        this.page = page;
        this.rootLocator = rootLocator;

        this.itemsLocator = this.rootLocator.locator(':scope > .menu-list > .menu-item');
    }

    async assertState(expectedState: MenuState) {
        const { visible, items } = expectedState;

        await expect(this.rootLocator).toBeVisible({ visible });

        await expect(this.itemsLocator).toHaveCount(items.length);
        const allItems = await this.itemsLocator.all();

        for (let index = 0; index < items.length; index++) {
            const itemLocator = allItems[index];
            const itemState = items[index];

            const item = new MenuItem(this.page, itemLocator);
            await item.assertState(itemState);
        }
    }

    async clickById(itemId: string) {
        const itemLocator = this.rootLocator.locator(`.menu-list > .menu-item[data-id="${itemId}"]`);
        const item = new MenuItem(this.page, itemLocator);
        return item.click();
    }

    async clickHeaderById(itemId: string) {
        const itemLocator = this.rootLocator.locator(`.menu-list > .menu-item[data-id="${itemId}"]`);
        const item = new MenuItem(this.page, itemLocator);
        return item.clickHeader();
    }

    async press(value: string) {
        return this.rootLocator.press(value);
    }

    async focus() {
        return this.rootLocator.focus();
    }

    async blur() {
        return this.rootLocator.blur();
    }
}
