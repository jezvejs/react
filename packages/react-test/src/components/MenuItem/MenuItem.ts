import { expect, type Locator, type Page } from '@playwright/test';
import { classNameRegExp, expectToHaveClass } from '../../utils/index.ts';
import { defaultItemSelector } from '../Menu/Menu.ts';

export type MenuItemType =
    | 'button'
    | 'link'
    | 'checkbox'
    | 'group'
    | 'parent'
    | 'separator';

export const menuItemTypeClassNames: Partial<Record<MenuItemType, string>> = {
    button: 'button-menu-item',
    link: 'link-menu-item',
    checkbox: 'checkbox-menu-item',
    group: 'menu-group',
};

export const menuItemClassName = 'menu-item';
export const menuItemActiveClassName = 'menu-item_active';
export const menuItemSelectedClassName = 'menu-item_selected';

export interface MenuItemState {
    id?: string;
    title: string;
    type: MenuItemType;
    visible: boolean;
    disabled: boolean;
    active: boolean;
    selected: boolean;
    selectable: boolean;
    hidden?: boolean;
    group?: string;
    items?: MenuItemState[];
}

/**
 * MenuItem test component
 */
export class MenuItem {
    readonly page: Page;

    readonly locator: Locator;

    readonly contentLocator: Locator;

    readonly groupHeaderLocator: Locator;

    readonly itemsLocator: Locator;

    readonly itemSelector: string;

    constructor(page: Page, locator: Locator, itemSelector: string = defaultItemSelector) {
        this.page = page;
        this.locator = locator;

        if (!this.locator) {
            throw new Error('Invalid locator');
        }

        this.contentLocator = this.locator.locator('.menu-item__content');

        this.groupHeaderLocator = this.locator.locator('.menu-group__header');

        this.itemSelector = itemSelector;
        this.itemsLocator = this.locator.locator(itemSelector);
    }

    async assertState(expectedState: MenuItemState) {
        const {
            id,
            visible,
            title,
            type,
            active,
            selected,
        } = expectedState;
        const items = expectedState.items ?? [];

        if (id) {
            await expect(this.locator).toHaveAttribute('data-id', id);
        }

        // Title
        const titleLocator = (type === 'group') ? this.groupHeaderLocator : this.contentLocator;
        await expect(titleLocator).toHaveText(title);

        // Type
        const itemClassName = menuItemTypeClassNames[type] ?? '';
        const classRegExp = classNameRegExp(itemClassName);
        await expect(this.locator).toHaveClass(classRegExp);

        // Visible
        await expect(this.locator).toBeVisible({ visible });

        // Active
        if (type !== 'group') {
            await expectToHaveClass(this.locator, menuItemActiveClassName, active);
        }

        // Selected
        if (type === 'checkbox') {
            await expectToHaveClass(this.locator, menuItemSelectedClassName, selected);
        }

        // Child items
        if (type === 'group') {
            await expect(this.itemsLocator).toHaveCount(items.length);
            const allItems = await this.itemsLocator.all();

            for (let index = 0; index < items.length; index++) {
                const itemLocator = allItems[index];
                const itemState = items[index];

                const item = new MenuItem(this.page, itemLocator);
                await item.assertState(itemState);
            }
        }
    }

    async press(value: string) {
        return this.locator.press(value);
    }

    async click() {
        return this.locator.click();
    }

    async clickHeader() {
        return this.groupHeaderLocator.click();
    }

    async focus() {
        return this.locator.focus();
    }

    async blur() {
        return this.locator.blur();
    }
}
