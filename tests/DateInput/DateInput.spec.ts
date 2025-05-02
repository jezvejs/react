import { test, expect } from '@playwright/test';
import {
    inputToEmpty,
    pasteToEmpty,
    backspaceFromPos,
    deleteFromPos,
    inputFromPos,
    inputToSelection,
    pasteToSelection,
    pasteFromPos,
    backspaceSelection,
    deleteSelection,
    cutSelection,
} from '../utils/index.ts';

const inputId = 'localeInput';

export const selectLocale = async ({ page }, value) => {
    await page.goto('iframe.html?viewMode=story&id=input-dateinput--locales');

    const selectLocator = page.locator('#localeSelect');
    await selectLocator.waitFor({ state: 'visible' });

    const selected = await selectLocator.selectOption(value);
    const valuesArray = Array.isArray(value) ? value : [value];
    expect(selected).toStrictEqual(valuesArray);
};

export const navigateToDisabledStory = async ({ page }) => {
    await page.goto('iframe.html?viewMode=story&id=input-dateinput--disabled');

    const inputLocator = page.locator('#disabledDateInput');
    const toggleEnableBtnLocator = page.locator('#toggleEnableBtn');
    const changeValueBtnLocator = page.locator('#changeValueBtn');

    await inputLocator.waitFor({ state: 'visible' });
    await toggleEnableBtnLocator.waitFor({ state: 'visible' });
    await changeValueBtnLocator.waitFor({ state: 'visible' });

    await expect(inputLocator).toHaveValue('01/02/03');
    await expect(inputLocator).toBeDisabled();

    await expect(toggleEnableBtnLocator).toHaveText('Enable');
    await expect(toggleEnableBtnLocator).toBeEnabled();

    await expect(changeValueBtnLocator).toHaveText('Change value');
    await expect(changeValueBtnLocator).toBeEnabled();
};

export const toggleEnable = async ({ page }) => {
    const inputLocator = page.locator('#disabledDateInput');
    const toggleEnableBtnLocator = page.locator('#toggleEnableBtn');
    const changeValueBtnLocator = page.locator('#changeValueBtn');

    await inputLocator.waitFor({ state: 'visible' });
    await toggleEnableBtnLocator.waitFor({ state: 'visible' });

    const enabled = await inputLocator.isEnabled();
    const value = await inputLocator.inputValue();

    await toggleEnableBtnLocator.click();

    await expect(inputLocator).toHaveValue(value);
    await expect(inputLocator).toBeEnabled({ enabled: !enabled });

    await expect(toggleEnableBtnLocator).toHaveText((enabled) ? 'Enable' : 'Disable');
    await expect(toggleEnableBtnLocator).toBeEnabled();

    await expect(changeValueBtnLocator).toHaveText('Change value');
    await expect(changeValueBtnLocator).toBeEnabled();
};

export const changeValue = async ({ page }) => {
    const inputLocator = page.locator('#disabledDateInput');
    const toggleEnableBtnLocator = page.locator('#toggleEnableBtn');
    const changeValueBtnLocator = page.locator('#changeValueBtn');

    await inputLocator.waitFor({ state: 'visible' });
    await toggleEnableBtnLocator.waitFor({ state: 'visible' });
    await changeValueBtnLocator.waitFor({ state: 'visible' });

    const enabled = await inputLocator.isEnabled();

    await changeValueBtnLocator.click();

    await expect(inputLocator).toHaveValue('02/01/00');
    await expect(inputLocator).toBeEnabled({ enabled });

    await expect(toggleEnableBtnLocator).toHaveText((enabled) ? 'Disable' : 'Enable');
    await expect(toggleEnableBtnLocator).toBeEnabled();

    await expect(changeValueBtnLocator).toHaveText('Change value');
    await expect(changeValueBtnLocator).toBeEnabled();
};

test.describe('Type to empty input', () => {
    test('en-US locale', async ({ page }) => {
        await selectLocale({ page }, 'en-US');

        await inputToEmpty({ page }, inputId, '1', '1_/__/__');
        await inputToEmpty({ page }, inputId, '11', '11/__/__');
        await inputToEmpty({ page }, inputId, '112', '11/2_/__');
        await inputToEmpty({ page }, inputId, '1122', '11/22/__');
        await inputToEmpty({ page }, inputId, '11220', '11/22/0_');
        await inputToEmpty({ page }, inputId, '112203', '11/22/03');
    });

    test('ko-KR locale', async ({ page }) => {
        await selectLocale({ page }, 'ko-KR');

        await inputToEmpty({ page }, inputId, '0', '0_. __. __.');
        await inputToEmpty({ page }, inputId, '03', '03. __. __.');
        await inputToEmpty({ page }, inputId, '031', '03. 1_. __.');
        await inputToEmpty({ page }, inputId, '0311', '03. 11. __.');
        await inputToEmpty({ page }, inputId, '03112', '03. 11. 2_.');
        await inputToEmpty({ page }, inputId, '031122', '03. 11. 22.');
    });

    test('ru-RU locale', async ({ page }) => {
        await selectLocale({ page }, 'ru-RU');

        await inputToEmpty({ page }, inputId, '2', '2_.__.____');
        await inputToEmpty({ page }, inputId, '22', '22.__.____');
        await inputToEmpty({ page }, inputId, '221', '22.1_.____');
        await inputToEmpty({ page }, inputId, '2211', '22.11.____');
        await inputToEmpty({ page }, inputId, '22113', '22.11.3___');
        await inputToEmpty({ page }, inputId, '221133', '22.11.33__');
        await inputToEmpty({ page }, inputId, '2211333', '22.11.333_');
        await inputToEmpty({ page }, inputId, '22113333', '22.11.3333');
    });

    test('es-ES locale', async ({ page }) => {
        await selectLocale({ page }, 'es');

        await inputToEmpty({ page }, inputId, '2', '2_/__/__');
        await inputToEmpty({ page }, inputId, '22', '22/__/__');
        await inputToEmpty({ page }, inputId, '221', '22/1_/__');
        await inputToEmpty({ page }, inputId, '2211', '22/11/__');
        await inputToEmpty({ page }, inputId, '22113', '22/11/3_');
        await inputToEmpty({ page }, inputId, '221133', '22/11/33');
    });
});

