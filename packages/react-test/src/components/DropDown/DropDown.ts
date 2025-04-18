import { asArray } from '@jezvejs/types';
import { expect, type Locator, type Page } from '@playwright/test';

import { expectToHaveClass, waitForFunction } from '../../utils/index.ts';

import { Menu } from '../Menu/Menu.ts';

import { DropDownMultipleSelection } from './DropDownMultiSelection.ts';
import { DropDownState, DropDownMultiSelectionState } from './DropDown.types.ts';

export * from './DropDown.types.ts';

export const singleValueSelector = '.dd__combo-value .dd__single-selection';
export const multipleValueSelector = '.dd__combo-value .dd__selection';
export const toggleBtnSelector = '.dd__combo .dd__toggle-btn';

/**
 * DropDown test component
 */
export class DropDown {
    readonly page: Page;

    readonly rootLocator: Locator;

    readonly singleSelectionLocator: Locator;

    readonly multipleSelectionLocator: Locator;

    readonly toggleBtnLocator: Locator;

    menuLocator: Locator | null = null;

    menu: Menu | null = null;

    multipleSelection: DropDownMultipleSelection | null = null;

    id: string | null = null;

    value: string = '';

    constructor(page: Page, rootLocator: Locator) {
        this.page = page;
        this.rootLocator = rootLocator;

        this.singleSelectionLocator = this.rootLocator.locator(singleValueSelector);
        this.multipleSelectionLocator = this.rootLocator.locator(multipleValueSelector);
        this.toggleBtnLocator = this.rootLocator.locator(toggleBtnSelector);
    }

    getMenuLocator() {
        return this.page.locator(`.menu.dd__list[data-parent="${this.id}"]`);
    }

    async parseContent() {
        const element = await this.rootLocator.evaluate((el) => ({
            id: el.id,
            value: el.dataset.value ?? '',
        }));

        this.id = element.id;
        this.value = element.value;

        this.menuLocator = (this.id) ? this.getMenuLocator() : null;
        this.menu = (this.menuLocator) ? new Menu(this.page, this.menuLocator) : null;

        this.multipleSelection = new DropDownMultipleSelection(
            this.page,
            this.multipleSelectionLocator,
        );
    }

    async assertState(expectedState: DropDownState) {
        const {
            multiple,
            visible,
            value,
            textValue,
            open,
            menu,
            attached,
        } = expectedState;

        await this.parseContent();

        const strValue = asArray(value).join(',');

        await expectToHaveClass(this.rootLocator, 'dd__container', !attached);
        await expectToHaveClass(this.rootLocator, 'dd__container_attached', attached);

        await expect(this.rootLocator).toBeVisible({ visible });
        await expect(this.rootLocator).toHaveAttribute('data-value', strValue);

        // Single selection
        const showSingleSelection = !multiple && visible && !attached;
        await expect(this.singleSelectionLocator).toBeVisible({
            visible: showSingleSelection,
        });
        if (showSingleSelection) {
            await expect(this.singleSelectionLocator).toHaveText(textValue);
        }

        // Multiple selection
        if (multiple) {
            const selectedItems = menu?.items.filter((item) => !!item?.selected) ?? [];
            const multipleSelectionState: DropDownMultiSelectionState = {
                id: expectedState.id,
                visible: selectedItems.length > 0,
                items: selectedItems.map((item) => ({
                    id: item.id,
                    title: item.title,
                    visible: true,
                    disabled: false,
                    active: false,
                    multiple: true,
                })),
            };

            expect(this.multipleSelection).toBeTruthy();
            await this.multipleSelection?.assertState(multipleSelectionState);
        }

        // Menu
        if (this.menuLocator) {
            await expect(this.menuLocator).toBeVisible({ visible: open });
        }

        if (!open || !menu) {
            return;
        }

        await this.menu?.assertState(menu);
    }

    async waitForMenu(visible: boolean = true) {
        await this.parseContent();
        if (!this.menuLocator) {
            return;
        }

        await this.menuLocator.waitFor({ state: visible ? 'visible' : 'hidden' });
    }

    /**
     * Waits until component value to equal specified value
     * @param {string} expectedValue
     */
    async waitForValue(expectedValue: string) {
        await this.parseContent();
        if (!this.id || this.value === expectedValue) {
            return;
        }

        await waitForFunction(async () => {
            await this.parseContent();
            return this.value === expectedValue;
        });
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

    async clickByContainer() {
        return this.rootLocator.click();
    }

    async clickByToggleButton() {
        return this.toggleBtnLocator.click();
    }

    async clickItemById(itemId: string) {
        return this.menu?.clickById(itemId);
    }
}
