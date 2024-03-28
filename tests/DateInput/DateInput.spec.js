import { test, expect } from '@playwright/test';

const inputToEmpty = async ({ page }, name, value, expected) => {
    const inputLocator = page.locator(`#${name}`);
    await inputLocator.waitFor({ state: 'visible' });

    await inputLocator.clear();
    await expect(inputLocator).toHaveValue('');

    await inputLocator.pressSequentially(value);
    await expect(inputLocator).toHaveValue(expected);
};

const pasteToEmpty = async ({ page }, name, value, expected) => {
    const inputLocator = page.locator(`#${name}`);
    await inputLocator.waitFor({ state: 'visible' });

    const tmpLocator = page.locator('.tmp-input');
    await tmpLocator.waitFor({ state: 'visible' });

    await inputLocator.clear();
    await expect(inputLocator).toHaveValue('');

    await tmpLocator.clear();
    await tmpLocator.fill(value);
    await expect(tmpLocator).toHaveValue(value);

    await tmpLocator.press('Control+A');
    await tmpLocator.press('Control+C');

    await inputLocator.press('Control+V');
    await expect(inputLocator).toHaveValue(expected);
};

test.describe('Type to empty input', () => {
    test('en-US locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--english-locale');

        await inputToEmpty({ page }, 'usLocaleInput', '1', '1_/__/__');
        await inputToEmpty({ page }, 'usLocaleInput', '11', '11/__/__');
        await inputToEmpty({ page }, 'usLocaleInput', '112', '11/2_/__');
        await inputToEmpty({ page }, 'usLocaleInput', '1122', '11/22/__');
        await inputToEmpty({ page }, 'usLocaleInput', '11220', '11/22/0_');
        await inputToEmpty({ page }, 'usLocaleInput', '112203', '11/22/03');
    });

    test('ko-KR locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--korean-locale');

        await inputToEmpty({ page }, 'koLocaleInput', '0', '0_. __. __.');
        await inputToEmpty({ page }, 'koLocaleInput', '03', '03. __. __.');
        await inputToEmpty({ page }, 'koLocaleInput', '031', '03. 1_. __.');
        await inputToEmpty({ page }, 'koLocaleInput', '0311', '03. 11. __.');
        await inputToEmpty({ page }, 'koLocaleInput', '03112', '03. 11. 2_.');
        await inputToEmpty({ page }, 'koLocaleInput', '031122', '03. 11. 22.');
    });

    test('ru-RU locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--russian-locale');

        await inputToEmpty({ page }, 'ruLocaleInput', '2', '2_.__.____');
        await inputToEmpty({ page }, 'ruLocaleInput', '22', '22.__.____');
        await inputToEmpty({ page }, 'ruLocaleInput', '221', '22.1_.____');
        await inputToEmpty({ page }, 'ruLocaleInput', '2211', '22.11.____');
        await inputToEmpty({ page }, 'ruLocaleInput', '22113', '22.11.3___');
        await inputToEmpty({ page }, 'ruLocaleInput', '221133', '22.11.33__');
        await inputToEmpty({ page }, 'ruLocaleInput', '2211333', '22.11.333_');
        await inputToEmpty({ page }, 'ruLocaleInput', '22113333', '22.11.3333');
    });

    test('es-ES locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--es-locale');

        await inputToEmpty({ page }, 'esLocaleInput', '2', '2_/__/__');
        await inputToEmpty({ page }, 'esLocaleInput', '22', '22/__/__');
        await inputToEmpty({ page }, 'esLocaleInput', '221', '22/1_/__');
        await inputToEmpty({ page }, 'esLocaleInput', '2211', '22/11/__');
        await inputToEmpty({ page }, 'esLocaleInput', '22113', '22/11/3_');
        await inputToEmpty({ page }, 'esLocaleInput', '221133', '22/11/33');
    });
});

