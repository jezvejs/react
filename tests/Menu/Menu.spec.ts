import { test } from '@playwright/test';
import { MenuPage } from '../pages/Menu/MenuPage.ts';

const loadStoryById = async ({ page }, storyId: string) => (
    page.goto(`iframe.html?args=&globals=&id=menu-menu--${storyId}&viewMode=story`)
);

const loadDefault = async ({ page }) => loadStoryById({ page }, 'default');
const loadCheckboxSide = async ({ page }) => loadStoryById({ page }, 'checkbox-side');
const loadGroups = async ({ page }) => loadStoryById({ page }, 'groups');
const loadCheckboxGroups = async ({ page }) => loadStoryById({ page }, 'checkbox-groups');
const loadCollapsibleGroups = async ({ page }) => loadStoryById({ page }, 'collapsible-groups');

test.describe('Menu', () => {
    test('Click by checkbox item', async ({ page }) => {
        await loadDefault({ page });

        let view = new MenuPage(page, 'defaultMenu');
        await view.waitForLoad('defaultMenu');

        await view.clickDefaultMenuItem('checkboxItem');
        await view.clickDefaultMenuItem('checkboxItem');

        await loadCheckboxSide({ page });

        view = new MenuPage(page, 'checkboxSideMenu');
        await view.waitForLoad('checkboxSideMenu');

        await view.clickCheckboxSideMenuItem('checkboxItem');
        await view.clickCheckboxSideMenuItem('leftSideCheckboxItem');
        await view.clickCheckboxSideMenuItem('checkboxItem');
    });

    test('Keyboard navigation', async ({ page }) => {
        await loadDefault({ page });

        let view = new MenuPage(page, 'defaultMenu');
        await view.waitForLoad('defaultMenu');

        await view.focusMenu('defaultMenu');
        await view.pressKey('defaultMenu', 'ArrowDown');
        await view.pressKey('defaultMenu', 'ArrowUp');
        await view.pressKey('defaultMenu', 'ArrowDown');
        await view.pressKey('defaultMenu', 'ArrowDown');
        await view.pressKey('defaultMenu', 'ArrowDown');
        await view.pressKey('defaultMenu', 'ArrowDown');
        await view.pressKey('defaultMenu', 'Tab');

        await loadGroups({ page });

        view = new MenuPage(page, 'groupsMenu');
        await view.waitForLoad('groupsMenu');

        await view.focusMenu('groupsMenu');
        await view.pressKey('groupsMenu', 'ArrowDown');
        await view.focusMenu('groupsMenu');
        await view.pressKey('groupsMenu', 'ArrowDown');
        await view.pressKey('groupsMenu', 'ArrowDown');
        await view.pressKey('groupsMenu', 'ArrowUp');
        await view.pressKey('groupsMenu', 'Tab');
    });

    test('Checkbox group menu', async ({ page }) => {
        await loadCheckboxGroups({ page });

        const view = new MenuPage(page, 'checkboxGroupMenu');
        await view.waitForLoad('checkboxGroupMenu');

        await view.clickCheckboxGroupMenuItem('noGroupItem1');
        await view.clickCheckboxGroupMenuItem('noGroupItem1');

        await view.clickCheckboxGroupMenuItem('group1');
        await view.clickCheckboxGroupMenuItem('group1');
        await view.clickCheckboxGroupMenuItem('groupItem13');
    });

    test('Collapsible group menu', async ({ page }) => {
        await loadCollapsibleGroups({ page });

        const view = new MenuPage(page, 'collapsibleGroupMenu');
        await view.waitForLoad('collapsibleGroupMenu');

        // Navigate over collapsed group
        await view.focusMenu('collapsibleGroupMenu');
        await view.pressKey('collapsibleGroupMenu', 'ArrowDown');
        await view.pressKey('collapsibleGroupMenu', 'ArrowDown');
        await view.pressKey('collapsibleGroupMenu', 'ArrowDown');

        await view.clickCollapsibleGroupMenuItem('noGroupItem1');

        await view.clickCollapsibleGroupMenuItem('group1');
        await view.clickCollapsibleGroupMenuItem('groupItem13');

        // Navigate through expanded group
        await view.focusMenu('collapsibleGroupMenu');
        await view.pressKey('collapsibleGroupMenu', 'ArrowDown');
        await view.pressKey('collapsibleGroupMenu', 'ArrowDown');
        await view.pressKey('collapsibleGroupMenu', 'ArrowDown');

        await view.clickCollapsibleGroupMenuItem('group1');
    });
});
