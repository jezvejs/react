import { expect, type Locator, type Page } from '@playwright/test';

export interface ButtonState {
    title: string;
    visible: boolean;
    enabled: boolean;
    type?: string;
}

export const defaultButtonState: ButtonState = {
    title: '',
    visible: true,
    enabled: true,
    type: 'button',
};

/**
 * Page Object Model for 'button' element
 */
export class Button {
    readonly page: Page;

    readonly locator: Locator;

    state: ButtonState = defaultButtonState;

    constructor(page: Page, locator: Locator) {
        this.page = page;
        this.locator = locator;
    }

    async assertState(expectedState: ButtonState) {
        const {
            visible,
            enabled,
            title,
            type,
        } = expectedState;

        await expect(this.locator).toBeVisible({ visible });
        await expect(this.locator).toBeEnabled({ enabled });
        await expect(this.locator).toHaveText(title);

        if (type) {
            await expect(this.locator).toHaveAttribute('type', type);
        }

        this.state = { ...expectedState };
    }

    async click() {
        return this.locator.click();
    }
}