test.describe('Type invalid values', () => {
    test('en-US locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--english-locale');

        // Month
        await inputToEmpty({ page }, 'usLocaleInput', 'x', '');
        await inputToEmpty({ page }, 'usLocaleInput', '13', '1_/__/__');
        await inputToEmpty({ page }, 'usLocaleInput', '1x', '1_/__/__');
        await inputToEmpty({ page }, 'usLocaleInput', '0x', '0_/__/__');
        // Day
        await inputToEmpty({ page }, 'usLocaleInput', '4x', '04/__/__');
        await inputToEmpty({ page }, 'usLocaleInput', '438', '04/3_/__');
        await inputToEmpty({ page }, 'usLocaleInput', '43x', '04/3_/__');
        await inputToEmpty({ page }, 'usLocaleInput', '40x', '04/0_/__');
        // Year
        await inputToEmpty({ page }, 'usLocaleInput', '45x', '04/05/__');
        await inputToEmpty({ page }, 'usLocaleInput', '451x', '04/05/1_');
    });

    test('ko-KR locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--korean-locale');

        // Year
        await inputToEmpty({ page }, 'koLocaleInput', 'x', '');
        await inputToEmpty({ page }, 'koLocaleInput', '1x', '1_. __. __.');
        // Month
        await inputToEmpty({ page }, 'koLocaleInput', '33x', '33. __. __.');
        await inputToEmpty({ page }, 'koLocaleInput', '3313', '33. 1_. __.');
        await inputToEmpty({ page }, 'koLocaleInput', '331x', '33. 1_. __.');
        await inputToEmpty({ page }, 'koLocaleInput', '330x', '33. 0_. __.');
        // Day
        await inputToEmpty({ page }, 'koLocaleInput', '334x', '33. 04. __.');
        await inputToEmpty({ page }, 'koLocaleInput', '33438', '33. 04. 3_.');
        await inputToEmpty({ page }, 'koLocaleInput', '3343x', '33. 04. 3_.');
        await inputToEmpty({ page }, 'koLocaleInput', '3340x', '33. 04. 0_.');
    });

    test('ru-RU locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--russian-locale');

        // Day
        await inputToEmpty({ page }, 'ruLocaleInput', 'x', '');
        await inputToEmpty({ page }, 'ruLocaleInput', '38', '3_.__.____');
        await inputToEmpty({ page }, 'ruLocaleInput', '3x', '3_.__.____');
        await inputToEmpty({ page }, 'ruLocaleInput', '0x', '0_.__.____');
        // Month
        await inputToEmpty({ page }, 'ruLocaleInput', '4x', '04.__.____');
        await inputToEmpty({ page }, 'ruLocaleInput', '413', '04.1_.____');
        await inputToEmpty({ page }, 'ruLocaleInput', '41x', '04.1_.____');
        await inputToEmpty({ page }, 'ruLocaleInput', '40x', '04.0_.____');
        // Year
        await inputToEmpty({ page }, 'ruLocaleInput', '45x', '04.05.____');
        await inputToEmpty({ page }, 'ruLocaleInput', '451x', '04.05.1___');
    });

    test('es-ES locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--es-locale');

        // Day
        await inputToEmpty({ page }, 'esLocaleInput', 'x', '');
        await inputToEmpty({ page }, 'esLocaleInput', '38', '3_/__/__');
        await inputToEmpty({ page }, 'esLocaleInput', '3x', '3_/__/__');
        await inputToEmpty({ page }, 'esLocaleInput', '0x', '0_/__/__');
        // Month
        await inputToEmpty({ page }, 'esLocaleInput', '4x', '04/__/__');
        await inputToEmpty({ page }, 'esLocaleInput', '413', '04/1_/__');
        await inputToEmpty({ page }, 'esLocaleInput', '41x', '04/1_/__');
        await inputToEmpty({ page }, 'esLocaleInput', '40x', '04/0_/__');
        // Year
        await inputToEmpty({ page }, 'esLocaleInput', '45x', '04/05/__');
        await inputToEmpty({ page }, 'esLocaleInput', '451x', '04/05/1_');
    });
});

