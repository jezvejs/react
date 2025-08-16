import { test as baseTest } from '@playwright/test';
import { DropDownPage } from 'pages/DropDown/DropDownPage.ts';

export interface DropDownPageFixture {
    dropDownPage: DropDownPage;
}

const test = baseTest.extend<DropDownPageFixture>({
    dropDownPage: async ({ page }, use) => {
        const dropDownPage = new DropDownPage(page);
        await use(dropDownPage);
    },
});

test.describe('DropDown', () => {
    test('Toggle menu by click on toggle button', async ({ dropDownPage }) => {
        await dropDownPage.loadInline();
        await dropDownPage.waitForLoad('inlineDropDown');

        await dropDownPage.clickByToggleButton('inlineDropDown');
        await dropDownPage.clickByToggleButton('inlineDropDown');
    });

    test('Toggle menu by click on container', async ({ dropDownPage }) => {
        await dropDownPage.loadFullWidth();
        await dropDownPage.waitForLoad('fullWidthDropDown');

        await dropDownPage.clickByToggleButton('fullWidthDropDown');
        await dropDownPage.clickByToggleButton('fullWidthDropDown');
    });

    test('Toggle attached to block element', async ({ dropDownPage }) => {
        await dropDownPage.loadAttachedToBlock();
        await dropDownPage.waitForLoad('attachedToBlockDropDown');

        await dropDownPage.clickByContainer('attachedToBlockDropDown');
        await dropDownPage.clickByContainer('attachedToBlockDropDown');
        await dropDownPage.clickByContainer('attachedToBlockDropDown');
    });

    test('Toggle attached to inline element', async ({ dropDownPage }) => {
        await dropDownPage.loadAttachedToInline();
        await dropDownPage.waitForLoad('attachedToInlineDropDown');

        await dropDownPage.clickByContainer('attachedToInlineDropDown');
        await dropDownPage.clickByContainer('attachedToInlineDropDown');
        await dropDownPage.clickByContainer('attachedToInlineDropDown');
    });

    test('Select item by click', async ({ dropDownPage }) => {
        await dropDownPage.loadInline();
        await dropDownPage.waitForLoad('inlineDropDown');

        await dropDownPage.clickByToggleButton('inlineDropDown');
        await dropDownPage.clickItemById('inlineDropDown', '4');

        await dropDownPage.clickByToggleButton('inlineDropDown');
        await dropDownPage.clickItemById('inlineDropDown', '6');
    });

    test('Fixed menu popup', async ({ dropDownPage }) => {
        await dropDownPage.loadFixedMenu();
        await dropDownPage.waitForLoad('fixedMenuDropDown');

        await dropDownPage.clickByToggleButton('fixedMenuDropDown');
        await dropDownPage.clickItemById('fixedMenuDropDown', '2');

        await dropDownPage.clickByToggleButton('fixedMenuDropDown');
        await dropDownPage.clickItemById('fixedMenuDropDown', '3');
    });

    test('Groups', async ({ dropDownPage }) => {
        await dropDownPage.loadGroups();
        await dropDownPage.waitForLoad('groupsDropDown');

        await dropDownPage.clickByToggleButton('groupsDropDown');
        await dropDownPage.clickItemById('groupsDropDown', 'groupItem12');

        await dropDownPage.clickByToggleButton('groupsDropDown');
        await dropDownPage.clickItemById('groupsDropDown', 'groupItem26');
    });

    test('Multiple select', async ({ dropDownPage }) => {
        await dropDownPage.loadMultiSelect();
        await dropDownPage.waitForLoad('multipleSelectDropDown');

        await dropDownPage.clickByToggleButton('multipleSelectDropDown');
        await dropDownPage.clickItemById('multipleSelectDropDown', '1');
        await dropDownPage.clickItemById('multipleSelectDropDown', '2');
        await dropDownPage.clickItemById('multipleSelectDropDown', '4');
        await dropDownPage.clickItemById('multipleSelectDropDown', '2');
        await dropDownPage.clickByToggleButton('multipleSelectDropDown');
    });

    test('Filter items', async ({ dropDownPage }) => {
        await dropDownPage.loadFilterSingleSelect();
        await dropDownPage.waitForLoad('filterDropDown');

        await dropDownPage.toggleEnable('filterDropDown');
        await dropDownPage.clickByToggleButton('filterDropDown');
        await dropDownPage.filter('filterDropDown', '1');
        await dropDownPage.filter('filterDropDown', '10');
        await dropDownPage.filter('filterDropDown', '100');
    });

    test('Filter multiple items', async ({ dropDownPage }) => {
        await dropDownPage.loadFilterMultiSelect();
        await dropDownPage.waitForLoad('filterMultiDropDown');

        await dropDownPage.toggleEnable('filterMultiDropDown');
        await dropDownPage.clickByToggleButton('filterMultiDropDown');
        await dropDownPage.filter('filterMultiDropDown', '1');
        await dropDownPage.filter('filterMultiDropDown', '10');
        await dropDownPage.filter('filterMultiDropDown', '100');
    });

    test('Attached component with filter', async ({ dropDownPage }) => {
        await dropDownPage.loadFilterAttachedToBlock();
        await dropDownPage.waitForLoad('attachedFilterDropDown');

        await dropDownPage.clickByContainer('attachedFilterDropDown');
        await dropDownPage.filter('attachedFilterDropDown', '5');
        await dropDownPage.filter('attachedFilterDropDown', '55');
        await dropDownPage.filter('attachedFilterDropDown', '555');
    });

    test('Attached component with multi select filter', async ({ dropDownPage }) => {
        await dropDownPage.loadFilterMultiAttachedToBlock();
        await dropDownPage.waitForLoad('attachedFilterMultipleDropDown');

        await dropDownPage.clickByContainer('attachedFilterMultipleDropDown');
        await dropDownPage.filter('attachedFilterMultipleDropDown', '1');
        await dropDownPage.filter('attachedFilterMultipleDropDown', '10');
        await dropDownPage.filter('attachedFilterMultipleDropDown', '55');
    });

    test('Groups filter', async ({ dropDownPage }) => {
        await dropDownPage.loadFilterGroups();
        await dropDownPage.waitForLoad('filterGroupsDropDown');

        await dropDownPage.clickByToggleButton('filterGroupsDropDown');
        await dropDownPage.filter('filterGroupsDropDown', '1');
        await dropDownPage.filter('filterGroupsDropDown', '10');
        await dropDownPage.filter('filterGroupsDropDown', '100');
    });

    test('Groups with multi select filter', async ({ dropDownPage }) => {
        await dropDownPage.loadFilterGroupsMultiSelect();
        await dropDownPage.waitForLoad('filterGroupsMultiDropDown');

        await dropDownPage.clickByToggleButton('filterGroupsMultiDropDown');
        await dropDownPage.filter('filterGroupsMultiDropDown', '1');
        await dropDownPage.filter('filterGroupsMultiDropDown', '10');
        await dropDownPage.filter('filterGroupsMultiDropDown', '100');
    });
});
