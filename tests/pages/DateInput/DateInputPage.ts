import {
    Button,
    ButtonState,
    Input,
    InputState,
} from '@jezvejs/react-test';
import { expect, Locator, type Page } from '@playwright/test';

import { asyncMap } from 'shared/utils.ts';

import {
    dateInputIds,
    disabledInputPageButtonsIds,
    initialComponents,
    initialInputComponents,
} from './defaultProps.ts';
import { initialState } from './initialState.ts';
import {
    DateInputId,
    DateInputPageComponents,
    DateInputPageComponentsIds,
    DateInputPageId,
    DateInputPageState,
} from './types.ts';

const componentIds = Object.keys(initialComponents) as DateInputPageComponentsIds[];
const inputComponentIds = Object.keys(initialInputComponents) as DateInputId[];

const localesComponentIds = ['localeInput'] as DateInputId[];

const disabledComponentIds = ['disabledDateInput'] as DateInputId[];

const PAGE_ID_PREFIX = 'input-dateinput--';

export class DateInputPage {
    readonly page: Page;

    pageId: DateInputPageId | null = null;

    components: DateInputPageComponents = initialComponents;

    state: DateInputPageState = initialState;

    constructor(page: Page) {
        this.page = page;

        this.initPage(this.getPageId());
    }

    init() {
        const pageId = this.pageId as DateInputId;

        if (pageId && componentIds.includes(pageId)) {
            this.createComponent(pageId);
        } else {
            inputComponentIds.forEach((itemId) => this.createComponent(itemId));
        }
    }

    getPageId(): DateInputPageId | null {
        const url = new URL(this.page.url());
        const id = url.searchParams.get('id');
        if (!id?.startsWith(PAGE_ID_PREFIX)) {
            return null;
        }

        return id.substring(PAGE_ID_PREFIX.length) as DateInputPageId;
    }

    initPage(storyId: DateInputPageId | null) {
        this.pageId = storyId;

        this.init();
    }

    async loadStoryById(storyId: DateInputPageId) {
        await this.page.goto(`iframe.html?args=&globals=&id=${PAGE_ID_PREFIX}${storyId}&viewMode=story`);

        this.initPage(storyId);
    }

    async loadDefault() {
        await this.loadStoryById('default');
        await this.waitForLoad('defaultInput');
    }

    async loadPlaceholder() {
        await this.loadStoryById('placeholder');
    }

    async loadLocales() {
        await this.loadStoryById('locales');
        await this.waitForLoad('localeInput');
    }

    async loadDisabled() {
        await this.loadStoryById('disabled');
        await this.waitForLoad('disabledDateInput');
    }

    createComponent(id: DateInputId) {
        if (disabledComponentIds.includes(id)) {
            this.createDisabledInputComponents();
        }
        if (localesComponentIds.includes(id)) {
            this.createLocalesInputComponents();
        }

        if (!dateInputIds.includes(id)) {
            return;
        }

        this.components[id] = new Input(this.page, this.page.locator(`#${id}`));
    }

    createLocalesInputComponents() {
        const id = 'localeSelect';
        this.components[id] = this.page.locator(`#${id}`);
    }

    createDisabledInputComponents() {
        disabledInputPageButtonsIds.forEach((id) => {
            this.components[id] = new Button(this.page, this.page.locator(`#${id}`));
        });
    }

    async assertState(state: DateInputPageState) {
        const pageId = this.pageId as DateInputId;
        if (pageId && componentIds.includes(pageId)) {
            await this.assertComponentState(pageId, state);
        } else {
            await asyncMap(componentIds, (itemId) => this.assertComponentState(itemId, state));
        }
    }

    isValidComponentId(id: DateInputPageComponentsIds) {
        return componentIds.includes(id) && !!this.components[id];
    }

    getComponent(id: DateInputPageComponentsIds) {
        expect(this.isValidComponentId(id)).toBeTruthy();

        return this.components[id];
    }

    async assertComponentState(id: DateInputPageComponentsIds, state: DateInputPageState) {
        if (!this.isValidComponentId(id) || !state[id]) {
            return;
        }

        const dateInput = this.getComponent(id);
        if (!dateInput || !('assertState' in dateInput)) {
            return;
        }
        await dateInput?.assertState(state[id] as (InputState & ButtonState));
    }

    async waitForLoad(id: DateInputId | null = null) {
        await this.page.waitForLoadState('networkidle');

        if (id && this.components[id]) {
            await this.components[id].locator.waitFor({ state: 'visible' });
        }

        this.init();
    }

    async selectLocale(value: string) {
        await this.loadLocales();

        const selectLocator = this.getComponent('localeSelect') as Locator;

        const selected = await selectLocator.selectOption(value);
        const valuesArray = Array.isArray(value) ? value : [value];
        expect(selected).toStrictEqual(valuesArray);
    }

