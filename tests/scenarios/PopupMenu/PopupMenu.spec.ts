import { test as baseTest } from '@playwright/test';
import { PopupMenuPage } from 'pages/PopupMenu/PopupMenuPage.ts';

export interface PopupMenuPageFixture {
    popupMenuPage: PopupMenuPage;
}

const test = baseTest.extend<PopupMenuPageFixture>({
    popupMenuPage: async ({ page }, use) => {
        const popupMenuPage = new PopupMenuPage(page);
        await use(popupMenuPage);
    },
});

test.describe('PopupMenu', () => {
    test('Toggle open/close menu by click', async ({ popupMenuPage }) => {
        await popupMenuPage.loadDefault();

        await popupMenuPage.clickMenuButton('defaultMenuButton');
        await popupMenuPage.clickMenuButton('defaultMenuButton');
    });

    test('Click by checkbox item', async ({ popupMenuPage }) => {
        await popupMenuPage.loadAbsolutePosition();

        await popupMenuPage.clickMenuButton('absPositionMenuButton');
        await popupMenuPage.clickAbsPositionMenuItem('checkboxItem');
        await popupMenuPage.clickMenuButton('absPositionMenuButton');
        await popupMenuPage.clickAbsPositionMenuItem('checkboxItem');
        await popupMenuPage.clickMenuButton('absPositionMenuButton');
    });

    test('Hide on select', async ({ popupMenuPage }) => {
        await popupMenuPage.loadHideOnSelect();

        await popupMenuPage.clickMenuButton('hideOnSelectMenuButton');
        await popupMenuPage.clickHideOnSelectMenuItem('checkboxItem');
        await popupMenuPage.clickHideOnSelectMenuItem('checkboxItem');
        await popupMenuPage.clickMenuButton('hideOnSelectMenuButton');
    });
});