test.describe('Type invalid values', () => {
    test('en-US locale', async ({ page }) => {
        await selectLocale({ page }, 'en-US');

        // Month
        await inputToEmpty({ page }, inputId, 'x', '');
        await inputToEmpty({ page }, inputId, '13', '1_/__/__');
        await inputToEmpty({ page }, inputId, '1.', '1_/__/__');
        await inputToEmpty({ page }, inputId, '1x', '1_/__/__');
        await inputToEmpty({ page }, inputId, '0x', '0_/__/__');
        // Day
        await inputToEmpty({ page }, inputId, '4x', '04/__/__');
        await inputToEmpty({ page }, inputId, '438', '04/3_/__');
        await inputToEmpty({ page }, inputId, '43.', '04/3_/__');
        await inputToEmpty({ page }, inputId, '43x', '04/3_/__');
        await inputToEmpty({ page }, inputId, '40x', '04/0_/__');
        // Year
        await inputToEmpty({ page }, inputId, '45x', '04/05/__');
        await inputToEmpty({ page }, inputId, '451x', '04/05/1_');
        await inputToEmpty({ page }, inputId, '451.', '04/05/1_');
    });

    test('ko-KR locale', async ({ page }) => {
        await selectLocale({ page }, 'ko-KR');

        // Year
        await inputToEmpty({ page }, inputId, 'x', '');
        await inputToEmpty({ page }, inputId, '1x', '1_. __. __.');
        // Month
        await inputToEmpty({ page }, inputId, '33x', '33. __. __.');
        await inputToEmpty({ page }, inputId, '3313', '33. 1_. __.');
        await inputToEmpty({ page }, inputId, '331x', '33. 1_. __.');
        await inputToEmpty({ page }, inputId, '330x', '33. 0_. __.');
        // Day
        await inputToEmpty({ page }, inputId, '334x', '33. 04. __.');
        await inputToEmpty({ page }, inputId, '33438', '33. 04. 3_.');
        await inputToEmpty({ page }, inputId, '3343x', '33. 04. 3_.');
        await inputToEmpty({ page }, inputId, '3340x', '33. 04. 0_.');
    });

    test('ru-RU locale', async ({ page }) => {
        await selectLocale({ page }, 'ru-RU');

        // Day
        await inputToEmpty({ page }, inputId, 'x', '');
        await inputToEmpty({ page }, inputId, '38', '3_.__.____');
        await inputToEmpty({ page }, inputId, '3x', '3_.__.____');
        await inputToEmpty({ page }, inputId, '0x', '0_.__.____');
        // Month
        await inputToEmpty({ page }, inputId, '4x', '04.__.____');
        await inputToEmpty({ page }, inputId, '413', '04.1_.____');
        await inputToEmpty({ page }, inputId, '41x', '04.1_.____');
        await inputToEmpty({ page }, inputId, '40x', '04.0_.____');
        // Year
        await inputToEmpty({ page }, inputId, '45x', '04.05.____');
        await inputToEmpty({ page }, inputId, '451x', '04.05.1___');
    });

    test('es-ES locale', async ({ page }) => {
        await selectLocale({ page }, 'es');

        // Day
        await inputToEmpty({ page }, inputId, 'x', '');
        await inputToEmpty({ page }, inputId, '38', '3_/__/__');
        await inputToEmpty({ page }, inputId, '3x', '3_/__/__');
        await inputToEmpty({ page }, inputId, '3.', '3_/__/__');
        await inputToEmpty({ page }, inputId, '0x', '0_/__/__');
        // Month
        await inputToEmpty({ page }, inputId, '4x', '04/__/__');
        await inputToEmpty({ page }, inputId, '413', '04/1_/__');
        await inputToEmpty({ page }, inputId, '41x', '04/1_/__');
        await inputToEmpty({ page }, inputId, '41.', '04/1_/__');
        await inputToEmpty({ page }, inputId, '40x', '04/0_/__');
        // Year
        await inputToEmpty({ page }, inputId, '45x', '04/05/__');
        await inputToEmpty({ page }, inputId, '451x', '04/05/1_');
    });
});