    async inputToEmpty(id: DateInputId, value: string, expected: string) {
        const dateInput = this.getComponent(id) as Input;
        await dateInput.inputToEmpty(value, expected);
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

    async pasteToEmpty(id: DateInputId, value: string, expected: string) {
        const dateInput = this.getComponent(id) as Input;

        await this.copyFromTempInput(value);
        await dateInput.pasteToEmpty(expected);
    }

    async pressKeyFromPos(
        id: DateInputId,
        value: string,
        key: string,
        pos: number,
        expected: string,
    ) {
        const dateInput = this.getComponent(id) as Input;
        await dateInput.pressKeyFromPos(value, key, pos, expected);
    }

    async backspaceFromPos(
        id: DateInputId,
        value: string,
        pos: number,
        expected: string,
    ) {
        await this.pressKeyFromPos(id, value, 'Backspace', pos, expected);
    }

    async deleteFromPos(
        id: DateInputId,
        value: string,
        pos: number,
        expected: string,
    ) {
        await this.pressKeyFromPos(id, value, 'Delete', pos, expected);
    }

    async inputFromPos(
        id: DateInputId,
        initial: string,
        pos: number,
        value: string,
        expected: string,
    ) {
        const dateInput = this.getComponent(id) as Input;
        await dateInput.inputFromPos(initial, pos, value, expected);
    }

    async inputToSelection(
        id: DateInputId,
        initial: string,
        start: number,
        end: number,
        value: string,
        expected: string,
    ) {
        const dateInput = this.getComponent(id) as Input;
        await dateInput.inputToSelection(initial, start, end, value, expected);
    }

    async pasteToSelection(
        id: DateInputId,
        initial: string,
        start: number,
        end: number,
        value: string,
        expected: string,
    ) {
        const dateInput = this.getComponent(id) as Input;

        await this.copyFromTempInput(value);
        await dateInput.pasteToSelection(initial, start, end, expected);
    }

    async pasteFromPos(
        id: DateInputId,
        initial: string,
        pos: number,
        value: string,
        expected: string,
    ) {
        const dateInput = this.getComponent(id) as Input;

        await this.copyFromTempInput(value);
        await dateInput.pasteFromPos(initial, pos, expected);
    }

    async pressKeyToSelection(
        id: DateInputId,
        initial: string,
        start: number,
        end: number,
        key: string,
        expected: string,
    ) {
        const dateInput = this.getComponent(id) as Input;
        await dateInput.pressKeyToSelection(initial, start, end, key, expected);
    }

    async backspaceSelection(
        id: DateInputId,
        initial: string,
        start: number,
        end: number,
        expected: string,
    ) {
        const dateInput = this.getComponent(id) as Input;
        await dateInput.pressKeyToSelection(initial, start, end, 'Backspace', expected);
    }

    async deleteSelection(
        id: DateInputId,
        initial: string,
        start: number,
        end: number,
        expected: string,
    ) {
        const dateInput = this.getComponent(id) as Input;
        await dateInput.pressKeyToSelection(initial, start, end, 'Delete', expected);
    }

    async cutSelection(
        id: DateInputId,
        initial: string,
        start: number,
        end: number,
        expected: string,
    ) {
        const dateInput = this.getComponent(id) as Input;
        await dateInput.cutSelection(initial, start, end, expected);
    }

    async onLoadDisabled() {
        const dateInput = this.getComponent('disabledDateInput') as Input;
        const toggleEnableBtn = this.getComponent('toggleEnableBtn') as Button;
        const changeValueBtn = this.getComponent('changeValueBtn') as Button;

        await dateInput.locator.waitFor({ state: 'visible' });
        await toggleEnableBtn.locator.waitFor({ state: 'visible' });
        await changeValueBtn.locator.waitFor({ state: 'visible' });

        await dateInput.assertState({
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
        const dateInput = this.getComponent('disabledDateInput') as Input;
        const toggleEnableBtn = this.getComponent('toggleEnableBtn') as Button;
        const changeValueBtn = this.getComponent('changeValueBtn') as Button;

        await dateInput.locator.waitFor({ state: 'visible' });
        await toggleEnableBtn.locator.waitFor({ state: 'visible' });
        await changeValueBtn.locator.waitFor({ state: 'visible' });

        const enabled = await dateInput.locator.isEnabled();
        const value = await dateInput.locator.inputValue();

        await toggleEnableBtn.click();

        await dateInput.assertState({
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
        const dateInput = this.getComponent('disabledDateInput') as Input;
        const toggleEnableBtn = this.getComponent('toggleEnableBtn') as Button;
        const changeValueBtn = this.getComponent('changeValueBtn') as Button;

        await dateInput.locator.waitFor({ state: 'visible' });
        await toggleEnableBtn.locator.waitFor({ state: 'visible' });
        await changeValueBtn.locator.waitFor({ state: 'visible' });

        const enabled = await dateInput.locator.isEnabled();

        await changeValueBtn.click();

        await dateInput.assertState({
            visible: true,
            enabled,
            value: '02/01/00',
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
