import { expect, type Locator, type Page } from '@playwright/test';

import { classNameRegExp, expectToHaveClass } from '../../utils/index.ts';

import { DropDownMultiSelectionItemState } from './DropDown.types.ts';

export const itemClassName = 'dd__selection-item';
export const itemActiveClassName = 'tag_active';
export const itemDisabledClassName = 'tag_disabled';

/**
 * DropDown multiple selection list item test component
 */
export class DropDownMultiSelectionItem {
    readonly page: Page;

    readonly locator: Locator;

    readonly titleLocator: Locator;

    readonly closeBtnLocator: Locator;

    constructor(page: Page, locator: Locator) {
        this.page = page;
        this.locator = locator;

        this.titleLocator = this.locator.locator('.tag__title');
        this.closeBtnLocator = this.locator.locator('.close-btn');
    }

    async assertState(expectedState: DropDownMultiSelectionItemState) {
        const {
            id,
            title,
            visible,
            disabled,
            active,
            multiple,
        } = expectedState;

        if (id) {
            await expect(this.locator).toHaveAttribute('data-id', id);
        }

        // Title
        await expect(this.titleLocator).toHaveText(title);

        // Type
        const classRegExp = classNameRegExp(itemClassName);
        await expect(this.locator).toHaveClass(classRegExp);

        // Visible
        await expect(this.locator).toBeVisible({ visible });

        // Active
        await expectToHaveClass(this.locator, itemActiveClassName, active);

        // Disabled
        if (multiple) {
            await expectToHaveClass(this.locator, itemDisabledClassName, disabled);
        }
    }

    async press(value: string) {
        return this.locator.press(value);
    }

    async click() {
        return this.locator.click();
    }

    async close() {
        return this.closeBtnLocator.click();
    }

    async focus() {
        return this.locator.focus();
    }

    async blur() {
        return this.locator.blur();
    }
}