test.describe('Paste text to empty input', () => {
    test('en-US locale', async ({ page }) => {
        await selectLocale({ page }, 'en-US');

        await pasteToEmpty({ page }, inputId, '11', '11/__/__');
        await pasteToEmpty({ page }, inputId, '1122', '11/22/__');
        await pasteToEmpty({ page }, inputId, '11220', '11/22/0_');
        await pasteToEmpty({ page }, inputId, '112203', '11/22/03');
        await pasteToEmpty({ page }, inputId, '11/22', '11/22/__');
        await pasteToEmpty({ page }, inputId, '11/22/', '11/22/__');
        await pasteToEmpty({ page }, inputId, '11/22/03', '11/22/03');
        await pasteToEmpty({ page }, inputId, '4', '04/__/__');
        await pasteToEmpty({ page }, inputId, '045', '04/05/__');
        await pasteToEmpty({ page }, inputId, '04050', '04/05/0_');
    });

    test('ko-KR locale', async ({ page }) => {
        await selectLocale({ page }, 'ko-KR');

        await pasteToEmpty({ page }, inputId, '03', '03. __. __.');
        await pasteToEmpty({ page }, inputId, '0311', '03. 11. __.');
        await pasteToEmpty({ page }, inputId, '031122', '03. 11. 22.');
        await pasteToEmpty({ page }, inputId, '03.', '03. __. __.');
        await pasteToEmpty({ page }, inputId, '03. ', '03. __. __.');
        await pasteToEmpty({ page }, inputId, '03. 1', '03. 1_. __.');
        await pasteToEmpty({ page }, inputId, '03. 11', '03. 11. __.');
        await pasteToEmpty({ page }, inputId, '03. 11. ', '03. 11. __.');
        await pasteToEmpty({ page }, inputId, '03. 11. 22', '03. 11. 22.');
        await pasteToEmpty({ page }, inputId, '034', '03. 04. __.');
        await pasteToEmpty({ page }, inputId, '03045', '03. 04. 05.');
    });

    test('ru-RU locale', async ({ page }) => {
        await selectLocale({ page }, 'ru-RU');

        await pasteToEmpty({ page }, inputId, '22', '22.__.____');
        await pasteToEmpty({ page }, inputId, '2211', '22.11.____');
        await pasteToEmpty({ page }, inputId, '22113333', '22.11.3333');
        await pasteToEmpty({ page }, inputId, '22.11', '22.11.____');
        await pasteToEmpty({ page }, inputId, '22.11.', '22.11.____');
        await pasteToEmpty({ page }, inputId, '22.11.3333', '22.11.3333');
        await pasteToEmpty({ page }, inputId, '4', '04.__.____');
        await pasteToEmpty({ page }, inputId, '045', '04.05.____');
    });

    test('es-ES locale', async ({ page }) => {
        await selectLocale({ page }, 'es');

        await pasteToEmpty({ page }, inputId, '22', '22/__/__');
        await pasteToEmpty({ page }, inputId, '2211', '22/11/__');
        await pasteToEmpty({ page }, inputId, '22110', '22/11/0_');
        await pasteToEmpty({ page }, inputId, '221103', '22/11/03');
        await pasteToEmpty({ page }, inputId, '22/11', '22/11/__');
        await pasteToEmpty({ page }, inputId, '22/11/03', '22/11/03');
        await pasteToEmpty({ page }, inputId, '4', '04/__/__');
        await pasteToEmpty({ page }, inputId, '045', '04/05/__');
    });
});

test.describe('Paste invalid text to empty input', () => {
    test('en-US locale', async ({ page }) => {
        await selectLocale({ page }, 'en-US');

        await pasteToEmpty({ page }, inputId, 'x', '');
        await pasteToEmpty({ page }, inputId, '45', '');
        await pasteToEmpty({ page }, inputId, '04x5', '');
        await pasteToEmpty({ page }, inputId, '04/05/x', '');
    });

    test('ko-KR locale', async ({ page }) => {
        await selectLocale({ page }, 'ko-KR');

        await pasteToEmpty({ page }, inputId, 'x', '');
        await pasteToEmpty({ page }, inputId, '11x', '');
        await pasteToEmpty({ page }, inputId, '1145', '');
        await pasteToEmpty({ page }, inputId, '1104x5', '');
    });

    test('ru-RU locale', async ({ page }) => {
        await selectLocale({ page }, 'ru-RU');

        await pasteToEmpty({ page }, inputId, 'x', '');
        await pasteToEmpty({ page }, inputId, '0x', '');
        await pasteToEmpty({ page }, inputId, '04x5', '');
        await pasteToEmpty({ page }, inputId, '04.05.x', '');
    });

    test('es-ES locale', async ({ page }) => {
        await selectLocale({ page }, 'es');

        await pasteToEmpty({ page }, inputId, 'x', '');
        await pasteToEmpty({ page }, inputId, '45', '');
        await pasteToEmpty({ page }, inputId, '04x5', '');
        await pasteToEmpty({ page }, inputId, '04/05/x', '');
    });
});

