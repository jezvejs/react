import { expect, type Locator, type Page } from '@playwright/test';

export interface InputState {
    value: string;
    visible: boolean;
    enabled: boolean;
}

export const defaultInputState: InputState = {
    value: '',
    visible: true,
    enabled: true,
};

/**
 * Page Object Model for 'input' element
 */
export class Input {
    readonly page: Page;

    readonly locator: Locator;

    state: InputState = defaultInputState;

    constructor(page: Page, locator: Locator) {
        this.page = page;
        this.locator = locator;
    }

    async assertState(expectedState: InputState) {
        const { visible, enabled, value } = expectedState;

        await expect(this.locator).toBeVisible({ visible });
        await expect(this.locator).toBeEnabled({ enabled });
        await expect(this.locator).toHaveValue(value);

        this.state = structuredClone(expectedState);
    }

    async fill(value: string) {
        const expectedState = { ...this.state, value };

        await this.locator.focus();

        if (value === '') {
            await this.locator.clear();
        } else {
            await this.locator.fill(value);
        }

        await this.assertState(expectedState);
    }

    async clear() {
        return this.locator.clear();
    }

    async press(value: string) {
        return this.locator.press(value);
    }

    async click() {
        return this.locator.click();
    }

    async focus() {
        return this.locator.focus();
    }

    async blur() {
        return this.locator.blur();
    }

    async setCursorPos(pos: number) {
        await this.press('Home');
        for (let i = 0; i < pos; i++) {
            await this.press('ArrowRight');
        }
    }

    async setSelection(start: number, end: number) {
        const min = Math.min(start, end);
        const max = Math.max(start, end);

        await this.setCursorPos(min);

        await this.locator.page().keyboard.down('Shift');

        for (let i = min; i < max; i++) {
            await this.press('ArrowRight');
        }
        await this.locator.page().keyboard.up('Shift');
    }

    async inputToEmpty(value: string, expected: string) {
        await this.locator.clear();
        await expect(this.locator).toHaveValue('');

        await this.locator.pressSequentially(value);
        await expect(this.locator).toHaveValue(expected);
    }

    async pasteToEmpty(expected: string) {
        await this.locator.clear();
        await expect(this.locator).toHaveValue('');

        await this.press('Control+V');
        await expect(this.locator).toHaveValue(expected);
    }

    async clearAndFill(value: string) {
        await this.locator.clear();
        await this.locator.fill(value);
        await expect(this.locator).toHaveValue(value);
    }

    async pressKeyFromPos(
        value: string,
        key: string,
        pos: number,
        expected: string,
    ) {
        await this.clearAndFill(value);

        await this.setCursorPos(pos);

        await this.locator.page().keyboard.press(key);
        await expect(this.locator).toHaveValue(expected);
    }

    async inputFromPos(
        initial: string,
        pos: number,
        value: string,
        expected: string,
    ) {
        await this.clearAndFill(initial);

        await this.setCursorPos(pos);

        await this.locator.pressSequentially(value);
        await expect(this.locator).toHaveValue(expected);
    }

    async inputToSelection(
        initial: string,
        start: number,
        end: number,
        value: string,
        expected: string,
    ) {
        await this.clearAndFill(initial);

        await this.setSelection(start, end);

        await this.locator.pressSequentially(value);
        await expect(this.locator).toHaveValue(expected);
    }

    async pasteToSelection(
        initial: string,
        start: number,
        end: number,
        expected: string,
    ) {
        await this.clearAndFill(initial);

        await this.setSelection(start, end);

        await this.press('Control+V');
        await expect(this.locator).toHaveValue(expected);
    }

    async pasteFromPos(
        initial: string,
        pos: number,
        expected: string,
    ) {
        await this.clearAndFill(initial);

        await this.setCursorPos(pos);

        await this.press('Control+V');
        await expect(this.locator).toHaveValue(expected);
    }

    async pressKeyToSelection(
        initial: string,
        start: number,
        end: number,
        key: string,
        expected: string,
    ) {
        await this.clearAndFill(initial);

        await this.setSelection(start, end);

        await this.locator.page().keyboard.press(key);
        await expect(this.locator).toHaveValue(expected);
    }

    async cutSelection(
        initial: string,
        start: number,
        end: number,
        expected: string,
    ) {
        await this.clearAndFill(initial);

        await this.setSelection(start, end);

        await this.press('Control+X');
        await expect(this.locator).toHaveValue(expected);
    }
}
