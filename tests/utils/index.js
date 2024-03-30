import { expect } from '@playwright/test';

export const inputToEmpty = async ({ page }, name, value, expected) => {
    const inputLocator = page.locator(`#${name}`);
    await inputLocator.waitFor({ state: 'visible' });

    await inputLocator.clear();
    await expect(inputLocator).toHaveValue('');

    await inputLocator.pressSequentially(value);
    await expect(inputLocator).toHaveValue(expected);
};

export const pasteToEmpty = async ({ page }, name, value, expected) => {
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

export const setCursorPos = async (locator, pos) => {
    await locator.press('Home');
    for (let i = 0; i < pos; i++) {
        await locator.press('ArrowRight');
    }
};

export const setSelection = async (locator, start, end) => {
    await locator.press('Home');

    const min = Math.min(start, end);
    const max = Math.max(start, end);

    for (let i = 0; i < min; i++) {
        await locator.press('ArrowRight');
    }
    await locator.page().keyboard.down('Shift');

    for (let i = min; i < max; i++) {
        await locator.press('ArrowRight');
    }
    await locator.page().keyboard.up('Shift');
};

export const pressKeyFromPos = async ({ page }, name, value, key, pos, expected) => {
    const inputLocator = page.locator(`#${name}`);
    await inputLocator.waitFor({ state: 'visible' });

    await inputLocator.clear();
    await inputLocator.fill(value);
    await expect(inputLocator).toHaveValue(value);

    await setCursorPos(inputLocator, pos);

    await page.keyboard.press(key);
    await expect(inputLocator).toHaveValue(expected);
};

export const backspaceFromPos = ({ page }, name, value, pos, expected) => (
    pressKeyFromPos({ page }, name, value, 'Backspace', pos, expected)
);

export const deleteFromPos = ({ page }, name, value, pos, expected) => (
    pressKeyFromPos({ page }, name, value, 'Delete', pos, expected)
);

export const inputFromPos = async ({ page }, name, initial, pos, value, expected) => {
    const inputLocator = page.locator(`#${name}`);
    await inputLocator.waitFor({ state: 'visible' });

    await inputLocator.clear();
    await inputLocator.fill(initial);
    await expect(inputLocator).toHaveValue(initial);

    await setCursorPos(inputLocator, pos);

    await inputLocator.pressSequentially(value);
    await expect(inputLocator).toHaveValue(expected);
};

export const inputToSelection = async ({ page }, name, initial, start, end, value, expected) => {
    const inputLocator = page.locator(`#${name}`);
    await inputLocator.waitFor({ state: 'visible' });

    await inputLocator.clear();
    await inputLocator.fill(initial);
    await expect(inputLocator).toHaveValue(initial);

    await setSelection(inputLocator, start, end);

    await inputLocator.pressSequentially(value);
    await expect(inputLocator).toHaveValue(expected);
};

export const pasteToSelection = async ({ page }, name, initial, start, end, value, expected) => {
    const inputLocator = page.locator(`#${name}`);
    await inputLocator.waitFor({ state: 'visible' });

    const tmpLocator = page.locator('.tmp-input');
    await tmpLocator.waitFor({ state: 'visible' });

    await inputLocator.clear();
    await inputLocator.fill(initial);
    await expect(inputLocator).toHaveValue(initial);

    await tmpLocator.clear();
    await tmpLocator.fill(value);
    await expect(tmpLocator).toHaveValue(value);

    await tmpLocator.press('Control+A');
    await tmpLocator.press('Control+C');

    await setSelection(inputLocator, start, end);

    await inputLocator.press('Control+V');
    await expect(inputLocator).toHaveValue(expected);
};

export const pasteFromPos = async ({ page }, name, initial, pos, value, expected) => {
    const inputLocator = page.locator(`#${name}`);
    await inputLocator.waitFor({ state: 'visible' });

    const tmpLocator = page.locator('.tmp-input');
    await tmpLocator.waitFor({ state: 'visible' });

    await inputLocator.clear();
    await inputLocator.fill(initial);
    await expect(inputLocator).toHaveValue(initial);

    await tmpLocator.clear();
    await tmpLocator.fill(value);
    await expect(tmpLocator).toHaveValue(value);

    await tmpLocator.press('Control+A');
    await tmpLocator.press('Control+C');

    await setCursorPos(inputLocator, pos);

    await inputLocator.press('Control+V');
    await expect(inputLocator).toHaveValue(expected);
};

export const pressKeyToSelection = async ({ page }, name, initial, start, end, key, expected) => {
    const inputLocator = page.locator(`#${name}`);
    await inputLocator.waitFor({ state: 'visible' });

    await inputLocator.clear();
    await inputLocator.fill(initial);
    await expect(inputLocator).toHaveValue(initial);

    await setSelection(inputLocator, start, end);

    await page.keyboard.press(key);
    await expect(inputLocator).toHaveValue(expected);
};

export const backspaceSelection = ({ page }, name, initial, start, end, expected) => (
    pressKeyToSelection({ page }, name, initial, start, end, 'Backspace', expected)
);

export const deleteSelection = ({ page }, name, initial, start, end, expected) => (
    pressKeyToSelection({ page }, name, initial, start, end, 'Delete', expected)
);