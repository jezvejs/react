import {
    Button,
    ButtonState,
    Input,
    InputState,
} from '@jezvejs/react-test';
import { expect, type Page } from '@playwright/test';

import { asyncMap } from 'shared/utils.ts';

import {
    decimalInputIds,
    disabledInputPageButtonsIds,
    initialComponents,
    initialInputComponents,
} from './defaultProps.ts';
import { initialState } from './initialState.ts';
import {
    DecimalInputId,
    DecimalInputPageComponents,
    DecimalInputPageComponentsIds,
    DecimalInputPageId,
    DecimalInputPageState,
} from './types.ts';

const componentIds = Object.keys(initialComponents) as DecimalInputPageComponentsIds[];
const inputComponentIds = Object.keys(initialInputComponents) as DecimalInputId[];

const disabledComponentIds = ['disabledInput'] as DecimalInputId[];

const PAGE_ID_PREFIX = 'input-decimalinput--';

export class DecimalInputPage {
    readonly page: Page;

    pageId: DecimalInputPageId | null = null;

    components: DecimalInputPageComponents = initialComponents;

    state: DecimalInputPageState = initialState;

    constructor(page: Page) {
        this.page = page;

        this.initPage(this.getPageId());
    }

    init() {
        const pageId = this.pageId as DecimalInputId;

        if (pageId && componentIds.includes(pageId)) {
            this.createComponent(pageId);
        } else {
            inputComponentIds.forEach((itemId) => this.createComponent(itemId));
        }
    }

    getPageId(): DecimalInputPageId | null {
        const url = new URL(this.page.url());
        const id = url.searchParams.get('id');
        if (!id?.startsWith(PAGE_ID_PREFIX)) {
            return null;
        }

        return id.substring(PAGE_ID_PREFIX.length) as DecimalInputPageId;
    }

    initPage(storyId: DecimalInputPageId | null) {
        this.pageId = storyId;

        this.init();
    }

    async loadStoryById(storyId: DecimalInputPageId) {
        await this.page.goto(`iframe.html?args=&globals=&id=${PAGE_ID_PREFIX}${storyId}&viewMode=story`);

        this.initPage(storyId);
    }

    async loadDefault() {
        await this.loadStoryById('default');
        await this.waitForLoad('defaultInput');
    }

    async loadDigitsLimit() {
        await this.loadStoryById('digits-limit');
        await this.waitForLoad('digitsLimitInput');
    }

    async loadMinMax() {
        await this.loadStoryById('min-max');
        await this.waitForLoad('minMaxDecInput');
    }

    async loadInteger() {
        await this.loadStoryById('integer');
        await this.waitForLoad('integerInput');
    }

    async loadPositive() {
        await this.loadStoryById('only-positive');
        await this.waitForLoad('positiveInput');
    }

    async loadLeadZeros() {
        await this.loadStoryById('leading-zeros');
        await this.waitForLoad('leadZerosInput');
    }

    async loadDisabled() {
        await this.loadStoryById('disabled');
        await this.waitForLoad('disabledInput');
    }

    createComponent(id: DecimalInputId) {
        if (disabledComponentIds.includes(id)) {
            this.createDisabledInputComponents();
        }

        if (!decimalInputIds.includes(id)) {
            return;
        }

        this.components[id] = new Input(this.page, this.page.locator(`#${id}`));
    }

    createDisabledInputComponents() {
        disabledInputPageButtonsIds.forEach((id) => {
            this.components[id] = new Button(this.page, this.page.locator(`#${id}`));
        });
    }

    async assertState(state: DecimalInputPageState) {
        const pageId = this.pageId as DecimalInputId;
        if (pageId && componentIds.includes(pageId)) {
            await this.assertComponentState(pageId, state);
        } else {
            await asyncMap(componentIds, (itemId) => this.assertComponentState(itemId, state));
        }
    }

    isValidComponentId(id: DecimalInputPageComponentsIds) {
        return componentIds.includes(id) && !!this.components[id];
    }

    getComponent(id: DecimalInputPageComponentsIds) {
        expect(this.isValidComponentId(id)).toBeTruthy();

        return this.components[id];
    }

    async assertComponentState(id: DecimalInputPageComponentsIds, state: DecimalInputPageState) {
        if (!this.isValidComponentId(id) || !state[id]) {
            return;
        }

        const decimalInput = this.getComponent(id);
        await decimalInput?.assertState(state[id] as (InputState & ButtonState));
    }

    async waitForLoad(id: DecimalInputId | null = null) {
        await this.page.waitForLoadState('networkidle');

        if (id && this.components[id]) {
            await this.components[id].locator.waitFor({ state: 'visible' });
        }

        this.init();
    }

    async inputToEmpty(id: DecimalInputId, value: string, expected: string) {
        const decimalInput = this.getComponent(id) as Input;
        await decimalInput.inputToEmpty(value, expected);
    }

    async copyFromTempInput(value: string) {
        const tmpLocator = this.page.locator('.tmp-input');
        await tmpLocator.waitFor({ state: 'visible' });

        await tmpLocator.clear();
        await tmpLocator.fill(value);
        await expect(tmpLocator).toHaveValue(value);

        await tmpLocator.press('Control+A');
        await tmpLocator.press('Control+C');
    }

    async pasteToEmpty(id: DecimalInputId, value: string, expected: string) {
        const decimalInput = this.getComponent(id) as Input;

        await this.copyFromTempInput(value);
        await decimalInput.pasteToEmpty(expected);
    }

