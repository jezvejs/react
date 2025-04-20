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
export const inputSelector = '.dd__combo-value .dd__input';
export const menuInputSelector = '.dd__list .dd__input';
export const disabledClass = 'dd__container_disabled';
export const attachedClass = 'dd__container_attached';

/**
 * DropDown test component
 */
export class DropDown {
    readonly page: Page;

    readonly rootLocator: Locator;

    readonly singleSelectionLocator: Locator;

    readonly multipleSelectionLocator: Locator;

    readonly toggleBtnLocator: Locator;

    readonly inputLocator: Locator;

    readonly menuInputLocator: Locator;

    menuLocator: Locator | null = null;

    menu: Menu | null = null;

    multipleSelection: DropDownMultipleSelection | null = null;

    id: string | null = null;

    disabled: boolean = false;

    attached: boolean = false;

    value: string = '';

    inputString: string | null = null;

    constructor(page: Page, rootLocator: Locator) {
        this.page = page;
        this.rootLocator = rootLocator;

        this.singleSelectionLocator = this.rootLocator.locator(singleValueSelector);
        this.multipleSelectionLocator = this.rootLocator.locator(multipleValueSelector);
        this.toggleBtnLocator = this.rootLocator.locator(toggleBtnSelector);
        this.inputLocator = this.rootLocator.locator(inputSelector);
        this.menuInputLocator = this.rootLocator.locator(menuInputSelector);
    }

    getInputLocator() {
        return (this.attached) ? this.menuInputLocator : this.inputLocator;
    }

    getMenuLocator() {
        return this.page.locator(`.menu.dd__list[data-parent="${this.id}"]`);
    }

    async parseContent() {
        const element = await this.rootLocator.evaluate((el, cls) => ({
            id: el.id,
            value: el.dataset.value ?? '',
            disabled: el.classList.contains(cls.disabledClass),
            attached: el.classList.contains(cls.attachedClass),
        }), { disabledClass, attachedClass });

        this.id = element.id;
        this.value = element.value;
        this.disabled = element.disabled;
        this.attached = element.attached;

        const inputLocator = this.getInputLocator();
        const inputVisible = await inputLocator.isVisible();
        if (inputVisible) {
            const inputElement = await inputLocator.evaluate<
                { value: string | null; },
                HTMLInputElement
            >((el: HTMLInputElement | null) => ({
                value: el?.value ?? null,
            }));

            this.inputString = inputElement.value;
        } else {
            this.inputString = null;
        }

        this.menuLocator = (this.id) ? this.getMenuLocator() : null;
        this.menu = (this.menuLocator)
            ? new Menu(this.page, this.menuLocator)
            : null;

        this.multipleSelection = new DropDownMultipleSelection(
            this.page,
            this.multipleSelectionLocator,
        );
    }

    async assertState(expectedState: DropDownState) {
        const {
            multiple,
            visible,
            disabled,
            value,
            textValue,
            open,
            menu,
            attached,
            enableFilter,
            inputString = null,
        } = expectedState;

        await this.parseContent();

        const strValue = asArray(value).join(',');

        await expectToHaveClass(this.rootLocator, 'dd__container', !attached);
        await expectToHaveClass(this.rootLocator, attachedClass, attached);

        await expect(this.rootLocator).toBeVisible({ visible });
        await expect(this.rootLocator).toHaveAttribute('data-value', strValue);

        // Single selection
        const showSingleSelection = (
            !multiple
            && visible
            && !attached
            && (
                (enableFilter && disabled)
                || (!enableFilter)
            )
        );
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

        // Input
        const inputLocator = this.getInputLocator();
        if (enableFilter) {
            await expect(inputLocator).toBeVisible({ visible });

            if (inputString !== null) {
                await expect(inputLocator).toHaveValue(inputString);
            }
        }

        // Menu
        if (this.menuLocator) {
            await expect(this.menuLocator).toBeVisible({ visible: open });
        }

        if (!open || !menu) {
            return;
        }

        await this.menu?.assertState({
            ...menu,
            items: (
                (typeof inputString === 'string' && inputString.length > 0)
                    ? menu.filteredItems ?? []
                    : menu.items
            ),
        });
    }

    async waitForMenu(visible: boolean = true) {
        await this.parseContent();
        if (!this.menuLocator) {
            return;
        }

        await this.menuLocator.waitFor({ state: visible ? 'visible' : 'hidden' });
    }

    async waitForItemsCount(value: number) {
        await this.parseContent();
        await this.menu?.waitForItemsCount(value);
    }

    /**
     * Waits until the component value is equal to the specified value
     * @param {string} expectedValue
     */
    async waitForValue(expectedValue: string) {
        if (!this.id) {
            return;
        }

        await waitForFunction(async () => {
            await this.parseContent();
            return this.value === expectedValue;
        });
    }

    /**
     * Waits until the input component value is equal to the specified value
     * @param {string} expectedValue
     */
    async waitForInputValue(expectedValue: string) {
        if (!this.id) {
            return;
        }

        await waitForFunction(async () => {
            await this.parseContent();
            return this.inputString === expectedValue;
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

    async clearFilterValue() {
        const inputLocator = this.getInputLocator();
        return inputLocator.clear();
    }

    async inputFilterValue(value: string) {
        const inputLocator = this.getInputLocator();
        await this.clearFilterValue();
        return inputLocator.pressSequentially(value);
    }
}
