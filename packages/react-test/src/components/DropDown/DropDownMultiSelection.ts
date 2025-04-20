import { expect, type Locator, type Page } from '@playwright/test';

import { DropDownMultiSelectionItem } from './DropDownMultiSelectionItem.ts';
import { DropDownMultiSelectionState } from './DropDown.types.ts';

/**
 * DropDown multiple selection test component
 */
export class DropDownMultipleSelection {
    readonly page: Page;

    readonly rootLocator: Locator;

    readonly itemsLocator: Locator;

    constructor(page: Page, rootLocator: Locator) {
        this.page = page;
        this.rootLocator = rootLocator;

        this.itemsLocator = this.rootLocator.locator('.dd__selection-item');
    }

    async assertState(expectedState: DropDownMultiSelectionState) {
        const { visible, items } = expectedState;

        await expect(this.rootLocator).toBeVisible({ visible });

        await expect(this.itemsLocator).toHaveCount(items.length);
        const allItems = await this.itemsLocator.all();

        for (let index = 0; index < items.length; index++) {
            const itemLocator = allItems[index];
            const menuItemState = items[index];
            const itemState = {
                id: menuItemState.id,
                title: menuItemState.title,
                visible: true,
                disabled: false,
                active: false,
                multiple: true,
            };

            const item = new DropDownMultiSelectionItem(this.page, itemLocator);
            await item.assertState(itemState);
        }
    }

    getItemLocator(itemId: string) {
        return this.rootLocator.locator(`.dd__selection-item[data-id="${itemId}"]`);
    }

    async clickById(itemId: string) {
        const itemLocator = this.getItemLocator(itemId);
        const item = new DropDownMultiSelectionItem(this.page, itemLocator);
        return item.click();
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