test.describe('Backspace key', () => {
    test('en-US locale', async ({ page }) => {
        await selectLocale({ page }, 'en-US');

        await backspaceFromPos({ page }, inputId, '11/22/33', 8, '11/22/3_');
        await backspaceFromPos({ page }, inputId, '11/22/3_', 7, '11/22/__');
        await backspaceFromPos({ page }, inputId, '11/22/__', 6, '11/2_/__');
        await backspaceFromPos({ page }, inputId, '11/22/__', 5, '11/2_/__');
        await backspaceFromPos({ page }, inputId, '11/2_/__', 4, '11/__/__');
        await backspaceFromPos({ page }, inputId, '11/__/__', 3, '1_/__/__');
        await backspaceFromPos({ page }, inputId, '11/__/__', 2, '1_/__/__');
        await backspaceFromPos({ page }, inputId, '1_/__/__', 1, '');
        await backspaceFromPos({ page }, inputId, '', 0, '');

        await backspaceFromPos({ page }, inputId, '11/22/33', 4, '11/_2/33');
        await backspaceFromPos({ page }, inputId, '11/_2/33', 3, '1_/_2/33');
        await backspaceFromPos({ page }, inputId, '1_/_2/33', 1, '__/_2/33');
        await backspaceFromPos({ page }, inputId, '__/_2/33', 0, '__/_2/33');
    });

    test('ko-KR locale', async ({ page }) => {
        await selectLocale({ page }, 'ko-KR');

        await backspaceFromPos({ page }, inputId, '33. 11. 22.', 10, '33. 11. 2_.');
        await backspaceFromPos({ page }, inputId, '33. 11. 2_.', 9, '33. 11. __.');
        await backspaceFromPos({ page }, inputId, '33. 11. __.', 8, '33. 1_. __.');
        await backspaceFromPos({ page }, inputId, '33. 11. __.', 6, '33. 1_. __.');
        await backspaceFromPos({ page }, inputId, '33. 1_. __.', 5, '33. __. __.');
        await backspaceFromPos({ page }, inputId, '33. __. __.', 4, '3_. __. __.');
        await backspaceFromPos({ page }, inputId, '33. __. __.', 2, '3_. __. __.');
        await backspaceFromPos({ page }, inputId, '3_. __. __.', 1, '');
        await backspaceFromPos({ page }, inputId, '', 0, '');

        await backspaceFromPos({ page }, inputId, '33. 11. 22.', 5, '33. _1. 22.');
        await backspaceFromPos({ page }, inputId, '33. _1. 22.', 4, '3_. _1. 22.');
        await backspaceFromPos({ page }, inputId, '3_. _1. 22.', 1, '__. _1. 22.');
        await backspaceFromPos({ page }, inputId, '__. _1. 22.', 0, '__. _1. 22.');
    });

    test('ru-RU locale', async ({ page }) => {
        await selectLocale({ page }, 'ru-RU');

        await backspaceFromPos({ page }, inputId, '22.11.3333', 10, '22.11.333_');
        await backspaceFromPos({ page }, inputId, '22.11.333_', 9, '22.11.33__');
        await backspaceFromPos({ page }, inputId, '22.11.33__', 8, '22.11.3___');
        await backspaceFromPos({ page }, inputId, '22.11.3___', 7, '22.11.____');
        await backspaceFromPos({ page }, inputId, '22.11.____', 6, '22.1_.____');
        await backspaceFromPos({ page }, inputId, '22.11.____', 5, '22.1_.____');
        await backspaceFromPos({ page }, inputId, '22.1_.____', 4, '22.__.____');
        await backspaceFromPos({ page }, inputId, '22.__.____', 3, '2_.__.____');
        await backspaceFromPos({ page }, inputId, '22.__.____', 2, '2_.__.____');
        await backspaceFromPos({ page }, inputId, '2_.__.____', 1, '');
        await backspaceFromPos({ page }, inputId, '', 0, '');

        await backspaceFromPos({ page }, inputId, '22.11.3333', 4, '22._1.3333');
        await backspaceFromPos({ page }, inputId, '22._1.3333', 3, '2_._1.3333');
        await backspaceFromPos({ page }, inputId, '2_._1.3333', 1, '__._1.3333');
        await backspaceFromPos({ page }, inputId, '__._1.3333', 0, '__._1.3333');
    });

    test('es-ES locale', async ({ page }) => {
        await selectLocale({ page }, 'es');

        await backspaceFromPos({ page }, inputId, '22/11/33', 8, '22/11/3_');
        await backspaceFromPos({ page }, inputId, '22/11/3_', 7, '22/11/__');
        await backspaceFromPos({ page }, inputId, '22/11/__', 6, '22/1_/__');
        await backspaceFromPos({ page }, inputId, '22/11/__', 5, '22/1_/__');
        await backspaceFromPos({ page }, inputId, '22/1_/__', 4, '22/__/__');
        await backspaceFromPos({ page }, inputId, '22/__/__', 3, '2_/__/__');
        await backspaceFromPos({ page }, inputId, '22/__/__', 2, '2_/__/__');
        await backspaceFromPos({ page }, inputId, '2_/__/__', 1, '');

        await backspaceFromPos({ page }, inputId, '22/11/33', 4, '22/_1/33');
        await backspaceFromPos({ page }, inputId, '22/_1/33', 3, '2_/_1/33');
        await backspaceFromPos({ page }, inputId, '2_/_1/33', 1, '__/_1/33');
        await backspaceFromPos({ page }, inputId, '__/_1/33', 0, '__/_1/33');
    });
});

