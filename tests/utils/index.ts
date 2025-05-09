import { isFunction } from '@jezvejs/types';
import { expect, Locator } from '@playwright/test';
import { AsyncCallback, Fixtures } from './types.ts';

/** Maps array using async callback function */
export const asyncMap = async <T = unknown>(data: Array<T>, func: AsyncCallback<T>) => {
    if (!Array.isArray(data)) {
        throw new Error('Invalid data type');
    }
    if (!isFunction(func)) {
        throw new Error('Invalid function type');
    }

    const tasks = data.map(func);
    return Promise.all(tasks);
};

export const inputToEmpty = async (
    { page }: Fixtures,
    name: string,
    value: string,
    expected: string,
) => {
    const inputLocator = page.locator(`#${name}`);
    await inputLocator.waitFor({ state: 'visible' });

    await inputLocator.clear();
    await expect(inputLocator).toHaveValue('');

    await inputLocator.pressSequentially(value);
    await expect(inputLocator).toHaveValue(expected);
};

export const pasteToEmpty = async (
    { page }: Fixtures,
    name: string,
    value: string,
    expected: string,
) => {
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

export const setCursorPos = async (locator: Locator, pos: number) => {
    await locator.press('Home');
    for (let i = 0; i < pos; i++) {
        await locator.press('ArrowRight');
    }
};

export const setSelection = async (locator: Locator, start: number, end: number) => {
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

export const pressKeyFromPos = async (
    { page }: Fixtures,
    name: string,
    value: string,
    key: string,
    pos: number,
    expected: string,
) => {
    const inputLocator = page.locator(`#${name}`);
    await inputLocator.waitFor({ state: 'visible' });

    await inputLocator.clear();
    await inputLocator.fill(value);
    await expect(inputLocator).toHaveValue(value);

    await setCursorPos(inputLocator, pos);

    await page.keyboard.press(key);
    await expect(inputLocator).toHaveValue(expected);
};

export const backspaceFromPos = (
    { page }: Fixtures,
    name: string,
    value: string,
    pos: number,
    expected: string,
) => (
    pressKeyFromPos({ page }, name, value, 'Backspace', pos, expected)
);

export const deleteFromPos = (
    { page }: Fixtures,
    name: string,
    value: string,
    pos: number,
    expected: string,
) => (
    pressKeyFromPos({ page }, name, value, 'Delete', pos, expected)
);

export const inputFromPos = async (
    { page }: Fixtures,
    name: string,
    initial: string,
    pos: number,
    value: string,
    expected: string,
) => {
    const inputLocator = page.locator(`#${name}`);
    await inputLocator.waitFor({ state: 'visible' });

    await inputLocator.clear();
    await inputLocator.fill(initial);
    await expect(inputLocator).toHaveValue(initial);

    await setCursorPos(inputLocator, pos);

    await inputLocator.pressSequentially(value);
    await expect(inputLocator).toHaveValue(expected);
};

export const inputToSelection = async (
    { page }: Fixtures,
    name: string,
    initial: string,
    start: number,
    end: number,
    value: string,
    expected: string,
) => {
    const inputLocator = page.locator(`#${name}`);
    await inputLocator.waitFor({ state: 'visible' });

    await inputLocator.clear();
    await inputLocator.fill(initial);
    await expect(inputLocator).toHaveValue(initial);

    await setSelection(inputLocator, start, end);

    await inputLocator.pressSequentially(value);
    await expect(inputLocator).toHaveValue(expected);
};

export const pasteToSelection = async (
    { page }: Fixtures,
    name: string,
    initial: string,
    start: number,
    end: number,
    value: string,
    expected: string,
) => {
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

export const pasteFromPos = async (
    { page }: Fixtures,
    name: string,
    initial: string,
    pos: number,
    value: string,
    expected: string,
) => {
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

export const pressKeyToSelection = async (
    { page }: Fixtures,
    name: string,
    initial: string,
    start: number,
    end: number,
    key: string,
    expected: string,
) => {
    const inputLocator = page.locator(`#${name}`);
    await inputLocator.waitFor({ state: 'visible' });

    await inputLocator.clear();
    await inputLocator.fill(initial);
    await expect(inputLocator).toHaveValue(initial);

    await setSelection(inputLocator, start, end);

    await page.keyboard.press(key);
    await expect(inputLocator).toHaveValue(expected);
};

export const backspaceSelection = (
    { page }: Fixtures,
    name: string,
    initial: string,
    start: number,
    end: number,
    expected: string,
) => (
    pressKeyToSelection({ page }, name, initial, start, end, 'Backspace', expected)
);

export const deleteSelection = (
    { page }: Fixtures,
    name: string,
    initial: string,
    start: number,
    end: number,
    expected: string,
) => (
    pressKeyToSelection({ page }, name, initial, start, end, 'Delete', expected)
);

export const cutSelection = async (
    { page }: Fixtures,
    name: string,
    initial: string,
    start: number,
    end: number,
    expected: string,
) => {
    const inputLocator = page.locator(`#${name}`);
    await inputLocator.waitFor({ state: 'visible' });

    await inputLocator.clear();
    await inputLocator.fill(initial);
    await expect(inputLocator).toHaveValue(initial);

    await setSelection(inputLocator, start, end);

    await inputLocator.press('Control+X');
    await expect(inputLocator).toHaveValue(expected);
};
