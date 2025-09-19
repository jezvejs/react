import { DropDown } from '@jezvejs/react-test';
import { expect, type Page } from '@playwright/test';

import { asyncMap } from 'utils/index.ts';

import { mapItems, toFlatList } from 'pages/Menu/utils.ts';

import { ToggleEnableDropDown } from './components/ToggleEnableDropDown.ts';

import { initialComponents } from './defaultProps.ts';
import { initialState } from './initialState.ts';
import {
    DropDownId,
    DropDownPageComponents,
    DropDownPageState,
    SimpleDropDownId,
    ToggleEnableDropDownId,
} from './types.ts';
import { filterDropDownItems, toggleSelectItem } from './utils.ts';

const componentIds = Object.keys(initialComponents) as DropDownId[];

const toggleEnableButtonIds = {
    filterDropDown: 'toggleEnableBtn',
    filterMultiDropDown: 'toggleEnableFilterMultiBtn',
};

const toggleEnableComponentIds = Object.keys(toggleEnableButtonIds) as DropDownId[];

const PAGE_ID_PREFIX = 'menu-dropdown--';

export class DropDownPage implements DropDownPageComponents {
    readonly page: Page;

    inlineDropDown: DropDown | null = null;

    inlineDropDown2: DropDown | null = null;

    fullWidthDropDown: DropDown | null = null;

    fixedMenuDropDown: DropDown | null = null;

    groupsDropDown: DropDown | null = null;

    attachedToBlockDropDown: DropDown | null = null;

    attachedToInlineDropDown: DropDown | null = null;

    multipleSelectDropDown: DropDown | null = null;

    filterDropDown: ToggleEnableDropDown | null = null;

    filterMultiDropDown: ToggleEnableDropDown | null = null;

    attachedFilterDropDown: DropDown | null = null;

    attachedFilterMultipleDropDown: DropDown | null = null;

    filterGroupsDropDown: DropDown | null = null;

    filterGroupsMultiDropDown: DropDown | null = null;

    pageId: DropDownId | null;

    state: DropDownPageState = initialState;

    constructor(page: Page) {
        this.page = page;
        this.pageId = this.getPageId();

        this.init();
    }

    init() {
        const pageId = this.pageId as DropDownId;

        if (pageId && componentIds.includes(pageId)) {
            this.createComponent(pageId);
        } else {
            componentIds.forEach((menuId) => this.createComponent(menuId));
        }
    }

    getPageId() {
        const url = new URL(this.page.url());
        const id = url.searchParams.get('id');
        if (!id?.startsWith(PAGE_ID_PREFIX)) {
            return null;
        }

        return id.substring(PAGE_ID_PREFIX.length) as DropDownId;
    }

    async loadStoryById(storyId: string) {
        this.page.goto(`iframe.html?args=&globals=&id=${PAGE_ID_PREFIX}${storyId}&viewMode=story`);
    }

    async loadInline() {
        this.loadStoryById('inline');
    }

    async loadFullWidth() {
        this.loadStoryById('full-width');
    }

    async loadFixedMenu() {
        this.loadStoryById('fixed-menu');
    }

    async loadGroups() {
        this.loadStoryById('groups');
    }

    async loadAttachedToBlock() {
        this.loadStoryById('attach-to-block');
    }

    async loadAttachedToInline() {
        this.loadStoryById('attach-to-inline');
    }

    async loadMultiSelect() {
        this.loadStoryById('multiple-select');
    }

    async loadFilterSingleSelect() {
        this.loadStoryById('filter-single');
    }

    async loadFilterMultiSelect() {
        this.loadStoryById('filter-multiple');
    }

    async loadFilterAttachedToBlock() {
        this.loadStoryById('filter-attach-to-block');
    }

    async loadFilterMultiAttachedToBlock() {
        this.loadStoryById('filter-multi-attach-to-block');
    }

    async loadFilterGroups() {
        this.loadStoryById('filter-groups');
    }

    async loadFilterGroupsMultiSelect() {
        this.loadStoryById('filter-groups-multiple');
    }

    createComponent(id: DropDownId) {
        if (toggleEnableComponentIds.includes(id)) {
            this.createToggleEnableComponent(id as ToggleEnableDropDownId);
            return;
        }

        if (!componentIds.includes(id) || toggleEnableComponentIds.includes(id)) {
            return;
        }

        const dropDownId = id as SimpleDropDownId;
        this[dropDownId] = new DropDown(this.page, this.page.locator(`#${id}`));
    }

    createToggleEnableComponent(id: ToggleEnableDropDownId) {
        const btnId = toggleEnableButtonIds[id] ?? null;
        if (!componentIds.includes(id) || !btnId) {
            return;
        }

        this[id] = new ToggleEnableDropDown(
            this.page,
            this.page.locator(`#${id}`),
            this.page.locator(`#${btnId}`),
        );
    }

