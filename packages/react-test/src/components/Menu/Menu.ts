import { expect, type Locator, type Page } from '@playwright/test';
import { MenuItem, MenuItemState } from '../MenuItem/MenuItem.ts';
import { toFlatList, waitForFunction } from '../../utils/index.ts';

export interface MenuState {
    id: string;
    visible: boolean;
    items: MenuItemState[];
    filteredItems: MenuItemState[];
    allowActiveGroupHeader: boolean;
}

export const defaultItemSelector = '.menu-list > .menu-item';

/**
 * Menu test component
 */
export class Menu {
    readonly page: Page;

    readonly rootLocator: Locator;

    readonly itemsLocator: Locator;

    readonly itemSelector: string;

    itemsCount: number = 0;

    constructor(page: Page, rootLocator: Locator, itemSelector: string = defaultItemSelector) {
        this.page = page;
        this.rootLocator = rootLocator;
        this.itemSelector = itemSelector;

        this.itemsLocator = this.rootLocator.locator(itemSelector);
    }

    async parseContent() {
        const element = await this.rootLocator.evaluate((el, itemSelector) => ({
            itemsCount: Array.from(el?.querySelectorAll(itemSelector) ?? []).length,
            itemsIds: (Array.from(el?.querySelectorAll(itemSelector) ?? [])
                .map((item: Element) => (item as HTMLElement)?.dataset?.id)),
        }), this.itemSelector);

        this.itemsCount = element.itemsCount;
    }

    async assertState(expectedState: MenuState) {
        const { visible, items } = expectedState;

        await expect(this.rootLocator).toBeVisible({ visible });

        const options = {
            includeGroupItems: true,
            includeChildItems: false,
        };

        const flatItems = toFlatList(items ?? [], options)
            .filter((item) => !!item && !item.hidden);

        await expect(this.itemsLocator).toHaveCount(flatItems.length);
        const allItems = await this.itemsLocator.all();

        for (let index = 0; index < flatItems.length; index++) {
            const itemLocator = allItems[index];
            const itemState = flatItems[index];

            const item = new MenuItem(this.page, itemLocator, this.itemSelector);
            await item.assertState(itemState);
        }
    }

    /**
     * Waits until the input component value is equal to the specified value
     * @param {string} expectedValue
     */
    async waitForItemsCount(itemsCount: number) {
        await waitForFunction(async () => {
            await this.parseContent();
            return this.itemsCount === itemsCount;
        });
    }

    getItemLocator(itemId: string) {
        return this.rootLocator.locator(`.menu-list > .menu-item[data-id="${itemId}"]`);
    }

    async clickById(itemId: string) {
        const itemLocator = this.getItemLocator(itemId);
        const item = new MenuItem(this.page, itemLocator);
        return item.click();
    }

    async clickHeaderById(itemId: string) {
        const itemLocator = this.getItemLocator(itemId);
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
