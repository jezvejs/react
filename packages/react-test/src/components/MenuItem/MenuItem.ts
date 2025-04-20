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

    readonly rootLocator: Locator;

    readonly contentLocator: Locator;

    readonly groupHeaderLocator: Locator;

    readonly itemsLocator: Locator;

    readonly itemSelector: string;

    constructor(page: Page, rootLocator: Locator, itemSelector: string = defaultItemSelector) {
        this.page = page;
        this.rootLocator = rootLocator;

        if (!this.rootLocator) {
            throw new Error('Invalid locator');
        }

        this.contentLocator = this.rootLocator.locator('.menu-item__content');

        this.groupHeaderLocator = this.rootLocator.locator('.menu-group__header');

        this.itemSelector = itemSelector;
        this.itemsLocator = this.rootLocator.locator(itemSelector);
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
            await expect(this.rootLocator).toHaveAttribute('data-id', id);
        }

        // Title
        const titleLocator = (type === 'group') ? this.groupHeaderLocator : this.contentLocator;
        await expect(titleLocator).toHaveText(title);

        // Type
        const itemClassName = menuItemTypeClassNames[type] ?? '';
        const classRegExp = classNameRegExp(itemClassName);
        await expect(this.rootLocator).toHaveClass(classRegExp);

        // Visible
        await expect(this.rootLocator).toBeVisible({ visible });

        // Active
        if (type !== 'group') {
            await expectToHaveClass(this.rootLocator, menuItemActiveClassName, active);
        }

        // Selected
        if (type === 'checkbox') {
            await expectToHaveClass(this.rootLocator, menuItemSelectedClassName, selected);
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
        return this.rootLocator.press(value);
    }

    async click() {
        return this.rootLocator.click();
    }

    async clickHeader() {
        return this.groupHeaderLocator.click();
    }

    async focus() {
        return this.rootLocator.focus();
    }

    async blur() {
        return this.rootLocator.blur();
    }
}
