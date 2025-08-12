import { test as baseTest } from '@playwright/test';
import { MenuPage } from '../../pages/Menu/MenuPage.ts';

export interface MenuPageFixture {
    menuPage: MenuPage;
}

const test = baseTest.extend<MenuPageFixture>({
    menuPage: async ({ page }, use) => {
        const menuPage = new MenuPage(page);
        await use(menuPage);
    },
});

test.describe('Menu', () => {
    test('Click by checkbox item', async ({ menuPage }) => {
        await menuPage.loadDefault();
        await menuPage.waitForLoad('defaultMenu');

        await menuPage.clickDefaultMenuItem('checkboxItem');
        await menuPage.clickDefaultMenuItem('checkboxItem');

        await menuPage.loadCheckboxSide();
        await menuPage.waitForLoad('checkboxSideMenu');

        await menuPage.clickCheckboxSideMenuItem('checkboxItem');
        await menuPage.clickCheckboxSideMenuItem('leftSideCheckboxItem');
        await menuPage.clickCheckboxSideMenuItem('checkboxItem');
    });

    test('Keyboard navigation', async ({ menuPage }) => {
        await menuPage.loadDefault();
        await menuPage.waitForLoad('defaultMenu');

        await menuPage.focusMenu('defaultMenu');
        await menuPage.pressKey('defaultMenu', 'ArrowDown');
        await menuPage.pressKey('defaultMenu', 'ArrowUp');
        await menuPage.pressKey('defaultMenu', 'ArrowDown');
        await menuPage.pressKey('defaultMenu', 'ArrowDown');
        await menuPage.pressKey('defaultMenu', 'ArrowDown');
        await menuPage.pressKey('defaultMenu', 'ArrowDown');
        await menuPage.pressKey('defaultMenu', 'Tab');

        await menuPage.loadGroups();
        await menuPage.waitForLoad('groupsMenu');

        await menuPage.focusMenu('groupsMenu');
        await menuPage.pressKey('groupsMenu', 'ArrowDown');
        await menuPage.focusMenu('groupsMenu');
        await menuPage.pressKey('groupsMenu', 'ArrowDown');
        await menuPage.pressKey('groupsMenu', 'ArrowDown');
        await menuPage.pressKey('groupsMenu', 'ArrowUp');
        await menuPage.pressKey('groupsMenu', 'Tab');
    });

    test('Checkbox group menu', async ({ menuPage }) => {
        await menuPage.loadCheckboxGroups();
        await menuPage.waitForLoad('checkboxGroupMenu');

        await menuPage.clickCheckboxGroupMenuItem('noGroupItem1');
        await menuPage.clickCheckboxGroupMenuItem('noGroupItem1');

        await menuPage.clickCheckboxGroupMenuItem('group1');
        await menuPage.clickCheckboxGroupMenuItem('group1');
        await menuPage.clickCheckboxGroupMenuItem('groupItem13');
    });

    test('Collapsible group menu', async ({ menuPage }) => {
        await menuPage.loadCollapsibleGroups();
        await menuPage.waitForLoad('collapsibleGroupMenu');

        // Navigate over collapsed group
        await menuPage.focusMenu('collapsibleGroupMenu');
        await menuPage.pressKey('collapsibleGroupMenu', 'ArrowDown');
        await menuPage.pressKey('collapsibleGroupMenu', 'ArrowDown');
        await menuPage.pressKey('collapsibleGroupMenu', 'ArrowDown');

        await menuPage.clickCollapsibleGroupMenuItem('noGroupItem1');

        await menuPage.clickCollapsibleGroupMenuItem('group1');
        await menuPage.clickCollapsibleGroupMenuItem('groupItem13');

        // Navigate through expanded group
        await menuPage.focusMenu('collapsibleGroupMenu');
        await menuPage.pressKey('collapsibleGroupMenu', 'ArrowDown');
        await menuPage.pressKey('collapsibleGroupMenu', 'ArrowDown');
        await menuPage.pressKey('collapsibleGroupMenu', 'ArrowDown');

        await menuPage.clickCollapsibleGroupMenuItem('group1');
    });
});
