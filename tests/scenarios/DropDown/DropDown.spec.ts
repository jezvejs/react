import { test } from '@playwright/test';
import { DropDownPage } from '../../pages/DropDown/DropDownPage.ts';
import { Fixtures } from '../../utils/types.ts';

const loadStoryById = async ({ page }: Fixtures, storyId: string) => (
    page.goto(`iframe.html?args=&globals=&id=menu-dropdown--${storyId}&viewMode=story`)
);

const loadInline = async ({ page }: Fixtures) => loadStoryById({ page }, 'inline');
const loadFullWidth = async ({ page }: Fixtures) => loadStoryById({ page }, 'full-width');
const loadFixedMenu = async ({ page }: Fixtures) => loadStoryById({ page }, 'fixed-menu');
const loadGroups = async ({ page }: Fixtures) => loadStoryById({ page }, 'groups');
const loadAttachedToBlock = async ({ page }: Fixtures) => loadStoryById({ page }, 'attach-to-block');
const loadAttachedToInline = async ({ page }: Fixtures) => loadStoryById({ page }, 'attach-to-inline');
const loadMultiSelect = async ({ page }: Fixtures) => loadStoryById({ page }, 'multiple-select');
const loadFilterSingleSelect = async ({ page }: Fixtures) => loadStoryById({ page }, 'filter-single');
const loadFilterMultiSelect = async ({ page }: Fixtures) => loadStoryById({ page }, 'filter-multiple');
const loadFilterAttachedToBlock = async ({ page }: Fixtures) => loadStoryById({ page }, 'filter-attach-to-block');
const loadFilterMultiAttachedToBlock = async ({ page }: Fixtures) => (
    loadStoryById({ page }, 'filter-multi-attach-to-block')
);
const loadFilterGroups = async ({ page }: Fixtures) => loadStoryById({ page }, 'filter-groups');
const loadFilterGroupsMultiSelect = async ({ page }: Fixtures) => (
    loadStoryById({ page }, 'filter-groups-multiple')
);

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

    test('Filter items', async ({ page }) => {
        await loadFilterSingleSelect({ page });

        const view = new DropDownPage(page, 'filterDropDown');
        await view.waitForLoad('filterDropDown');

        await view.toggleEnable('filterDropDown');
        await view.clickByToggleButton('filterDropDown');
        await view.filter('filterDropDown', '1');
        await view.filter('filterDropDown', '10');
        await view.filter('filterDropDown', '100');
    });

    test('Filter multiple items', async ({ page }) => {
        await loadFilterMultiSelect({ page });

        const view = new DropDownPage(page, 'filterMultiDropDown');
        await view.waitForLoad('filterMultiDropDown');

        await view.toggleEnable('filterMultiDropDown');
        await view.clickByToggleButton('filterMultiDropDown');
        await view.filter('filterMultiDropDown', '1');
        await view.filter('filterMultiDropDown', '10');
        await view.filter('filterMultiDropDown', '100');
    });

    test('Attached component with filter', async ({ page }) => {
        await loadFilterAttachedToBlock({ page });

        const view = new DropDownPage(page, 'attachedFilterDropDown');
        await view.waitForLoad('attachedFilterDropDown');

        await view.clickByContainer('attachedFilterDropDown');
        await view.filter('attachedFilterDropDown', '5');
        await view.filter('attachedFilterDropDown', '55');
        await view.filter('attachedFilterDropDown', '555');
    });

    test('Attached component with multi select filter', async ({ page }) => {
        await loadFilterMultiAttachedToBlock({ page });

        const view = new DropDownPage(page, 'attachedFilterMultipleDropDown');
        await view.waitForLoad('attachedFilterMultipleDropDown');

        await view.clickByContainer('attachedFilterMultipleDropDown');
        await view.filter('attachedFilterMultipleDropDown', '1');
        await view.filter('attachedFilterMultipleDropDown', '10');
        await view.filter('attachedFilterMultipleDropDown', '55');
    });

    test('Groups filter', async ({ page }) => {
        await loadFilterGroups({ page });

        const view = new DropDownPage(page, 'filterGroupsDropDown');
        await view.waitForLoad('filterGroupsDropDown');

        await view.clickByToggleButton('filterGroupsDropDown');
        await view.filter('filterGroupsDropDown', '1');
        await view.filter('filterGroupsDropDown', '10');
        await view.filter('filterGroupsDropDown', '100');
    });

    test('Groups with multi select filter', async ({ page }) => {
        await loadFilterGroupsMultiSelect({ page });

        const view = new DropDownPage(page, 'filterGroupsMultiDropDown');
        await view.waitForLoad('filterGroupsMultiDropDown');

        await view.clickByToggleButton('filterGroupsMultiDropDown');
        await view.filter('filterGroupsMultiDropDown', '1');
        await view.filter('filterGroupsMultiDropDown', '10');
        await view.filter('filterGroupsMultiDropDown', '100');
    });
});
