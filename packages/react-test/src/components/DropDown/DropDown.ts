import { expect, type Locator, type Page } from '@playwright/test';
import { Menu, MenuState } from '../Menu/Menu.ts';
import { expectToHaveClass } from '../../utils/index.ts';

export interface DropDownState {
    id: string;
    attached: boolean;
    multiple: boolean;
    visible: boolean;
    open: boolean;
    value: string;
    textValue: string;
    menu?: MenuState;
}

/**
 * DropDown test component
 */
export class DropDown {
    readonly page: Page;

    readonly rootLocator: Locator;

    readonly singleSelectionLocator: Locator;

    readonly toggleBtnLocator: Locator;

    menuLocator: Locator | null = null;

    menu: Menu | null = null;

    id: string | null = null;

    constructor(page: Page, rootLocator: Locator) {
        this.page = page;
        this.rootLocator = rootLocator;

        this.singleSelectionLocator = this.rootLocator.locator('.dd__combo-value .dd__single-selection');
        this.toggleBtnLocator = this.rootLocator.locator('.dd__combo .dd__toggle-btn');
    }

    getMenuLocator() {
        return this.page.locator(`.menu.dd__list[data-parent="${this.id}"]`);
    }

    async parseContent() {
        if (!this.id) {
            this.id = await this.rootLocator.evaluate((el) => el?.id);
        }

        this.menuLocator = (this.id) ? this.getMenuLocator() : null;
        this.menu = (this.menuLocator) ? new Menu(this.page, this.menuLocator) : null;
    }

    async assertState(expectedState: DropDownState) {
        const {
            visible,
            value,
            textValue,
            open,
            menu,
            attached,
        } = expectedState;

        await this.parseContent();

        await expectToHaveClass(this.rootLocator, 'dd__container', !attached);
        await expectToHaveClass(this.rootLocator, 'dd__container_attached', attached);

        await expect(this.rootLocator).toBeVisible({ visible });
        await expect(this.rootLocator).toHaveAttribute('data-value', value);

        if (attached) {
            await expect(this.rootLocator).toHaveAttribute('data-value', value);
        }

        // Single selection
        await expect(this.singleSelectionLocator).toBeVisible({ visible: visible && !attached });
        if (!attached) {
            await expect(this.singleSelectionLocator).toHaveText(textValue);
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
