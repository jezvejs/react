import { type Locator, type Page } from '@playwright/test';
import { DropDown } from '@jezvejs/react-test';

/**
 * Toggle enable wrapper aroung DropDown test component
 */
export class ToggleEnableDropDown extends DropDown {
    readonly toggleEnableBtnLocator: Locator;

    constructor(page: Page, locator: Locator, toggleEnableBtnLocator: Locator) {
        super(page, locator);

        this.toggleEnableBtnLocator = toggleEnableBtnLocator;
    }

    async toggleEnable() {
        return this.toggleEnableBtnLocator.click();
    }
}
