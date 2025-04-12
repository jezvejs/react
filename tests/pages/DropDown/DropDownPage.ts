import { expect, type Page } from '@playwright/test';
import {
    DropDown,
} from '@jezvejs/react-test';

import { asyncMap } from '../../utils/index.ts';
import { DropDownPageState } from './types.ts';
import { getItemById, mapItems } from '../Menu/utils.ts';
import { initialState } from './initialState.ts';

const componentIds = [
    'inlineDropDown',
    'inlineDropDown2',
    'fullWidthDropDown',
    'fixedMenuDropDown',
    'groupsDropDown',
    'attachedToBlockDropDown',
    'attachedToInlineDropDown',
];

export class DropDownPage {
    readonly page: Page;

    inlineDropDown: DropDown | null = null;

    inlineDropDown2: DropDown | null = null;

    fullWidthDropDown: DropDown | null = null;

    fixedMenuDropDown: DropDown | null = null;

    groupsDropDown: DropDown | null = null;

    attachedToBlockDropDown: DropDown | null = null;

    attachedToInlineDropDown: DropDown | null = null;

    singleComponentId: string;

    state: DropDownPageState = initialState;

    constructor(page: Page, singleComponentId = '') {
        this.page = page;
        this.singleComponentId = singleComponentId;

        if (componentIds.includes(singleComponentId)) {
            this.createComponent(singleComponentId);
        } else {
            componentIds.forEach((menuId) => this.createComponent(menuId));
        }
    }

    createComponent(id: string) {
        if (!componentIds.includes(id)) {
            return;
        }

        this[id] = new DropDown(this.page, this.page.locator(`#${id}`));
    }

    isSingleComponent() {
        return this.singleComponentId !== '' && componentIds.includes(this.singleComponentId);
    }

    async assertState(state: DropDownPageState) {
        if (this.isSingleComponent()) {
            await this.assertDropDownState(this.singleComponentId, state);
        } else {
            await asyncMap(componentIds, (menuId) => this.assertDropDownState(menuId, state));
        }
    }

    isValidComponentId(id: string) {
        return componentIds.includes(id) && !!this[id];
    }

    async assertDropDownState(id: string, state: DropDownPageState) {
        if (!this.isValidComponentId(id)) {
            return;
        }

        await this[id].assertState(state[id]);
    }

    async waitForLoad(id = '') {
        await this.page.waitForLoadState('networkidle');

        if (id !== '' && this[id]) {
            await this[id].rootLocator.waitFor({ state: 'visible' });
        }
    }

    onToggleMenu(id: string) {
        const componentState = this.state[id];
        const menuItems = componentState.menu.items;

        const options = {
            includeGroupItems: componentState.menu.allowActiveGroupHeader,
            includeChildItems: false,
        };

        const expectedState: DropDownPageState = {
            ...this.state,
            [id]: {
                ...this.state[id],
                open: !this.state[id].open,
                menu: {
                    ...this.state[id].menu,
                    visible: !this.state[id].open,
                    items: mapItems(menuItems, (item) => (
                        ({ ...item, active: false })
                    ), options),
                },
            },
        };

        return expectedState;
    }

    onClickItemById(id: string, itemId: string) {
        const componentState = this.state[id];
        const menuItems = componentState.menu.items;

        if (!componentState.open) {
            return this.state;
        }

        const options = {
            includeGroupItems: componentState.menu.allowActiveGroupHeader,
            includeChildItems: false,
        };

        const targetItem = getItemById(itemId, menuItems);
        if (!targetItem) {
            return this.state;
        }

        const expectedState: DropDownPageState = {
            ...this.state,
            [id]: {
                ...this.state[id],
                open: false,
                value: targetItem.id,
                textValue: targetItem.title,
                menu: {
                    ...this.state[id].menu,
                    visible: false,
                    items: mapItems(menuItems, (item) => (
                        ({ ...item, active: false })
                    ), options),
                },
            },
        };

        return expectedState;
    }

    async clickByToggleButton(id: string) {
        expect(this.isValidComponentId(id)).toBeTruthy();

        const expectedState = this.onToggleMenu(id);

        await this[id].clickByToggleButton();
        await this[id].waitForMenu(expectedState[id].open);
        await this.assertState(expectedState);

        this.state = expectedState;
    }

    async clickByContainer(id: string) {
        expect(this.isValidComponentId(id)).toBeTruthy();

        const expectedState = this.onToggleMenu(id);

        await this[id].clickByContainer();
        await this[id].waitForMenu(expectedState[id].open);
        await this.assertState(expectedState);

        this.state = expectedState;
    }

    async clickItemById(id: string, itemId: string) {
        expect(this.isValidComponentId(id)).toBeTruthy();

        const expectedState = this.onClickItemById(id, itemId);

        await this[id].clickItemById(itemId);
        await this[id].waitForMenu(expectedState[id].open);
        await this.assertState(expectedState);

        this.state = expectedState;
    }
}
