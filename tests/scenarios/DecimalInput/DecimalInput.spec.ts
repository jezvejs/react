import { expect, test } from '@playwright/test';
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
} from 'shared/utils.ts';
import { Fixtures } from 'shared/types.ts';

export const navigateToDisabledStory = async ({ page }: Fixtures) => {
    await page.goto('iframe.html?viewMode=story&id=input-decimalinput--disabled');

    const inputLocator = page.locator('#disabledInput');
    const toggleEnableBtnLocator = page.locator('#toggleEnableBtn');
    const changeValueBtnLocator = page.locator('#changeValueBtn');

    await inputLocator.waitFor({ state: 'visible' });
    await toggleEnableBtnLocator.waitFor({ state: 'visible' });
    await changeValueBtnLocator.waitFor({ state: 'visible' });

    await expect(inputLocator).toHaveValue('-5678.90');
    await expect(inputLocator).toBeDisabled();

    await expect(toggleEnableBtnLocator).toHaveText('Enable');
    await expect(toggleEnableBtnLocator).toBeEnabled();

    await expect(changeValueBtnLocator).toHaveText('Change value');
    await expect(changeValueBtnLocator).toBeEnabled();
};

export const toggleEnable = async ({ page }: Fixtures) => {
    const inputLocator = page.locator('#disabledInput');
    const toggleEnableBtnLocator = page.locator('#toggleEnableBtn');
    const changeValueBtnLocator = page.locator('#changeValueBtn');

    await inputLocator.waitFor({ state: 'visible' });
    await toggleEnableBtnLocator.waitFor({ state: 'visible' });
    await changeValueBtnLocator.waitFor({ state: 'visible' });

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

export const changeValue = async ({ page }: Fixtures) => {
    const inputLocator = page.locator('#disabledInput');
    const toggleEnableBtnLocator = page.locator('#toggleEnableBtn');
    const changeValueBtnLocator = page.locator('#changeValueBtn');

    await inputLocator.waitFor({ state: 'visible' });
    await toggleEnableBtnLocator.waitFor({ state: 'visible' });
    await changeValueBtnLocator.waitFor({ state: 'visible' });

    const enabled = await inputLocator.isEnabled();

    await changeValueBtnLocator.click();

    await expect(inputLocator).toHaveValue('1000');
    await expect(inputLocator).toBeEnabled({ enabled });

    await expect(toggleEnableBtnLocator).toHaveText((enabled) ? 'Disable' : 'Enable');
    await expect(toggleEnableBtnLocator).toBeEnabled();

    await expect(changeValueBtnLocator).toHaveText('Change value');
    await expect(changeValueBtnLocator).toBeEnabled();
};

test.describe('DecimalInput', () => {
    test('Type to empty input', async ({ page }) => {
        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--default');

        await inputToEmpty({ page }, 'defaultInput', '1', '1');
        await inputToEmpty({ page }, 'defaultInput', '1.', '1.');
        await inputToEmpty({ page }, 'defaultInput', '1.0', '1.0');
        await inputToEmpty({ page }, 'defaultInput', '1.01', '1.01');
        await inputToEmpty({ page }, 'defaultInput', '1.012', '1.012');
        await inputToEmpty({ page }, 'defaultInput', '1.0123', '1.0123');
        await inputToEmpty({ page }, 'defaultInput', '1.01234', '1.01234');
        await inputToEmpty({ page }, 'defaultInput', '-', '-');
        await inputToEmpty({ page }, 'defaultInput', '-.', '-.');
        await inputToEmpty({ page }, 'defaultInput', '-.0', '-.0');
        await inputToEmpty({ page }, 'defaultInput', '-.01', '-.01');
        await inputToEmpty({ page }, 'defaultInput', '-0', '-0');
        await inputToEmpty({ page }, 'defaultInput', '-0.', '-0.');
        await inputToEmpty({ page }, 'defaultInput', '-0.0', '-0.0');
        await inputToEmpty({ page }, 'defaultInput', '-0.01', '-0.01');
        await inputToEmpty({ page }, 'defaultInput', '-0.012', '-0.012');
        await inputToEmpty({ page }, 'defaultInput', '0', '0');
        await inputToEmpty({ page }, 'defaultInput', '00', '0');
        await inputToEmpty({ page }, 'defaultInput', '01', '01');
        await inputToEmpty({ page }, 'defaultInput', '0.', '0.');
        await inputToEmpty({ page }, 'defaultInput', '0.0', '0.0');
        await inputToEmpty({ page }, 'defaultInput', '0.01', '0.01');
        await inputToEmpty({ page }, 'defaultInput', '0.012', '0.012');
        await inputToEmpty({ page }, 'defaultInput', '.', '.');
        await inputToEmpty({ page }, 'defaultInput', '.0', '.0');
        await inputToEmpty({ page }, 'defaultInput', '.01', '.01');
        await inputToEmpty({ page }, 'defaultInput', '.012', '.012');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--min-max');

        await inputToEmpty({ page }, 'minMaxDecInput', '1', '1');
        await inputToEmpty({ page }, 'minMaxDecInput', '10', '10');
        await inputToEmpty({ page }, 'minMaxDecInput', '10.', '10.');
        await inputToEmpty({ page }, 'minMaxDecInput', '10.0', '10.0');
        await inputToEmpty({ page }, 'minMaxDecInput', '100', '10');
        await inputToEmpty({ page }, 'minMaxDecInput', '-1', '-1');
        await inputToEmpty({ page }, 'minMaxDecInput', '-10', '-10');
        await inputToEmpty({ page }, 'minMaxDecInput', '-10.', '-10.');
        await inputToEmpty({ page }, 'minMaxDecInput', '-10.0', '-10.0');
        await inputToEmpty({ page }, 'minMaxDecInput', '-100', '-10');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--digits-limit');

        await inputToEmpty({ page }, 'digitsLimitInput', '1.012', '1.012');
        await inputToEmpty({ page }, 'digitsLimitInput', '1.0123', '1.012');
        await inputToEmpty({ page }, 'digitsLimitInput', '1.01234', '1.012');
        await inputToEmpty({ page }, 'digitsLimitInput', '123.01234', '123.012');
        await inputToEmpty({ page }, 'digitsLimitInput', '.01234', '.012');
        await inputToEmpty({ page }, 'digitsLimitInput', '-.01234', '-.012');
        await inputToEmpty({ page }, 'digitsLimitInput', '-0.01234', '-0.012');
        await inputToEmpty({ page }, 'digitsLimitInput', '-1.01234', '-1.012');
        await inputToEmpty({ page }, 'digitsLimitInput', '-123.01234', '-123.012');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--integer');

        await inputToEmpty({ page }, 'integerInput', '0', '0');
        await inputToEmpty({ page }, 'integerInput', '00', '0');
        await inputToEmpty({ page }, 'integerInput', '0.', '0');
        await inputToEmpty({ page }, 'integerInput', '0.1', '01');
        await inputToEmpty({ page }, 'integerInput', '01', '01');
        await inputToEmpty({ page }, 'integerInput', '01.', '01');
        await inputToEmpty({ page }, 'integerInput', '01.2', '012');
        await inputToEmpty({ page }, 'integerInput', '1', '1');
        await inputToEmpty({ page }, 'integerInput', '1.', '1');
        await inputToEmpty({ page }, 'integerInput', '1.2', '12');
        await inputToEmpty({ page }, 'integerInput', '-', '-');
        await inputToEmpty({ page }, 'integerInput', '-.', '-');
        await inputToEmpty({ page }, 'integerInput', '-0.', '-0');
        await inputToEmpty({ page }, 'integerInput', '-0.1', '-01');
        await inputToEmpty({ page }, 'integerInput', '-01', '-01');
        await inputToEmpty({ page }, 'integerInput', '-01.', '-01');
        await inputToEmpty({ page }, 'integerInput', '-01.2', '-012');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--only-positive');

        await inputToEmpty({ page }, 'positiveInput', '.', '.');
        await inputToEmpty({ page }, 'positiveInput', '0', '0');
        await inputToEmpty({ page }, 'positiveInput', '1', '1');
        await inputToEmpty({ page }, 'positiveInput', '01', '01');
        await inputToEmpty({ page }, 'positiveInput', '001', '01');
        await inputToEmpty({ page }, 'positiveInput', '-', '');
        await inputToEmpty({ page }, 'positiveInput', '-1', '1');
        await inputToEmpty({ page }, 'positiveInput', '-0', '0');
        await inputToEmpty({ page }, 'positiveInput', '-00', '0');
        await inputToEmpty({ page }, 'positiveInput', '-.', '.');
        await inputToEmpty({ page }, 'positiveInput', '-.0', '.0');
        await inputToEmpty({ page }, 'positiveInput', '-0.01', '0.01');
        await inputToEmpty({ page }, 'positiveInput', '-00.01', '0.01');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--leading-zeros');

        await inputToEmpty({ page }, 'leadZerosInput', '001', '001');
        await inputToEmpty({ page }, 'leadZerosInput', '00.1', '00.1');
        await inputToEmpty({ page }, 'leadZerosInput', '-001', '-001');
        await inputToEmpty({ page }, 'leadZerosInput', '-00.1', '-00.1');
    });

    test('Type invalid values for current part of date', async ({ page }) => {
        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--default');

        await inputToEmpty({ page }, 'defaultInput', 'x', '');
        await inputToEmpty({ page }, 'defaultInput', '1x', '1');
        await inputToEmpty({ page }, 'defaultInput', '1.x', '1.');
        await inputToEmpty({ page }, 'defaultInput', '1.0x', '1.0');
        await inputToEmpty({ page }, 'defaultInput', '1.01x', '1.01');
        await inputToEmpty({ page }, 'defaultInput', '1-', '1');
        await inputToEmpty({ page }, 'defaultInput', '--', '-');
        await inputToEmpty({ page }, 'defaultInput', '1.2.', '1.2');
        await inputToEmpty({ page }, 'defaultInput', '1..2', '1.2');
        await inputToEmpty({ page }, 'defaultInput', '1.2.3', '1.23');
        await inputToEmpty({ page }, 'defaultInput', '..2', '.2');
        await inputToEmpty({ page }, 'defaultInput', '-x', '-');
        await inputToEmpty({ page }, 'defaultInput', '-.x', '-.');
        await inputToEmpty({ page }, 'defaultInput', '-.0x', '-.0');
        await inputToEmpty({ page }, 'defaultInput', '-0.x', '-0.');
        await inputToEmpty({ page }, 'defaultInput', '-0.0x', '-0.0');
        await inputToEmpty({ page }, 'defaultInput', '-0.01x', '-0.01');
        await inputToEmpty({ page }, 'defaultInput', '0x', '0');
        await inputToEmpty({ page }, 'defaultInput', '0.x', '0.');
        await inputToEmpty({ page }, 'defaultInput', '0.0x', '0.0');
        await inputToEmpty({ page }, 'defaultInput', '0.01x', '0.01');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--min-max');

        await inputToEmpty({ page }, 'minMaxDecInput', 'x', '');
        await inputToEmpty({ page }, 'minMaxDecInput', '1x', '1');
        await inputToEmpty({ page }, 'minMaxDecInput', '1.x', '1.');
        await inputToEmpty({ page }, 'minMaxDecInput', '10x', '10');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--digits-limit');

        await inputToEmpty({ page }, 'digitsLimitInput', 'x', '');
        await inputToEmpty({ page }, 'digitsLimitInput', '1x', '1');
        await inputToEmpty({ page }, 'digitsLimitInput', '1.x', '1.');
        await inputToEmpty({ page }, 'digitsLimitInput', '1.01x', '1.01');
        await inputToEmpty({ page }, 'digitsLimitInput', '1.012x', '1.012');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--integer');

        await inputToEmpty({ page }, 'integerInput', 'x', '');
        await inputToEmpty({ page }, 'integerInput', '1x', '1');
        await inputToEmpty({ page }, 'integerInput', '1.x', '1');
        await inputToEmpty({ page }, 'integerInput', '1.0x', '10');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--only-positive');

        await inputToEmpty({ page }, 'positiveInput', '0x', '0');
        await inputToEmpty({ page }, 'positiveInput', '0.x', '0.');
        await inputToEmpty({ page }, 'positiveInput', '0.0x', '0.0');
        await inputToEmpty({ page }, 'positiveInput', '0.01x', '0.01');
        await inputToEmpty({ page }, 'positiveInput', '1x', '1');
        await inputToEmpty({ page }, 'positiveInput', '01x', '01');
        await inputToEmpty({ page }, 'positiveInput', '.x', '.');
        await inputToEmpty({ page }, 'positiveInput', '-x', '');
        await inputToEmpty({ page }, 'positiveInput', '-.x', '.');
        await inputToEmpty({ page }, 'positiveInput', '-.0x', '.0');
        await inputToEmpty({ page }, 'positiveInput', '-.01x', '.01');
        await inputToEmpty({ page }, 'positiveInput', '-0x', '0');
        await inputToEmpty({ page }, 'positiveInput', '-0.x', '0.');
        await inputToEmpty({ page }, 'positiveInput', '-0.0x', '0.0');
        await inputToEmpty({ page }, 'positiveInput', '-0.01x', '0.01');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--leading-zeros');

        await inputToEmpty({ page }, 'leadZerosInput', '00x', '00');
        await inputToEmpty({ page }, 'leadZerosInput', '001x', '001');
        await inputToEmpty({ page }, 'leadZerosInput', '-00x', '-00');
        await inputToEmpty({ page }, 'leadZerosInput', '-001x', '-001');
        await inputToEmpty({ page }, 'leadZerosInput', '00.x', '00.');
        await inputToEmpty({ page }, 'leadZerosInput', '00.1x', '00.1');
        await inputToEmpty({ page }, 'leadZerosInput', '-00.x', '-00.');
        await inputToEmpty({ page }, 'leadZerosInput', '-00.1x', '-00.1');
    });

    test('Paste text to empty input', async ({ page }) => {
        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--default');

        await pasteToEmpty({ page }, 'defaultInput', '1', '1');
        await pasteToEmpty({ page }, 'defaultInput', '1.', '1.');
        await pasteToEmpty({ page }, 'defaultInput', '1.0', '1.0');
        await pasteToEmpty({ page }, 'defaultInput', '1.01', '1.01');
        await pasteToEmpty({ page }, 'defaultInput', '1.012', '1.012');
        await pasteToEmpty({ page }, 'defaultInput', '1.0123', '1.0123');
        await pasteToEmpty({ page }, 'defaultInput', '1.01234', '1.01234');
        await pasteToEmpty({ page }, 'defaultInput', '-', '-');
        await pasteToEmpty({ page }, 'defaultInput', '-.', '-.');
        await pasteToEmpty({ page }, 'defaultInput', '-.0', '-.0');
        await pasteToEmpty({ page }, 'defaultInput', '-.01', '-.01');
        await pasteToEmpty({ page }, 'defaultInput', '-0', '-0');
        await pasteToEmpty({ page }, 'defaultInput', '-0.', '-0.');
        await pasteToEmpty({ page }, 'defaultInput', '-0.0', '-0.0');
        await pasteToEmpty({ page }, 'defaultInput', '-0.01', '-0.01');
        await pasteToEmpty({ page }, 'defaultInput', '-0.012', '-0.012');
        await pasteToEmpty({ page }, 'defaultInput', '0', '0');
        await pasteToEmpty({ page }, 'defaultInput', '01', '01');
        await pasteToEmpty({ page }, 'defaultInput', '0.', '0.');
        await pasteToEmpty({ page }, 'defaultInput', '0.0', '0.0');
        await pasteToEmpty({ page }, 'defaultInput', '0.01', '0.01');
        await pasteToEmpty({ page }, 'defaultInput', '0.012', '0.012');
        await pasteToEmpty({ page }, 'defaultInput', '.', '.');
        await pasteToEmpty({ page }, 'defaultInput', '.0', '.0');
        await pasteToEmpty({ page }, 'defaultInput', '.01', '.01');
        await pasteToEmpty({ page }, 'defaultInput', '.012', '.012');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--digits-limit');

        await pasteToEmpty({ page }, 'digitsLimitInput', '10', '10');
        await pasteToEmpty({ page }, 'digitsLimitInput', '-10', '-10');

        await pasteToEmpty({ page }, 'digitsLimitInput', '1.', '1.');
        await pasteToEmpty({ page }, 'digitsLimitInput', '1.01', '1.01');
        await pasteToEmpty({ page }, 'digitsLimitInput', '1.012', '1.012');
        await pasteToEmpty({ page }, 'digitsLimitInput', '1234.012', '1234.012');
        await pasteToEmpty({ page }, 'digitsLimitInput', '-.', '-.');
        await pasteToEmpty({ page }, 'digitsLimitInput', '-.1', '-.1');
        await pasteToEmpty({ page }, 'digitsLimitInput', '-.12', '-.12');
        await pasteToEmpty({ page }, 'digitsLimitInput', '-.123', '-.123');
        await pasteToEmpty({ page }, 'digitsLimitInput', '-0.123', '-0.123');
        await pasteToEmpty({ page }, 'digitsLimitInput', '-1234.123', '-1234.123');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--leading-zeros');

        await pasteToEmpty({ page }, 'leadZerosInput', '000', '000');
        await pasteToEmpty({ page }, 'leadZerosInput', '001', '001');
        await pasteToEmpty({ page }, 'leadZerosInput', '00.1', '00.1');
        await pasteToEmpty({ page }, 'leadZerosInput', '-000', '-000');
        await pasteToEmpty({ page }, 'leadZerosInput', '-0001', '-0001');
        await pasteToEmpty({ page }, 'leadZerosInput', '-00.01', '-00.01');
    });

    test('Paste invalid text to empty input', async ({ page }) => {
        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--default');

        await pasteToEmpty({ page }, 'defaultInput', 'x', '');
        await pasteToEmpty({ page }, 'defaultInput', '00', '');
        await pasteToEmpty({ page }, 'defaultInput', '0x', '');
        await pasteToEmpty({ page }, 'defaultInput', '0.x', '');
        await pasteToEmpty({ page }, 'defaultInput', '0.0x', '');
        await pasteToEmpty({ page }, 'defaultInput', '0.01x', '');
        await pasteToEmpty({ page }, 'defaultInput', '--', '');
        await pasteToEmpty({ page }, 'defaultInput', '--1', '');
        await pasteToEmpty({ page }, 'defaultInput', '0.1.2', '');
        await pasteToEmpty({ page }, 'defaultInput', '0..1', '');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--min-max');

        await pasteToEmpty({ page }, 'minMaxDecInput', 'x', '');
        await pasteToEmpty({ page }, 'minMaxDecInput', '10x', '');
        await pasteToEmpty({ page }, 'minMaxDecInput', '100', '');
        await pasteToEmpty({ page }, 'minMaxDecInput', '-100', '');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--digits-limit');

        await pasteToEmpty({ page }, 'digitsLimitInput', 'x', '');
        await pasteToEmpty({ page }, 'digitsLimitInput', '1x', '');
        await pasteToEmpty({ page }, 'digitsLimitInput', '1.x', '');
        await pasteToEmpty({ page }, 'digitsLimitInput', '1.01x', '');
        await pasteToEmpty({ page }, 'digitsLimitInput', '1.012x', '');
        await pasteToEmpty({ page }, 'digitsLimitInput', '1.0123', '');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--integer');

        await pasteToEmpty({ page }, 'integerInput', 'x', '');
        await pasteToEmpty({ page }, 'integerInput', '1x', '');
        await pasteToEmpty({ page }, 'integerInput', '1.x', '');
        await pasteToEmpty({ page }, 'integerInput', '1.0x', '');
        await pasteToEmpty({ page }, 'integerInput', '1.0', '');
        await pasteToEmpty({ page }, 'integerInput', '.', '');
        await pasteToEmpty({ page }, 'integerInput', '-.', '');
        await pasteToEmpty({ page }, 'integerInput', '-1.', '');
        await pasteToEmpty({ page }, 'integerInput', '-1.0', '');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--only-positive');

        await pasteToEmpty({ page }, 'positiveInput', 'x', '');
        await pasteToEmpty({ page }, 'positiveInput', '0x', '');
        await pasteToEmpty({ page }, 'positiveInput', '0.x', '');
        await pasteToEmpty({ page }, 'positiveInput', '01x', '');
        await pasteToEmpty({ page }, 'positiveInput', '1x', '');
        await pasteToEmpty({ page }, 'positiveInput', '1.x', '');
        await pasteToEmpty({ page }, 'positiveInput', '1.0x', '');
        await pasteToEmpty({ page }, 'positiveInput', '-x', '');
        await pasteToEmpty({ page }, 'positiveInput', '-0x', '');
        await pasteToEmpty({ page }, 'positiveInput', '-01x', '');
        await pasteToEmpty({ page }, 'positiveInput', '-1x', '');
        await pasteToEmpty({ page }, 'positiveInput', '-1.x', '');
        await pasteToEmpty({ page }, 'positiveInput', '-1.0x', '');
        await pasteToEmpty({ page }, 'positiveInput', '-1.0x', '');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--leading-zeros');

        await pasteToEmpty({ page }, 'leadZerosInput', 'x', '');
        await pasteToEmpty({ page }, 'leadZerosInput', '0x', '');
        await pasteToEmpty({ page }, 'leadZerosInput', '01x', '');
        await pasteToEmpty({ page }, 'leadZerosInput', '001x', '');
        await pasteToEmpty({ page }, 'leadZerosInput', '-001x', '');
        await pasteToEmpty({ page }, 'leadZerosInput', '-00.1x', '');
    });

    test('Backspace key', async ({ page }) => {
        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--default');

        await backspaceFromPos({ page }, 'defaultInput', '1234.56789012', 13, '1234.5678901');
        await backspaceFromPos({ page }, 'defaultInput', '1234.5678901', 12, '1234.567890');
        await backspaceFromPos({ page }, 'defaultInput', '1234.567890', 11, '1234.56789');
        await backspaceFromPos({ page }, 'defaultInput', '1234.56789', 10, '1234.5678');
        await backspaceFromPos({ page }, 'defaultInput', '1234.5678', 9, '1234.567');
        await backspaceFromPos({ page }, 'defaultInput', '1234.567', 8, '1234.56');
        await backspaceFromPos({ page }, 'defaultInput', '1234.56', 7, '1234.5');
        await backspaceFromPos({ page }, 'defaultInput', '1234.5', 6, '1234.');
        await backspaceFromPos({ page }, 'defaultInput', '1234.', 5, '1234');
        await backspaceFromPos({ page }, 'defaultInput', '1234', 4, '123');
        await backspaceFromPos({ page }, 'defaultInput', '123', 3, '12');
        await backspaceFromPos({ page }, 'defaultInput', '12', 2, '1');
        await backspaceFromPos({ page }, 'defaultInput', '1', 1, '');
        await backspaceFromPos({ page }, 'defaultInput', '', 0, '');

        await backspaceFromPos({ page }, 'defaultInput', '1234.567890', 8, '1234.56890');
        await backspaceFromPos({ page }, 'defaultInput', '1234.56890', 7, '1234.5890');
        await backspaceFromPos({ page }, 'defaultInput', '1234.5890', 6, '1234.890');
        await backspaceFromPos({ page }, 'defaultInput', '1234.890', 5, '1234890');
        await backspaceFromPos({ page }, 'defaultInput', '1234890', 4, '123890');
    });

    test('Delete key', async ({ page }) => {
        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--default');

        await deleteFromPos({ page }, 'defaultInput', '12.3456789', 0, '2.3456789');
        await deleteFromPos({ page }, 'defaultInput', '2.3456789', 0, '.3456789');
        await deleteFromPos({ page }, 'defaultInput', '.3456789', 0, '3456789');
        await deleteFromPos({ page }, 'defaultInput', '-0.3456789', 0, '0.3456789');
        await deleteFromPos({ page }, 'defaultInput', '-.3456789', 0, '.3456789');

        await deleteFromPos({ page }, 'defaultInput', '12.3456789', 2, '123456789');
        await deleteFromPos({ page }, 'defaultInput', '12.3456789', 3, '12.456789');
        await deleteFromPos({ page }, 'defaultInput', '-12.3456789', 1, '-2.3456789');
    });

    test('Input text inside value', async ({ page }) => {
        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--default');

        await inputFromPos({ page }, 'defaultInput', '1234', 2, '.', '12.34');
        await inputFromPos({ page }, 'defaultInput', '1234', 2, '0', '12034');
        await inputFromPos({ page }, 'defaultInput', '0.1234', 2, '0', '0.01234');
        await inputFromPos({ page }, 'defaultInput', '.1234', 0, '0', '0.1234');
        await inputFromPos({ page }, 'defaultInput', '-1234', 3, '.', '-12.34');
        await inputFromPos({ page }, 'defaultInput', '-1234', 3, '0', '-12034');
        await inputFromPos({ page }, 'defaultInput', '-0.1234', 3, '0', '-0.01234');
        await inputFromPos({ page }, 'defaultInput', '-.1234', 1, '0', '-0.1234');
        await inputFromPos({ page }, 'defaultInput', '-.1234', 1, '1', '-1.1234');
        await inputFromPos({ page }, 'defaultInput', '-.1234', 6, '5', '-.12345');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--leading-zeros');

        await inputFromPos({ page }, 'leadZerosInput', '1234', 0, '0', '01234');
        await inputFromPos({ page }, 'leadZerosInput', '01234', 0, '0', '001234');
        await inputFromPos({ page }, 'leadZerosInput', '.1234', 0, '0', '0.1234');
        await inputFromPos({ page }, 'leadZerosInput', '0.1234', 0, '0', '00.1234');
        await inputFromPos({ page }, 'leadZerosInput', '-.1234', 1, '0', '-0.1234');
        await inputFromPos({ page }, 'leadZerosInput', '-0.1234', 1, '0', '-00.1234');
    });

    test('Input invalid text inside value', async ({ page }) => {
        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--default');

        await inputFromPos({ page }, 'defaultInput', '1234', 0, 'x', '1234');
        await inputFromPos({ page }, 'defaultInput', '1234', 2, 'x', '1234');
        await inputFromPos({ page }, 'defaultInput', '1234', 4, 'x', '1234');
        await inputFromPos({ page }, 'defaultInput', '1234', 2, '-', '1234');
        await inputFromPos({ page }, 'defaultInput', '-1234', 1, '-', '-1234');
        await inputFromPos({ page }, 'defaultInput', '-1234', 5, '-', '-1234');
        await inputFromPos({ page }, 'defaultInput', '-1.234', 0, '-.', '-1.234');
        await inputFromPos({ page }, 'defaultInput', '1.234', 2, '.', '1.234');
        await inputFromPos({ page }, 'defaultInput', '1.234', 3, '.', '1.234');
        await inputFromPos({ page }, 'defaultInput', '1.234', 3, '.', '1.234');
        await inputFromPos({ page }, 'defaultInput', '-1.234', 0, '.', '-1.234');
        await inputFromPos({ page }, 'defaultInput', '-1.234', 1, '.', '-1.234');
        await inputFromPos({ page }, 'defaultInput', '-1.234', 2, '.', '-1.234');
        await inputFromPos({ page }, 'defaultInput', '-1.234', 3, '.', '-1.234');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--digits-limit');

        await inputFromPos({ page }, 'digitsLimitInput', '123456', 0, '.', '123456');
        await inputFromPos({ page }, 'digitsLimitInput', '123456', 2, '.', '123456');
        await inputFromPos({ page }, 'digitsLimitInput', '123456', 6, 'x', '123456');
        await inputFromPos({ page }, 'digitsLimitInput', '-123456', 0, '.', '-123456');
        await inputFromPos({ page }, 'digitsLimitInput', '-123456', 1, '.', '-123456');
        await inputFromPos({ page }, 'digitsLimitInput', '-123456', 3, '.', '-123456');
        await inputFromPos({ page }, 'digitsLimitInput', '-123456', 7, 'x', '-123456');
        await inputFromPos({ page }, 'digitsLimitInput', '1.234', 0, 'x', '1.234');
        await inputFromPos({ page }, 'digitsLimitInput', '1.234', 1, 'x', '1.234');
        await inputFromPos({ page }, 'digitsLimitInput', '1.234', 5, 'x', '1.234');
        await inputFromPos({ page }, 'digitsLimitInput', '1.234', 5, '1', '1.234');
        await inputFromPos({ page }, 'digitsLimitInput', '1.234', 5, '0', '1.234');
        await inputFromPos({ page }, 'digitsLimitInput', '1.234', 5, '.', '1.234');
        await inputFromPos({ page }, 'digitsLimitInput', '.012', 4, '3', '.012');
        await inputFromPos({ page }, 'digitsLimitInput', '0.012', 5, '3', '0.012');
        await inputFromPos({ page }, 'digitsLimitInput', '-0.012', 6, '3', '-0.012');
        await inputFromPos({ page }, 'digitsLimitInput', '-.012', 5, '3', '-.012');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--integer');

        await inputFromPos({ page }, 'integerInput', '123456', 0, '.', '123456');
        await inputFromPos({ page }, 'integerInput', '123456', 1, '.', '123456');
        await inputFromPos({ page }, 'integerInput', '123456', 4, '.', '123456');
        await inputFromPos({ page }, 'integerInput', '-123456', 0, '.', '-123456');
        await inputFromPos({ page }, 'integerInput', '-123456', 1, '.', '-123456');
        await inputFromPos({ page }, 'integerInput', '-123456', 4, '.', '-123456');
        await inputFromPos({ page }, 'integerInput', '123456', 0, 'x', '123456');
        await inputFromPos({ page }, 'integerInput', '123456', 2, 'x', '123456');
        await inputFromPos({ page }, 'integerInput', '123456', 6, 'x', '123456');
        await inputFromPos({ page }, 'integerInput', '-123456', 0, 'x', '-123456');
        await inputFromPos({ page }, 'integerInput', '-123456', 1, 'x', '-123456');
        await inputFromPos({ page }, 'integerInput', '-123456', 4, 'x', '-123456');
        await inputFromPos({ page }, 'integerInput', '-123456', 7, 'x', '-123456');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--only-positive');

        await inputFromPos({ page }, 'positiveInput', '123456', 0, '-', '123456');
        await inputFromPos({ page }, 'positiveInput', '.123456', 0, '-', '.123456');
        await inputFromPos({ page }, 'positiveInput', '0.123456', 0, '-', '0.123456');
        await inputFromPos({ page }, 'positiveInput', '12.123456', 0, '-', '12.123456');
        await inputFromPos({ page }, 'positiveInput', '123456', 0, 'x', '123456');
        await inputFromPos({ page }, 'positiveInput', '123456', 2, 'x', '123456');
        await inputFromPos({ page }, 'positiveInput', '123456', 6, 'x', '123456');
        await inputFromPos({ page }, 'positiveInput', '.123456', 7, 'x', '.123456');
        await inputFromPos({ page }, 'positiveInput', '.123456', 0, 'x', '.123456');
        await inputFromPos({ page }, 'positiveInput', '0.123456', 0, 'x', '0.123456');
    });

    test('Input text into selection', async ({ page }) => {
        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--default');

        await inputToSelection({ page }, 'defaultInput', '123456', 2, 4, '.', '12.56');
        await inputToSelection({ page }, 'defaultInput', '123456', 0, 6, '-', '-');
        await inputToSelection({ page }, 'defaultInput', '123456', 0, 3, '0', '0456');
        await inputToSelection({ page }, 'defaultInput', '123456', 0, 3, '-', '-456');
    });

    test('Input invalid text into selection', async ({ page }) => {
        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--default');

        await inputToSelection({ page }, 'defaultInput', '123456', 2, 4, 'x', '123456');
        await inputToSelection({ page }, 'defaultInput', '12.3456', 3, 4, '.', '12.3456');
        await inputToSelection({ page }, 'defaultInput', '12.3456', 0, 2, '.', '12.3456');
        await inputToSelection({ page }, 'defaultInput', '12.3456', 0, 2, 'x', '12.3456');
        await inputToSelection({ page }, 'defaultInput', '12.3456', 5, 7, 'x', '12.3456');
        await inputToSelection({ page }, 'defaultInput', '12.3456', 5, 7, '-', '12.3456');
        await inputToSelection({ page }, 'defaultInput', '12.3456', 5, 7, '.', '12.3456');
        await inputToSelection({ page }, 'defaultInput', '12.3456', 5, 7, ' ', '12.3456');
        await inputToSelection({ page }, 'defaultInput', '-12.3456', 1, 2, '-', '-12.3456');
        await inputToSelection({ page }, 'defaultInput', '-12.3456', 1, 2, '.', '-12.3456');
        await inputToSelection({ page }, 'defaultInput', '0.3456', 1, 3, '0', '0.3456');
        await inputToSelection({ page }, 'defaultInput', '0.3456', 1, 3, 'x', '0.3456');
        await inputToSelection({ page }, 'defaultInput', '-0.3456', 1, 4, '-', '-0.3456');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--digits-limit');

        await inputToSelection({ page }, 'digitsLimitInput', '123456', 0, 2, 'x', '123456');
        await inputToSelection({ page }, 'digitsLimitInput', '123456', 4, 6, 'x', '123456');
        await inputToSelection({ page }, 'digitsLimitInput', '123456', 0, 2, '.', '123456');
        await inputToSelection({ page }, 'digitsLimitInput', '123456', 1, 2, '.', '123456');
        await inputToSelection({ page }, 'digitsLimitInput', '12340.123', 2, 4, '.', '12340.123');
        await inputToSelection({ page }, 'digitsLimitInput', '-123456', 2, 3, '.', '-123456');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--integer');

        await inputToSelection({ page }, 'integerInput', '123456', 0, 3, 'x', '123456');
        await inputToSelection({ page }, 'integerInput', '123456', 2, 4, 'x', '123456');
        await inputToSelection({ page }, 'integerInput', '123456', 4, 6, 'x', '123456');
        await inputToSelection({ page }, 'integerInput', '123456', 0, 3, '.', '123456');
        await inputToSelection({ page }, 'integerInput', '123456', 2, 4, '.', '123456');
        await inputToSelection({ page }, 'integerInput', '123456', 4, 6, '.', '123456');
        await inputToSelection({ page }, 'integerInput', '-123456', 0, 3, '.', '-123456');
        await inputToSelection({ page }, 'integerInput', '-123456', 2, 4, '.', '-123456');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--only-positive');

        await inputToSelection({ page }, 'positiveInput', '123456', 0, 3, 'x', '123456');
        await inputToSelection({ page }, 'positiveInput', '123456', 2, 4, 'x', '123456');
        await inputToSelection({ page }, 'positiveInput', '123456', 4, 6, 'x', '123456');
        await inputToSelection({ page }, 'positiveInput', '123456', 0, 3, '-', '123456');
        await inputToSelection({ page }, 'positiveInput', '123456', 0, 6, '-', '123456');
        await inputToSelection({ page }, 'positiveInput', '.123456', 0, 3, '-', '.123456');
        await inputToSelection({ page }, 'positiveInput', '0.123456', 0, 1, '-', '0.123456');
    });

    test('Paste text into selection', async ({ page }) => {
        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--default');

        await pasteToSelection({ page }, 'defaultInput', '123456', 2, 4, '.', '12.56');
        await pasteToSelection({ page }, 'defaultInput', '123456', 2, 4, '00', '120056');
        await pasteToSelection({ page }, 'defaultInput', '123456', 0, 6, '-', '-');
        await pasteToSelection({ page }, 'defaultInput', '123456', 0, 6, '.', '.');
        await pasteToSelection({ page }, 'defaultInput', '123456', 0, 3, '0', '0456');
        await pasteToSelection({ page }, 'defaultInput', '123456', 0, 3, '.', '.456');
        await pasteToSelection({ page }, 'defaultInput', '123456', 0, 3, '0.', '0.456');
        await pasteToSelection({ page }, 'defaultInput', '123456', 0, 3, '-', '-456');
        await pasteToSelection({ page }, 'defaultInput', '123456', 0, 3, '-.', '-.456');
        await pasteToSelection({ page }, 'defaultInput', '123456', 0, 3, '-0.', '-0.456');
        await pasteToSelection({ page }, 'defaultInput', '123456', 4, 6, '.', '1234.');
        await pasteToSelection({ page }, 'defaultInput', '123456', 4, 6, '.5', '1234.5');
    });

    test('Paste invalid text into selection', async ({ page }) => {
        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--default');

        await pasteToSelection({ page }, 'defaultInput', '123456', 2, 4, 'x', '123456');
        await pasteToSelection({ page }, 'defaultInput', '123456', 2, 4, '..', '123456');
        await pasteToSelection({ page }, 'defaultInput', '123456', 2, 4, '-', '123456');
        await pasteToSelection({ page }, 'defaultInput', '123456', 2, 4, ' ', '123456');
        await pasteToSelection({ page }, 'defaultInput', '123456', 0, 3, '--', '123456');
        await pasteToSelection({ page }, 'defaultInput', '123456', 0, 3, 'x', '123456');
        await pasteToSelection({ page }, 'defaultInput', '123456', 0, 3, '00', '123456');
        await pasteToSelection({ page }, 'defaultInput', '123456', 0, 3, '..', '123456');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--digits-limit');

        await pasteToSelection({ page }, 'digitsLimitInput', '123456789', 0, 3, 'x', '123456789');
        await pasteToSelection({ page }, 'digitsLimitInput', '123456789', 0, 3, '.', '123456789');
        await pasteToSelection({ page }, 'digitsLimitInput', '-123456789', 1, 2, '.', '-123456789');
        await pasteToSelection({ page }, 'digitsLimitInput', '123456.789', 3, 7, '.456', '123456.789');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--integer');

        await pasteToSelection({ page }, 'integerInput', '123456', 0, 3, 'x', '123456');
        await pasteToSelection({ page }, 'integerInput', '123456', 0, 3, '.', '123456');
        await pasteToSelection({ page }, 'integerInput', '123456', 2, 3, '.', '123456');
        await pasteToSelection({ page }, 'integerInput', '-123456', 2, 3, '.', '-123456');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--only-positive');

        await pasteToSelection({ page }, 'positiveInput', '123456', 0, 3, '-', '123456');
        await pasteToSelection({ page }, 'positiveInput', '123.456', 0, 3, '-', '123.456');
    });

    test('Paste text inside value', async ({ page }) => {
        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--default');

        await pasteFromPos({ page }, 'defaultInput', '123456', 3, '.', '123.456');
        await pasteFromPos({ page }, 'defaultInput', '123456', 3, '00', '12300456');
        await pasteFromPos({ page }, 'defaultInput', '123456', 0, '-', '-123456');
        await pasteFromPos({ page }, 'defaultInput', '123456', 0, '.', '.123456');
        await pasteFromPos({ page }, 'defaultInput', '123456', 0, '0.', '0.123456');
        await pasteFromPos({ page }, 'defaultInput', '123456', 6, '0.1', '1234560.1');
    });

    test('Paste invalid text inside value', async ({ page }) => {
        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--default');

        await pasteFromPos({ page }, 'defaultInput', '1234', 0, 'x', '1234');
        await pasteFromPos({ page }, 'defaultInput', '1234', 2, 'x', '1234');
        await pasteFromPos({ page }, 'defaultInput', '1234', 4, 'x', '1234');
        await pasteFromPos({ page }, 'defaultInput', '1234', 2, '-', '1234');
        await pasteFromPos({ page }, 'defaultInput', '-1234', 1, '-', '-1234');
        await pasteFromPos({ page }, 'defaultInput', '-1234', 5, '-', '-1234');
        await pasteFromPos({ page }, 'defaultInput', '-1.234', 0, '-.', '-1.234');
        await pasteFromPos({ page }, 'defaultInput', '1.234', 2, '.', '1.234');
        await pasteFromPos({ page }, 'defaultInput', '1.234', 3, '.', '1.234');
        await pasteFromPos({ page }, 'defaultInput', '1.234', 3, '.', '1.234');
        await pasteFromPos({ page }, 'defaultInput', '-1.234', 0, '.', '-1.234');
        await pasteFromPos({ page }, 'defaultInput', '-1.234', 1, '.', '-1.234');
        await pasteFromPos({ page }, 'defaultInput', '-1.234', 2, '.', '-1.234');
        await pasteFromPos({ page }, 'defaultInput', '-1.234', 3, '.', '-1.234');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--digits-limit');

        await pasteFromPos({ page }, 'digitsLimitInput', '123456', 0, '.', '123456');
        await pasteFromPos({ page }, 'digitsLimitInput', '123456', 2, '.', '123456');
        await pasteFromPos({ page }, 'digitsLimitInput', '123456', 6, 'x', '123456');
        await pasteFromPos({ page }, 'digitsLimitInput', '-123456', 0, '.', '-123456');
        await pasteFromPos({ page }, 'digitsLimitInput', '-123456', 1, '.', '-123456');
        await pasteFromPos({ page }, 'digitsLimitInput', '-123456', 3, '.', '-123456');
        await pasteFromPos({ page }, 'digitsLimitInput', '-123456', 7, 'x', '-123456');
        await pasteFromPos({ page }, 'digitsLimitInput', '1.234', 0, 'x', '1.234');
        await pasteFromPos({ page }, 'digitsLimitInput', '1.234', 1, 'x', '1.234');
        await pasteFromPos({ page }, 'digitsLimitInput', '1.234', 5, 'x', '1.234');
        await pasteFromPos({ page }, 'digitsLimitInput', '1.234', 5, '1', '1.234');
        await pasteFromPos({ page }, 'digitsLimitInput', '1.234', 5, '0', '1.234');
        await pasteFromPos({ page }, 'digitsLimitInput', '1.234', 5, '.', '1.234');
        await pasteFromPos({ page }, 'digitsLimitInput', '.012', 4, '3', '.012');
        await pasteFromPos({ page }, 'digitsLimitInput', '0.012', 5, '3', '0.012');
        await pasteFromPos({ page }, 'digitsLimitInput', '-0.012', 6, '3', '-0.012');
        await pasteFromPos({ page }, 'digitsLimitInput', '-.012', 5, '3', '-.012');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--integer');

        await pasteFromPos({ page }, 'integerInput', '123456', 0, '.', '123456');
        await pasteFromPos({ page }, 'integerInput', '123456', 1, '.', '123456');
        await pasteFromPos({ page }, 'integerInput', '123456', 4, '.', '123456');
        await pasteFromPos({ page }, 'integerInput', '-123456', 0, '.', '-123456');
        await pasteFromPos({ page }, 'integerInput', '-123456', 1, '.', '-123456');
        await pasteFromPos({ page }, 'integerInput', '-123456', 4, '.', '-123456');
        await pasteFromPos({ page }, 'integerInput', '123456', 0, 'x', '123456');
        await pasteFromPos({ page }, 'integerInput', '123456', 2, 'x', '123456');
        await pasteFromPos({ page }, 'integerInput', '123456', 6, 'x', '123456');
        await pasteFromPos({ page }, 'integerInput', '-123456', 0, 'x', '-123456');
        await pasteFromPos({ page }, 'integerInput', '-123456', 1, 'x', '-123456');
        await pasteFromPos({ page }, 'integerInput', '-123456', 4, 'x', '-123456');
        await pasteFromPos({ page }, 'integerInput', '-123456', 7, 'x', '-123456');

        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--only-positive');

        await pasteFromPos({ page }, 'positiveInput', '123456', 0, '-', '123456');
        await pasteFromPos({ page }, 'positiveInput', '.123456', 0, '-', '.123456');
        await pasteFromPos({ page }, 'positiveInput', '0.123456', 0, '-', '0.123456');
        await pasteFromPos({ page }, 'positiveInput', '12.123456', 0, '-', '12.123456');
        await pasteFromPos({ page }, 'positiveInput', '123456', 0, 'x', '123456');
        await pasteFromPos({ page }, 'positiveInput', '123456', 2, 'x', '123456');
        await pasteFromPos({ page }, 'positiveInput', '123456', 6, 'x', '123456');
        await pasteFromPos({ page }, 'positiveInput', '.123456', 7, 'x', '.123456');
        await pasteFromPos({ page }, 'positiveInput', '.123456', 0, 'x', '.123456');
        await pasteFromPos({ page }, 'positiveInput', '0.123456', 0, 'x', '0.123456');
    });

    test('Backspace key with selection', async ({ page }) => {
        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--default');

        await backspaceSelection({ page }, 'defaultInput', '123456', 0, 3, '456');
        await backspaceSelection({ page }, 'defaultInput', '123.456', 2, 5, '1256');
        await backspaceSelection({ page }, 'defaultInput', '.123456', 4, 7, '.123');
        await backspaceSelection({ page }, 'defaultInput', '-123456', 4, 7, '-123');
        await backspaceSelection({ page }, 'defaultInput', '0.000123', 1, 3, '0.000123');
        await backspaceSelection({ page }, 'defaultInput', '-0.000123', 2, 4, '-0.000123');
    });

    test('Delete key with selection', async ({ page }) => {
        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--default');

        await deleteSelection({ page }, 'defaultInput', '123456', 0, 3, '456');
        await deleteSelection({ page }, 'defaultInput', '123.456', 2, 5, '1256');
        await deleteSelection({ page }, 'defaultInput', '.123456', 4, 7, '.123');
        await deleteSelection({ page }, 'defaultInput', '-123456', 4, 7, '-123');
        await deleteSelection({ page }, 'defaultInput', '0.000123', 1, 3, '0.000123');
        await deleteSelection({ page }, 'defaultInput', '-0.000123', 2, 4, '-0.000123');
    });

    test('Cut selection', async ({ page }) => {
        await page.goto('iframe.html?viewMode=story&id=input-decimalinput--default');

        await cutSelection({ page }, 'defaultInput', '123456', 0, 3, '456');
        await cutSelection({ page }, 'defaultInput', '123.456', 2, 5, '1256');
        await cutSelection({ page }, 'defaultInput', '.123456', 4, 7, '.123');
        await cutSelection({ page }, 'defaultInput', '-123456', 4, 7, '-123');
        await cutSelection({ page }, 'defaultInput', '0.000123', 1, 3, '0.000123');
        await cutSelection({ page }, 'defaultInput', '-0.000123', 2, 4, '-0.000123');
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
