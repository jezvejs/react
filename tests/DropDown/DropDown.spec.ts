import { test } from '@playwright/test';
import { DropDownPage } from '../pages/DropDown/DropDownPage.ts';

const loadStoryById = async ({ page }, storyId: string) => (
    page.goto(`iframe.html?args=&globals=&id=menu-dropdown--${storyId}&viewMode=story`)
);

const loadInline = async ({ page }) => loadStoryById({ page }, 'inline');
const loadFullWidth = async ({ page }) => loadStoryById({ page }, 'full-width');
const loadFixedMenu = async ({ page }) => loadStoryById({ page }, 'fixed-menu');
const loadGroups = async ({ page }) => loadStoryById({ page }, 'groups');
const loadAttachedToBlock = async ({ page }) => loadStoryById({ page }, 'attach-to-block');
const loadAttachedToInline = async ({ page }) => loadStoryById({ page }, 'attach-to-inline');
const loadMultiSelect = async ({ page }) => loadStoryById({ page }, 'multiple-select');

test.describe('DropDown', () => {
    test('Toggle menu by click on toggle button', async ({ page }) => {
        await loadInline({ page });

        const view = new DropDownPage(page, 'inlineDropDown');
        await view.waitForLoad('inlineDropDown');

        await view.clickByToggleButton('inlineDropDown');
        await view.clickByToggleButton('inlineDropDown');
    });

    test('Toggle menu by click on container', async ({ page }) => {
        await loadFullWidth({ page });

        const view = new DropDownPage(page, 'fullWidthDropDown');
        await view.waitForLoad('fullWidthDropDown');

        await view.clickByToggleButton('fullWidthDropDown');
        await view.clickByToggleButton('fullWidthDropDown');
    });

    test('Toggle attached to block element', async ({ page }) => {
        await loadAttachedToBlock({ page });

        const view = new DropDownPage(page, 'attachedToBlockDropDown');
        await view.waitForLoad('attachedToBlockDropDown');

        await view.clickByContainer('attachedToBlockDropDown');
        await view.clickByContainer('attachedToBlockDropDown');
        await view.clickByContainer('attachedToBlockDropDown');
    });

    test('Toggle attached to inline element', async ({ page }) => {
        await loadAttachedToInline({ page });

        const view = new DropDownPage(page, 'attachedToInlineDropDown');
        await view.waitForLoad('attachedToInlineDropDown');

        await view.clickByContainer('attachedToInlineDropDown');
        await view.clickByContainer('attachedToInlineDropDown');
        await view.clickByContainer('attachedToInlineDropDown');
    });

    test('Select item by click', async ({ page }) => {
        await loadInline({ page });

        const view = new DropDownPage(page, 'inlineDropDown');
        await view.waitForLoad('inlineDropDown');

        await view.clickByToggleButton('inlineDropDown');
        await view.clickItemById('inlineDropDown', '4');

        await view.clickByToggleButton('inlineDropDown');
        await view.clickItemById('inlineDropDown', '6');
    });

    test('Fixed menu popup', async ({ page }) => {
        await loadFixedMenu({ page });

        const view = new DropDownPage(page, 'fixedMenuDropDown');
        await view.waitForLoad('fixedMenuDropDown');

        await view.clickByToggleButton('fixedMenuDropDown');
        await view.clickItemById('fixedMenuDropDown', '2');

        await view.clickByToggleButton('fixedMenuDropDown');
        await view.clickItemById('fixedMenuDropDown', '3');
    });

    test('Groups', async ({ page }) => {
        await loadGroups({ page });

        const view = new DropDownPage(page, 'groupsDropDown');
        await view.waitForLoad('groupsDropDown');

        await view.clickByToggleButton('groupsDropDown');
        await view.clickItemById('groupsDropDown', 'groupItem12');

        await view.clickByToggleButton('groupsDropDown');
        await view.clickItemById('groupsDropDown', 'groupItem26');
    });

    test('Multiple select', async ({ page }) => {
        await loadMultiSelect({ page });

        const view = new DropDownPage(page, 'multipleSelectDropDown');
        await view.waitForLoad('multipleSelectDropDown');

        await view.clickByToggleButton('multipleSelectDropDown');
        await view.clickItemById('multipleSelectDropDown', '1');
        await view.clickItemById('multipleSelectDropDown', '2');
        await view.clickItemById('multipleSelectDropDown', '4');
        await view.clickItemById('multipleSelectDropDown', '2');
        await view.clickByToggleButton('multipleSelectDropDown');
    });
});
