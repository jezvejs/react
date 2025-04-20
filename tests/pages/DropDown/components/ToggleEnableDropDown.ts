import { type Locator, type Page } from '@playwright/test';
import { DropDown } from '@jezvejs/react-test';

/**
 * Toggle enable wrapper aroung DropDown test component
 */
export class ToggleEnableDropDown extends DropDown {
    readonly toggleEnableBtnLocator: Locator;

    constructor(page: Page, rootLocator: Locator, toggleEnableBtnLocator: Locator) {
        super(page, rootLocator);

        this.toggleEnableBtnLocator = toggleEnableBtnLocator;
    }

    async toggleEnable() {
        return this.toggleEnableBtnLocator.click();
    }
}