test.describe('Delete key', () => {
    test('en-US locale', async ({ page }) => {
        await selectLocale({ page }, 'en-US');

        await deleteFromPos({ page }, inputId, '11/22/33', 6, '11/22/_3');
        await deleteFromPos({ page }, inputId, '11/22/33', 5, '11/22/_3');
        await deleteFromPos({ page }, inputId, '11/22/33', 4, '11/2_/33');
        await deleteFromPos({ page }, inputId, '11/22/33', 0, '_1/22/33');
    });

    test('ko-KR locale', async ({ page }) => {
        await selectLocale({ page }, 'ko-KR');

        await deleteFromPos({ page }, inputId, '33. 11. 22.', 8, '33. 11. _2.');
        await deleteFromPos({ page }, inputId, '33. 11. 22.', 6, '33. 11. _2.');
        await deleteFromPos({ page }, inputId, '33. 11. 22.', 4, '33. _1. 22.');
        await deleteFromPos({ page }, inputId, '33. 11. 22.', 0, '_3. 11. 22.');
    });

    test('ru-RU locale', async ({ page }) => {
        await selectLocale({ page }, 'ru-RU');

        await deleteFromPos({ page }, inputId, '22.11.3333', 6, '22.11._333');
        await deleteFromPos({ page }, inputId, '22.11.3333', 5, '22.11._333');
        await deleteFromPos({ page }, inputId, '22.11.3333', 4, '22.1_.3333');
        await deleteFromPos({ page }, inputId, '22.11.3333', 0, '_2.11.3333');
    });

    test('es-ES locale', async ({ page }) => {
        await selectLocale({ page }, 'es');

        await deleteFromPos({ page }, inputId, '22/11/33', 6, '22/11/_3');
        await deleteFromPos({ page }, inputId, '22/11/33', 5, '22/11/_3');
        await deleteFromPos({ page }, inputId, '22/11/33', 4, '22/1_/33');
        await deleteFromPos({ page }, inputId, '22/11/33', 0, '_2/11/33');
    });
});

test.describe('Input text inside value', () => {
    test('en-US locale', async ({ page }) => {
        await selectLocale({ page }, 'en-US');

        await inputFromPos({ page }, inputId, '11/__/33', 3, '2', '11/2_/33');
        await inputFromPos({ page }, inputId, '11/2_/33', 4, '2', '11/22/33');
        await inputFromPos({ page }, inputId, '1_/__/__', 1, '/', '01/__/__');
        await inputFromPos({ page }, inputId, '01/2_/__', 4, '/', '01/02/__');
        await inputFromPos({ page }, inputId, '01/02/0_', 7, '/', '01/02/0_');
    });

    test('ko-KR locale', async ({ page }) => {
        await selectLocale({ page }, 'ko-KR');

        await inputFromPos({ page }, inputId, '33. __. 22.', 2, '1', '33. 1_. 22.');
        await inputFromPos({ page }, inputId, '33. __. 22.', 3, '1', '33. 1_. 22.');
        await inputFromPos({ page }, inputId, '33. __. 22.', 4, '1', '33. 1_. 22.');
        await inputFromPos({ page }, inputId, '33. __. 22.', 4, '7', '33. 07. 22.');
        await inputFromPos({ page }, inputId, '33. 1_. 22.', 5, '1', '33. 11. 22.');
        await inputFromPos({ page }, inputId, '33. 1_. __.', 5, '.', '33. 01. __.');
        await inputFromPos({ page }, inputId, '33. 01. __.', 6, '.', '33. 01. __.');
        await inputFromPos({ page }, inputId, '33. 01. __.', 6, ' ', '33. 01. __.');
        await inputFromPos({ page }, inputId, '33. 01. __.', 7, '.', '33. 01. __.');
        await inputFromPos({ page }, inputId, '33. 01. __.', 7, ' ', '33. 01. __.');
        await inputFromPos({ page }, inputId, '33. 01. 2_.', 9, '.', '33. 01. 02.');
        await inputFromPos({ page }, inputId, '33. 01. 2_.', 9, ' ', '33. 01. 02.');
        await inputFromPos({ page }, inputId, '3_. __. __.', 1, '.', '3_. __. __.');
        await inputFromPos({ page }, inputId, '3_. __. __.', 1, ' ', '3_. __. __.');
    });

    test('ru-RU locale', async ({ page }) => {
        await selectLocale({ page }, 'ru-RU');

        await inputFromPos({ page }, inputId, '22.__.3333', 3, '1', '22.1_.3333');
        await inputFromPos({ page }, inputId, '22.1_.3333', 4, '1', '22.11.3333');
        await inputFromPos({ page }, inputId, '2_.__.____', 1, '.', '02.__.____');
        await inputFromPos({ page }, inputId, '02.__.____', 2, '.', '02.__.____');
        await inputFromPos({ page }, inputId, '02.1_.____', 4, '.', '02.01.____');
        await inputFromPos({ page }, inputId, '02.01.1___', 7, '.', '02.01.1___');
    });

    test('es-ES locale', async ({ page }) => {
        await selectLocale({ page }, 'es');

        await inputFromPos({ page }, inputId, '22/__/33', 3, '1', '22/1_/33');
        await inputFromPos({ page }, inputId, '22/1_/33', 4, '1', '22/11/33');
        await inputFromPos({ page }, inputId, '2_/__/__', 1, '/', '02/__/__');
        await inputFromPos({ page }, inputId, '02/__/__', 2, '/', '02/__/__');
        await inputFromPos({ page }, inputId, '02/1_/__', 4, '/', '02/01/__');
    });
});