    async assertState(state: DropDownPageState) {
        const pageId = this.pageId as DropDownId;
        if (pageId && componentIds.includes(pageId)) {
            await this.assertDropDownState(pageId, state);
        } else {
            await asyncMap(componentIds, (menuId) => this.assertDropDownState(menuId, state));
        }
    }

    isValidComponentId(id: DropDownId) {
        return componentIds.includes(id) && !!this[id];
    }

    async assertDropDownState(id: DropDownId, state: DropDownPageState) {
        if (!this.isValidComponentId(id)) {
            return;
        }

        await this[id]?.assertState(state[id]);
    }

    async waitForLoad(id: DropDownId | null = null) {
        await this.page.waitForLoadState('networkidle');

        if (id && this[id]) {
            await this[id].rootLocator.waitFor({ state: 'visible' });
        }
        this.pageId = id;

        this.init();
    }

    async waitForItemsCount(state: DropDownPageState, id: DropDownId) {
        expect(this.isValidComponentId(id)).toBeTruthy();

        const componentState = state[id];
        const { inputString } = componentState;
        const items = (typeof inputString === 'string' && inputString.length > 0)
            ? (componentState.menu?.filteredItems ?? [])
            : (componentState.menu?.items ?? []);

        // Include group headers to the flat list results, because
        // Menu test component includes all items to the search results
        const options = {
            includeGroupItems: true,
            includeChildItems: false,
        };

        const flatList = toFlatList(items ?? [], options)
            .filter((item) => !!item && !item.hidden);

        await this[id]?.waitForItemsCount(flatList.length);
    }

    onToggleMenu(id: DropDownId) {
        const componentState = this.state[id];
        const menuItems = componentState.menu?.items ?? [];

        const options = {
            includeGroupItems: true,
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

    onClickItemById(id: DropDownId, itemId: string) {
        const componentState = this.state[id];
        if (!componentState) {
            throw new Error(`Invalid component id: '${id}'`);
        }

        const menuState = toggleSelectItem(componentState, itemId);

        const expectedState: DropDownPageState = {
            ...this.state,
            [id]: {
                ...menuState,
            },
        };

        return expectedState;
    }

    onFilterItems(id: DropDownId, value: string) {
        const componentState = this.state[id];
        if (!componentState) {
            throw new Error(`Invalid component id: '${id}'`);
        }

        const menuState = filterDropDownItems(componentState, value);

        const expectedState: DropDownPageState = {
            ...this.state,
            [id]: {
                ...menuState,
            },
        };

        return expectedState;
    }

    onToggleEnable(id: DropDownId) {
        const componentState = this.state[id];
        if (!componentState) {
            throw new Error(`Invalid component id: '${id}'`);
        }

        const expectedState: DropDownPageState = {
            ...this.state,
            [id]: {
                ...componentState,
                disabled: !componentState.disabled,
            },
        };

        return expectedState;
    }

    async clickByToggleButton(id: DropDownId) {
        expect(this.isValidComponentId(id)).toBeTruthy();

        const expectedState = this.onToggleMenu(id);

        await this[id]?.clickByToggleButton();
        await this[id]?.waitForMenu(expectedState[id].open);
        if (expectedState[id].open) {
            await this.waitForItemsCount(expectedState, id);
        }
        await this.assertState(expectedState);

        this.state = expectedState;
    }

    async clickByContainer(id: DropDownId) {
        expect(this.isValidComponentId(id)).toBeTruthy();

        const expectedState = this.onToggleMenu(id);

        await this[id]?.clickByContainer();
        await this[id]?.waitForMenu(expectedState[id].open);
        await this.assertState(expectedState);

        this.state = expectedState;
    }

    async clickItemById(id: DropDownId, itemId: string) {
        expect(this.isValidComponentId(id)).toBeTruthy();

        const expectedState = this.onClickItemById(id, itemId);

        await this[id]?.clickItemById(itemId);
        if (expectedState[id].multiple) {
            await this[id]?.waitForValue(expectedState[id].value);
        } else {
            await this[id]?.waitForMenu(expectedState[id].open);
        }
        await this.assertState(expectedState);

        this.state = expectedState;
    }

    async filter(id: DropDownId, value: string) {
        expect(this.isValidComponentId(id)).toBeTruthy();

        const expectedState = this.onFilterItems(id, value);

        await this[id]?.inputFilterValue(value);
        await this[id]?.waitForInputValue(value);
        await this.waitForItemsCount(expectedState, id);

        await this.assertState(expectedState);

        this.state = expectedState;
    }

    async toggleEnable(id: DropDownId) {
        expect(this.isValidComponentId(id)).toBeTruthy();

        const expectedState = this.onToggleEnable(id);

        const toggleEnableComponent = this[id] as ToggleEnableDropDown;

        await toggleEnableComponent.toggleEnable();
        await this.assertState(expectedState);

        this.state = expectedState;
    }
}
