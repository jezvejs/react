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

    readonly rootLocator: Locator;

    readonly titleLocator: Locator;

    readonly closeBtnLocator: Locator;

    constructor(page: Page, rootLocator: Locator) {
        this.page = page;
        this.rootLocator = rootLocator;

        this.titleLocator = this.rootLocator.locator('.tag__title');
        this.closeBtnLocator = this.rootLocator.locator('.close-btn');
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
            await expect(this.rootLocator).toHaveAttribute('data-id', id);
        }

        // Title
        await expect(this.titleLocator).toHaveText(title);

        // Type
        const classRegExp = classNameRegExp(itemClassName);
        await expect(this.rootLocator).toHaveClass(classRegExp);

        // Visible
        await expect(this.rootLocator).toBeVisible({ visible });

        // Active
        await expectToHaveClass(this.rootLocator, itemActiveClassName, active);

        // Disabled
        if (multiple) {
            await expectToHaveClass(this.rootLocator, itemDisabledClassName, disabled);
        }
    }

    async press(value: string) {
        return this.rootLocator.press(value);
    }

    async click() {
        return this.rootLocator.click();
    }

    async close() {
        return this.closeBtnLocator.click();
    }

    async focus() {
        return this.rootLocator.focus();
    }

    async blur() {
        return this.rootLocator.blur();
    }
}