test.describe('Input invalid text inside value', () => {
    test('en-US locale', async ({ page }) => {
        await selectLocale({ page }, 'en-US');

        await inputFromPos({ page }, inputId, '11/__/33', 3, 'x', '11/__/33');
        await inputFromPos({ page }, inputId, '1_/22/33', 1, '5', '1_/22/33');
    });

    test('ko-KR locale', async ({ page }) => {
        await selectLocale({ page }, 'ko-KR');

        await inputFromPos({ page }, inputId, '33. __. 22.', 4, 'x', '33. __. 22.');
        await inputFromPos({ page }, inputId, '33. 1_. 22.', 5, '5', '33. 1_. 22.');
    });

    test('ru-RU locale', async ({ page }) => {
        await selectLocale({ page }, 'ru-RU');

        await inputFromPos({ page }, inputId, '22.__.3333', 3, 'x', '22.__.3333');
        await inputFromPos({ page }, inputId, '22.1_.3333', 4, '5', '22.1_.3333');
    });

    test('es-ES locale', async ({ page }) => {
        await selectLocale({ page }, 'es');

        await inputFromPos({ page }, inputId, '22/__/33', 3, 'x', '22/__/33');
        await inputFromPos({ page }, inputId, '22/1_/33', 4, '5', '22/1_/33');
    });
});

test.describe('Input text into selection', () => {
    test('en-US locale', async ({ page }) => {
        await selectLocale({ page }, 'en-US');

        await inputToSelection({ page }, inputId, '11/22/33', 1, 4, '1', '11/_2/33');
        await inputToSelection({ page }, inputId, '11/22/33', 0, 7, '2', '02/__/_3');
    });

    test('ko-KR locale', async ({ page }) => {
        await selectLocale({ page }, 'ko-KR');

        await inputToSelection({ page }, inputId, '33. 11. 22.', 2, 6, '1', '33. 1_. 22.');
        await inputToSelection({ page }, inputId, '33. 11. 22.', 3, 6, '1', '33. 1_. 22.');
        await inputToSelection({ page }, inputId, '33. 11. 22.', 4, 6, '1', '33. 1_. 22.');
        await inputToSelection({ page }, inputId, '33. 11. 22.', 2, 6, '7', '33. 07. 22.');
        await inputToSelection({ page }, inputId, '33. 11. 22.', 5, 9, '1', '33. 11. _2.');
        await inputToSelection({ page }, inputId, '33. 11. 22.', 0, 9, '3', '3_. __. _2.');
    });

    test('ru-RU locale', async ({ page }) => {
        await selectLocale({ page }, 'ru-RU');

        await inputToSelection({ page }, inputId, '22.11.3333', 1, 4, '2', '22._1.3333');
        await inputToSelection({ page }, inputId, '22.11.3333', 0, 9, '2', '2_.__.___3');
    });

    test('es-ES locale', async ({ page }) => {
        await selectLocale({ page }, 'es');

        await inputToSelection({ page }, inputId, '22/11/33', 1, 4, '2', '22/_1/33');
        await inputToSelection({ page }, inputId, '22/11/33', 0, 7, '2', '2_/__/_3');
    });
});

test.describe('Input invalid text into selection', () => {
    test('en-US locale', async ({ page }) => {
        await selectLocale({ page }, 'en-US');

        await inputToSelection({ page }, inputId, '11/22/33', 1, 4, 'x', '11/22/33');
        await inputToSelection({ page }, inputId, '11/22/33', 1, 4, '5', '11/22/33');
    });

    test('ko-KR locale', async ({ page }) => {
        await selectLocale({ page }, 'ko-KR');

        await inputToSelection({ page }, inputId, '33. 11. 22.', 5, 9, 'x', '33. 11. 22.');
        await inputToSelection({ page }, inputId, '33. 11. 22.', 5, 9, '5', '33. 11. 22.');
    });

    test('ru-RU locale', async ({ page }) => {
        await selectLocale({ page }, 'ru-RU');

        await inputToSelection({ page }, inputId, '22.11.3333', 1, 4, 'x', '22.11.3333');
        await inputToSelection({ page }, inputId, '22.11.3333', 4, 7, '5', '22.11.3333');
    });

    test('es-ES locale', async ({ page }) => {
        await selectLocale({ page }, 'es');

        await inputToSelection({ page }, inputId, '22/11/33', 1, 4, 'x', '22/11/33');
        await inputToSelection({ page }, inputId, '22/11/33', 4, 7, '5', '22/11/33');
    });
});