    async pressKeyFromPos(
        id: DecimalInputId,
        value: string,
        key: string,
        pos: number,
        expected: string,
    ) {
        const decimalInput = this.getComponent(id) as Input;
        await decimalInput.pressKeyFromPos(value, key, pos, expected);
    }

    async backspaceFromPos(
        id: DecimalInputId,
        value: string,
        pos: number,
        expected: string,
    ) {
        await this.pressKeyFromPos(id, value, 'Backspace', pos, expected);
    }

    async deleteFromPos(
        id: DecimalInputId,
        value: string,
        pos: number,
        expected: string,
    ) {
        await this.pressKeyFromPos(id, value, 'Delete', pos, expected);
    }

    async inputFromPos(
        id: DecimalInputId,
        initial: string,
        pos: number,
        value: string,
        expected: string,
    ) {
        const decimalInput = this.getComponent(id) as Input;
        await decimalInput.inputFromPos(initial, pos, value, expected);
    }

    async inputToSelection(
        id: DecimalInputId,
        initial: string,
        start: number,
        end: number,
        value: string,
        expected: string,
    ) {
        const decimalInput = this.getComponent(id) as Input;
        await decimalInput.inputToSelection(initial, start, end, value, expected);
    }

    async pasteToSelection(
        id: DecimalInputId,
        initial: string,
        start: number,
        end: number,
        value: string,
        expected: string,
    ) {
        const decimalInput = this.getComponent(id) as Input;

        await this.copyFromTempInput(value);
        await decimalInput.pasteToSelection(initial, start, end, expected);
    }

    async pasteFromPos(
        id: DecimalInputId,
        initial: string,
        pos: number,
        value: string,
        expected: string,
    ) {
        const decimalInput = this.getComponent(id) as Input;

        await this.copyFromTempInput(value);
        await decimalInput.pasteFromPos(initial, pos, expected);
    }

    async pressKeyToSelection(
        id: DecimalInputId,
        initial: string,
        start: number,
        end: number,
        key: string,
        expected: string,
    ) {
        const decimalInput = this.getComponent(id) as Input;
        await decimalInput.pressKeyToSelection(initial, start, end, key, expected);
    }

    async backspaceSelection(
        id: DecimalInputId,
        initial: string,
        start: number,
        end: number,
        expected: string,
    ) {
        const decimalInput = this.getComponent(id) as Input;
        await decimalInput.pressKeyToSelection(initial, start, end, 'Backspace', expected);
    }

    async deleteSelection(
        id: DecimalInputId,
        initial: string,
        start: number,
        end: number,
        expected: string,
    ) {
        const decimalInput = this.getComponent(id) as Input;
        await decimalInput.pressKeyToSelection(initial, start, end, 'Delete', expected);
    }

    async cutSelection(
        id: DecimalInputId,
        initial: string,
        start: number,
        end: number,
        expected: string,
    ) {
        const decimalInput = this.getComponent(id) as Input;
        await decimalInput.cutSelection(initial, start, end, expected);
    }

    async onLoadDisabled() {
        const decimalInput = this.getComponent('disabledInput') as Input;
        const toggleEnableBtn = this.getComponent('toggleEnableBtn') as Button;
        const changeValueBtn = this.getComponent('changeValueBtn') as Button;

        await decimalInput.locator.waitFor({ state: 'visible' });
        await toggleEnableBtn.locator.waitFor({ state: 'visible' });
        await changeValueBtn.locator.waitFor({ state: 'visible' });

        await decimalInput.assertState({
            visible: true,
            enabled: false,
            value: '01/02/03',
        });

        await toggleEnableBtn.assertState({
            visible: true,
            enabled: true,
            title: 'Enable',
        });

        await changeValueBtn.assertState({
            visible: true,
            enabled: true,
            title: 'Change value',
        });
    }

    async toggleEnable() {
        const decimalInput = this.getComponent('disabledInput') as Input;
        const toggleEnableBtn = this.getComponent('toggleEnableBtn') as Button;
        const changeValueBtn = this.getComponent('changeValueBtn') as Button;

        await decimalInput.locator.waitFor({ state: 'visible' });
        await toggleEnableBtn.locator.waitFor({ state: 'visible' });
        await changeValueBtn.locator.waitFor({ state: 'visible' });

        const enabled = await decimalInput.locator.isEnabled();
        const value = await decimalInput.locator.inputValue();

        await toggleEnableBtn.click();

        await decimalInput.assertState({
            visible: true,
            enabled: !enabled,
            value,
        });

        await toggleEnableBtn.assertState({
            visible: true,
            enabled: true,
            title: (enabled) ? 'Enable' : 'Disable',
        });

        await changeValueBtn.assertState({
            visible: true,
            enabled: true,
            title: 'Change value',
        });
    }

    async changeValue() {
        const decimalInput = this.getComponent('disabledInput') as Input;
        const toggleEnableBtn = this.getComponent('toggleEnableBtn') as Button;
        const changeValueBtn = this.getComponent('changeValueBtn') as Button;

        await decimalInput.locator.waitFor({ state: 'visible' });
        await toggleEnableBtn.locator.waitFor({ state: 'visible' });
        await changeValueBtn.locator.waitFor({ state: 'visible' });

        const enabled = await decimalInput.locator.isEnabled();

        await changeValueBtn.click();

        await decimalInput.assertState({
            visible: true,
            enabled,
            value: '1000',
        });

        await toggleEnableBtn.assertState({
            visible: true,
            enabled: true,
            title: (enabled) ? 'Disable' : 'Enable',
        });

        await changeValueBtn.assertState({
            visible: true,
            enabled: true,
            title: 'Change value',
        });
    }
}
