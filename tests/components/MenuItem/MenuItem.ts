import { expect, type Locator, type Page } from '@playwright/test';

export type MenuItemType =
    | 'button'
    | 'link'
    | 'checkbox'
    | 'group'
    | 'parent'
    | 'separator'
    ;

export const menuItemTypeClassNames = {
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

    constructor(page: Page, rootLocator: Locator) {
        this.page = page;
        this.rootLocator = rootLocator;

        this.contentLocator = this.rootLocator.locator('.menu-item__content');

        this.groupHeaderLocator = this.rootLocator.locator('.menu-group__header');
        this.itemsLocator = this.rootLocator.locator(':scope > .menu-list > .menu-item');
    }

    classNameRegExp(className: string) {
        return new RegExp(`(^|\\s)${className}(\\s|$)`, 'g');
    }

    async assertState(expectedState: MenuItemState) {
        const { id, visible, title, type, active, selected, items } = expectedState;

        if (id) {
            await expect(this.rootLocator).toHaveAttribute('data-id', id);
        }

        // Title
        if (type === 'group') {
            await expect(this.groupHeaderLocator).toHaveText(title);
        } else {
            await expect(this.contentLocator).toHaveText(title);
        }

        // Type
        const itemClassName = menuItemTypeClassNames[type];
        const classRegExp = this.classNameRegExp(itemClassName);
        await expect(this.rootLocator).toHaveClass(classRegExp);

        // Visible
        await expect(this.rootLocator).toBeVisible({ visible });

        // Active
        if (type !== 'group') {
            const activeClassRegExp = this.classNameRegExp(menuItemActiveClassName);
            if (active) {
                await expect(this.rootLocator).toHaveClass(activeClassRegExp);
            } else {
                await expect(this.rootLocator).not.toHaveClass(activeClassRegExp);
            }
        }

        // Selected
        if (type === 'checkbox') {
            const selectedClassRegExp = this.classNameRegExp(menuItemSelectedClassName);
            if (selected) {
                await expect(this.rootLocator).toHaveClass(selectedClassRegExp);
            } else {
                await expect(this.rootLocator).not.toHaveClass(selectedClassRegExp);
            }
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