test.describe('Paste text into selection', () => {
    test('en-US locale', async ({ page }) => {
        await selectLocale({ page }, 'en-US');

        await pasteToSelection({ page }, inputId, '11/22/33', 1, 4, '1', '11/_2/33');
        await pasteToSelection({ page }, inputId, '11/22/33', 0, 7, '2', '02/__/_3');
    });

    test('ko-KR locale', async ({ page }) => {
        await selectLocale({ page }, 'ko-KR');

        await pasteToSelection({ page }, inputId, '33. 11. 22.', 2, 6, '1', '33. 1_. 22.');
        await pasteToSelection({ page }, inputId, '33. 11. 22.', 3, 6, '1', '33. 1_. 22.');
        await pasteToSelection({ page }, inputId, '33. 11. 22.', 4, 6, '1', '33. 1_. 22.');
        await pasteToSelection({ page }, inputId, '33. 11. 22.', 2, 6, '7', '33. 07. 22.');
        await pasteToSelection({ page }, inputId, '33. 11. 22.', 5, 9, '1', '33. 11. _2.');
        await pasteToSelection({ page }, inputId, '33. 11. 22.', 0, 9, '3', '3_. __. _2.');
        await pasteToSelection({ page }, inputId, '33. 11. 22.', 0, 10, '30. 1', '30. 1_. __.');
    });

    test('ru-RU locale', async ({ page }) => {
        await selectLocale({ page }, 'ru-RU');

        await pasteToSelection({ page }, inputId, '22.11.3333', 1, 4, '2', '22._1.3333');
        await pasteToSelection({ page }, inputId, '22.11.3333', 0, 9, '2', '2_.__.___3');
        await pasteToSelection({ page }, inputId, '22.11.3333', 0, 10, '20.1', '20.1_.____');
    });

    test('es-ES locale', async ({ page }) => {
        await selectLocale({ page }, 'es');

        await pasteToSelection({ page }, inputId, '22/11/33', 1, 4, '2', '22/_1/33');
        await pasteToSelection({ page }, inputId, '22/11/33', 0, 7, '2', '2_/__/_3');
        await pasteToSelection({ page }, inputId, '22/11/33', 0, 8, '201', '20/1_/__');
        await pasteToSelection({ page }, inputId, '22/11/33', 0, 8, '20/1', '20/1_/__');
    });
});

test.describe('Paste invalid text into selection', () => {
    test('en-US locale', async ({ page }) => {
        await selectLocale({ page }, 'en-US');

        await pasteToSelection({ page }, inputId, '11/22/33', 1, 4, 'x', '11/22/33');
        await pasteToSelection({ page }, inputId, '11/22/33', 1, 4, '5', '11/22/33');
    });

    test('ko-KR locale', async ({ page }) => {
        await selectLocale({ page }, 'ko-KR');

        await pasteToSelection({ page }, inputId, '33. 11. 22.', 5, 9, 'x', '33. 11. 22.');
        await pasteToSelection({ page }, inputId, '33. 11. 22.', 5, 9, '5', '33. 11. 22.');
    });

    test('ru-RU locale', async ({ page }) => {
        await selectLocale({ page }, 'ru-RU');

        await pasteToSelection({ page }, inputId, '22.11.3333', 1, 4, 'x', '22.11.3333');
        await pasteToSelection({ page }, inputId, '22.11.3333', 4, 7, '5', '22.11.3333');
    });

    test('es-ES locale', async ({ page }) => {
        await selectLocale({ page }, 'es');

        await pasteToSelection({ page }, inputId, '22/11/33', 1, 4, 'x', '22/11/33');
        await pasteToSelection({ page }, inputId, '22/11/33', 4, 7, '5', '22/11/33');
    });
});

test.describe('Paste text inside value', () => {
    test('en-US locale', async ({ page }) => {
        await selectLocale({ page }, 'en-US');

        await pasteFromPos({ page }, inputId, '11/__/33', 3, '2', '11/2_/33');
        await pasteFromPos({ page }, inputId, '11/2_/33', 4, '2', '11/22/33');
    });

    test('ko-KR locale', async ({ page }) => {
        await selectLocale({ page }, 'ko-KR');

        await pasteFromPos({ page }, inputId, '33. __. 22.', 2, '1', '33. 1_. 22.');
        await pasteFromPos({ page }, inputId, '33. __. 22.', 3, '1', '33. 1_. 22.');
        await pasteFromPos({ page }, inputId, '33. __. 22.', 4, '1', '33. 1_. 22.');
        await pasteFromPos({ page }, inputId, '33. __. 22.', 4, '7', '33. 07. 22.');
        await pasteFromPos({ page }, inputId, '3_. __. 22.', 1, '3. 1', '33. 1_. 22.');
        await pasteFromPos({ page }, inputId, '33. __. 22.', 2, '. 1', '33. 1_. 22.');
        await pasteFromPos({ page }, inputId, '33. __. 22.', 2, '. ', '33. __. 22.');
        await pasteFromPos({ page }, inputId, '33. __. 22.', 2, ' ', '33. __. 22.');
        await pasteFromPos({ page }, inputId, '33. 1_. 22.', 5, '1', '33. 11. 22.');
    });

    test('ru-RU locale', async ({ page }) => {
        await selectLocale({ page }, 'ru-RU');

        await pasteFromPos({ page }, inputId, '22.__.3333', 3, '1', '22.1_.3333');
        await pasteFromPos({ page }, inputId, '22.1_.3333', 4, '1', '22.11.3333');
    });

    test('es-ES locale', async ({ page }) => {
        await selectLocale({ page }, 'es');

        await pasteFromPos({ page }, inputId, '22/__/33', 3, '1', '22/1_/33');
        await pasteFromPos({ page }, inputId, '22/1_/33', 4, '1', '22/11/33');
    });
});