test.describe('Paste text to empty input', () => {
    test('en-US locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--english-locale');

        await pasteToEmpty({ page }, 'usLocaleInput', '11', '11/__/__');
        await pasteToEmpty({ page }, 'usLocaleInput', '1122', '11/22/__');
        await pasteToEmpty({ page }, 'usLocaleInput', '11220', '11/22/0_');
        await pasteToEmpty({ page }, 'usLocaleInput', '112203', '11/22/03');
        await pasteToEmpty({ page }, 'usLocaleInput', '11/22', '11/22/__');
        await pasteToEmpty({ page }, 'usLocaleInput', '11/22/', '11/22/__');
        await pasteToEmpty({ page }, 'usLocaleInput', '11/22/03', '11/22/03');
        await pasteToEmpty({ page }, 'usLocaleInput', '4', '04/__/__');
        await pasteToEmpty({ page }, 'usLocaleInput', '045', '04/05/__');
        await pasteToEmpty({ page }, 'usLocaleInput', '04050', '04/05/0_');
    });

    test('ko-KR locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--korean-locale');

        await pasteToEmpty({ page }, 'koLocaleInput', '03', '03. __. __.');
        await pasteToEmpty({ page }, 'koLocaleInput', '0311', '03. 11. __.');
        await pasteToEmpty({ page }, 'koLocaleInput', '031122', '03. 11. 22.');
        await pasteToEmpty({ page }, 'koLocaleInput', '03.', '03. __. __.');
        await pasteToEmpty({ page }, 'koLocaleInput', '03. ', '03. __. __.');
        await pasteToEmpty({ page }, 'koLocaleInput', '03. 1', '03. 1_. __.');
        await pasteToEmpty({ page }, 'koLocaleInput', '03. 11', '03. 11. __.');
        await pasteToEmpty({ page }, 'koLocaleInput', '03. 11. ', '03. 11. __.');
        await pasteToEmpty({ page }, 'koLocaleInput', '03. 11. 22', '03. 11. 22.');
        await pasteToEmpty({ page }, 'koLocaleInput', '034', '03. 04. __.');
        await pasteToEmpty({ page }, 'koLocaleInput', '03045', '03. 04. 05.');
    });

    test('ru-RU locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--russian-locale');

        await pasteToEmpty({ page }, 'ruLocaleInput', '22', '22.__.____');
        await pasteToEmpty({ page }, 'ruLocaleInput', '2211', '22.11.____');
        await pasteToEmpty({ page }, 'ruLocaleInput', '22113333', '22.11.3333');
        await pasteToEmpty({ page }, 'ruLocaleInput', '22.11', '22.11.____');
        await pasteToEmpty({ page }, 'ruLocaleInput', '22.11.', '22.11.____');
        await pasteToEmpty({ page }, 'ruLocaleInput', '22.11.3333', '22.11.3333');
        await pasteToEmpty({ page }, 'ruLocaleInput', '4', '04.__.____');
        await pasteToEmpty({ page }, 'ruLocaleInput', '045', '04.05.____');
    });

    test('es-ES locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--es-locale');

        await pasteToEmpty({ page }, 'esLocaleInput', '22', '22/__/__');
        await pasteToEmpty({ page }, 'esLocaleInput', '2211', '22/11/__');
        await pasteToEmpty({ page }, 'esLocaleInput', '22110', '22/11/0_');
        await pasteToEmpty({ page }, 'esLocaleInput', '221103', '22/11/03');
        await pasteToEmpty({ page }, 'esLocaleInput', '22/11', '22/11/__');
        await pasteToEmpty({ page }, 'esLocaleInput', '22/11/03', '22/11/03');
        await pasteToEmpty({ page }, 'esLocaleInput', '4', '04/__/__');
        await pasteToEmpty({ page }, 'esLocaleInput', '045', '04/05/__');
    });
});