test.describe('Paste invalid text inside value', () => {
    test('en-US locale', async ({ page }) => {
        await selectLocale({ page }, 'en-US');

        await pasteFromPos({ page }, inputId, '11/__/33', 3, 'x', '11/__/33');
        await pasteFromPos({ page }, inputId, '1_/22/33', 1, '5', '1_/22/33');
    });

    test('ko-KR locale', async ({ page }) => {
        await selectLocale({ page }, 'ko-KR');

        await pasteFromPos({ page }, inputId, '33. __. 22.', 4, 'x', '33. __. 22.');
        await pasteFromPos({ page }, inputId, '33. 1_. 22.', 5, '5', '33. 1_. 22.');
    });

    test('ru-RU locale', async ({ page }) => {
        await selectLocale({ page }, 'ru-RU');

        await pasteFromPos({ page }, inputId, '22.__.3333', 3, 'x', '22.__.3333');
        await pasteFromPos({ page }, inputId, '22.1_.3333', 4, '5', '22.1_.3333');
    });

    test('es-ES locale', async ({ page }) => {
        await selectLocale({ page }, 'es');

        await pasteFromPos({ page }, inputId, '22/__/33', 3, 'x', '22/__/33');
        await pasteFromPos({ page }, inputId, '22/1_/33', 4, '5', '22/1_/33');
    });
});

test.describe('Backspace key with selection', () => {
    test('en-US locale', async ({ page }) => {
        await selectLocale({ page }, 'en-US');

        await backspaceSelection({ page }, inputId, '11/22/33', 4, 7, '11/2_/_3');
        await backspaceSelection({ page }, inputId, '11/22/33', 0, 8, '');
    });

    test('ko-KR locale', async ({ page }) => {
        await selectLocale({ page }, 'ko-KR');

        await backspaceSelection({ page }, inputId, '33. 11. 22.', 5, 9, '33. 1_. _2.');
        await backspaceSelection({ page }, inputId, '33. 11. 22.', 0, 10, '');
    });

    test('ru-RU locale', async ({ page }) => {
        await selectLocale({ page }, 'ru-RU');

        await backspaceSelection({ page }, inputId, '22.11.3333', 4, 7, '22.1_._333');
        await backspaceSelection({ page }, inputId, '22.11.3333', 0, 10, '');
    });

    test('es-ES locale', async ({ page }) => {
        await selectLocale({ page }, 'es');

        await backspaceSelection({ page }, inputId, '22/11/33', 4, 7, '22/1_/_3');
        await backspaceSelection({ page }, inputId, '22/11/33', 0, 8, '');
    });
});

test.describe('Delete key with selection', () => {
    test('en-US locale', async ({ page }) => {
        await selectLocale({ page }, 'en-US');

        await deleteSelection({ page }, inputId, '11/22/33', 4, 7, '11/2_/_3');
        await deleteSelection({ page }, inputId, '11/22/33', 0, 8, '');
    });

    test('ko-KR locale', async ({ page }) => {
        await selectLocale({ page }, 'ko-KR');

        await deleteSelection({ page }, inputId, '33. 11. 22.', 5, 9, '33. 1_. _2.');
        await deleteSelection({ page }, inputId, '33. 11. 22.', 0, 10, '');
    });

    test('ru-RU locale', async ({ page }) => {
        await selectLocale({ page }, 'ru-RU');

        await deleteSelection({ page }, inputId, '22.11.3333', 4, 7, '22.1_._333');
        await deleteSelection({ page }, inputId, '22.11.3333', 0, 10, '');
    });

    test('es-ES locale', async ({ page }) => {
        await selectLocale({ page }, 'es');

        await deleteSelection({ page }, inputId, '22/11/33', 4, 7, '22/1_/_3');
        await deleteSelection({ page }, inputId, '22/11/33', 0, 8, '');
    });
});

test.describe('Cut selection', () => {
    test('en-US locale', async ({ page }) => {
        await selectLocale({ page }, 'en-US');

        await cutSelection({ page }, inputId, '11/22/33', 4, 7, '11/2_/_3');
        await cutSelection({ page }, inputId, '11/22/33', 0, 8, '');
    });

    test('ko-KR locale', async ({ page }) => {
        await selectLocale({ page }, 'ko-KR');

        await cutSelection({ page }, inputId, '33. 11. 22.', 5, 9, '33. 1_. _2.');
        await cutSelection({ page }, inputId, '33. 11. 22.', 0, 10, '');
    });

    test('ru-RU locale', async ({ page }) => {
        await selectLocale({ page }, 'ru-RU');

        await cutSelection({ page }, inputId, '22.11.3333', 4, 7, '22.1_._333');
        await cutSelection({ page }, inputId, '22.11.3333', 0, 10, '');
    });

    test('es-ES locale', async ({ page }) => {
        await selectLocale({ page }, 'es');

        await cutSelection({ page }, inputId, '22/11/33', 4, 7, '22/1_/_3');
        await cutSelection({ page }, inputId, '22/11/33', 0, 8, '');
    });
});

test.describe('Disabled state', () => {
    test('Handling \'disabled\' property', async ({ page }) => {
        await navigateToDisabledStory({ page });

        await toggleEnable({ page });
        await toggleEnable({ page });

        await changeValue({ page });

        await toggleEnable({ page });
    });
});
