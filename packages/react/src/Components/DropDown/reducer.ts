import { isFunction } from '@jezvejs/types';

import { createSlice } from '../../utils/createSlice.ts';
import { MenuHelpers } from '../Menu/Menu.tsx';

import {
    createGroup,
    createItems,
    createMenuItem,
    getAvailableItems,
} from './helpers.ts';
import { DropDownCreateGroupParam, DropDownMenuItemProps, DropDownState } from './types.ts';
import { MenuItemType } from '../Menu/types.ts';

const {
    filterItems,
    findLastMenuItem,
    forItems,
    generateItemId,
    mapItems,
    pushItem,
} = MenuHelpers;

const deactivateAllItems = (items: DropDownMenuItemProps[]) => (
    mapItems(items, (item: DropDownMenuItemProps) => ({ ...item, active: false }))
);

/**
 * Search for last selected item to leave selection only on it
 * If not found select first item
 * @param {Object} state
 * @returns
 */
export const processSingleSelection = (state: DropDownState) => {
    if (state.multiple) {
        return state;
    }

    let selectedItem = findLastMenuItem(
        state.items ?? [],
        (item: DropDownMenuItemProps) => !!item.selected,
    );
    if (!selectedItem) {
        const availItems = getAvailableItems(state);
        [selectedItem] = availItems;
    }

    const selId = selectedItem?.id?.toString() ?? null;
    return {
        ...state,
        items: mapItems<DropDownMenuItemProps>(
            state.items ?? [],
            (item: DropDownMenuItemProps) => ({
                ...item,
                selected: item.id === selId,
            }),
        ),
    };
};

const renderAddMessage = (state: DropDownState) => {
    const title = state?.inputString ?? '';
    const message = isFunction(state.addItemMessage)
        ? state.addItemMessage(title)
        : state.addItemMessage;

    if (typeof message !== 'string') {
        throw new Error('Invalid message');
    }

    return {
        title: message,
        selectable: true,
        type: 'button' as MenuItemType,
        className: 'dd__create-item',
    };
};

// Reducers
const slice = createSlice({
    startScrollWaiting: (state: DropDownState) => (
        (!state.waitForScroll) ? { ...state, waitForScroll: true } : state
    ),

    stopScrollWaiting: (state: DropDownState) => (
        (state.waitForScroll) ? { ...state, waitForScroll: false } : state
    ),

    startWindowListening: (state: DropDownState) => (
        (!state.listeningWindow) ? { ...state, listeningWindow: true } : state
    ),

    stopWindowListening: (state: DropDownState) => (
        (state.listeningWindow) ? { ...state, listeningWindow: false } : state
    ),

    confirmTouch: (state: DropDownState) => ({ ...state, isTouch: true }),

    setRenderTime: (state: DropDownState) => ({ ...state, renderTime: Date.now() }),

    deselectAll: (state: DropDownState) => ({
        ...state,
        items: mapItems(state.items ?? [], (item) => ({
            ...item,
            selected: false,
        })),
        changed: true,
    }),

    removeCreatableMenuItem: (state: DropDownState) => (
        (state.createFromInputItemId)
            ? {
                ...state,
                createFromInputItemId: null,
                items: filterItems(
                    state.items ?? [],
                    (item) => item.id !== state.createFromInputItemId,
                ),
            }
            : state
    ),

    toggleShowMenu: (state: DropDownState) => ({
        ...state,
        visible: !state.visible,
        inputString: (!state.visible) ? state.inputString : null,
        active: (!state.visible) ? true : state.active,
        items: (
            (!state.visible)
                ? state.items
                : deactivateAllItems(state.items ?? [])
        ),
    }),

    showMenu: (state: DropDownState, visible: boolean) => (
        (state.visible === visible)
            ? state
            : {
                ...state,
                visible,
                inputString: (visible) ? state.inputString : null,
                active: (visible) ? true : state.active,
                items: (
                    (visible)
                        ? state.items
                        : deactivateAllItems(state.items ?? [])
                ),
            }
    ),

    toggleEnable: (state: DropDownState) => ({
        ...state,
        disabled: !state.disabled,
        active: false,
    }),

    toggleActivate: (state: DropDownState) => ({
        ...state,
        active: !state.active,
        actSelItemIndex: -1,
        filtered: false,
        inputString: null,
        items: deactivateAllItems(state.items ?? []),
    }),

    activateInput: (state: DropDownState) => ({
        ...state,
        actSelItemIndex: -1,
        inputString: (
            (state.inputString === null) ? '' : state.inputString
        ),
        filtered: (
            (state.inputString === null) ? false : state.filtered
        ),
    }),

    setChanged: (state: DropDownState) => (
        (!state.changed) ? { ...state, changed: true } : state
    ),

    changeEventSent: (state: DropDownState) => (
        (state.changed) ? { ...state, changed: false } : state
    ),

    selectItem: (state: DropDownState, id: string) => ({
        ...state,
        items: mapItems(state.items ?? [], (item) => ({
            ...item,
            selected: (state.multiple)
                ? (item.selected || item.id === id)
                : (item.id === id),
        })),
    }),

    deselectItem: (state: DropDownState, id: string) => ({
        ...state,
        items: mapItems(state.items ?? [], (item) => ({
            ...item,
            selected: item.selected && item.id !== id,
        })),
    }),

    setSelection: (state: DropDownState, ids: string[]) => ({
        ...state,
        items: mapItems(state.items ?? [], (item) => ({
            ...item,
            selected: ids.includes(item.id),
        })),
    }),

    activateSelectionItem: (state: DropDownState, index: number) => ({
        ...state,
        actSelItemIndex: index,
        items: (
            (index === -1)
                ? state.items
                : deactivateAllItems(state.items ?? [])
        ),
    }),

    showAllItems: (state: DropDownState, resetInput: boolean = true) => ({
        ...state,
        filtered: false,
        inputString: (resetInput) ? null : '',
        createFromInputItemId: null,
        items: deactivateAllItems(
            filterItems(
                state.items ?? [],
                (item) => item.id !== state.createFromInputItemId,
            ),
        ),
    }),

    filter: (state: DropDownState, inputString: string) => {
        const lfstr = inputString.toLowerCase();
        let exactMatch = false;
        let items: DropDownMenuItemProps[] = [];
        const { createFromInputItemId } = state;
        const options = {
            includeGroupItems: true,
        };
        let createFromInputItem: DropDownMenuItemProps | null = null;

        forItems<DropDownMenuItemProps>(state.items ?? [], (item: DropDownMenuItemProps) => {
            if (createFromInputItemId && item.id === createFromInputItemId) {
                createFromInputItem = { ...item };
                return;
            }

            exactMatch = exactMatch || item.title.toLowerCase() === lfstr;

            const newItem = {
                ...item,
                matchFilter: item.title.toLowerCase().includes(lfstr),
                active: false,
            };
            if (newItem.type === 'group') {
                newItem.items = [];
            }

            const newItems = pushItem(newItem, items);
            if (newItems === null) {
                return;
            }

            items = newItems;
        }, options);

        const newState = {
            ...state,
            inputString,
            filtered: true,
            visible: true,
            items,
        };

        if (!state.allowCreate) {
            return newState;
        }

        if (exactMatch && newState.createFromInputItemId) {
            newState.createFromInputItemId = null;
        } else if (!exactMatch && !newState.createFromInputItemId) {
            newState.createFromInputItemId = generateItemId(state?.items ?? [], 'item');

            const newItem = createMenuItem({
                id: newState.createFromInputItemId,
                ...renderAddMessage(newState),
                matchFilter: true,
            }, newState);

            newState.items.push(newItem);
        } else if (!exactMatch && newState.createFromInputItemId) {
            const newItem: DropDownMenuItemProps = {
                id: createFromInputItem!.id,
                ...(createFromInputItem ?? {}),
                ...renderAddMessage(newState),
            };

            newState.items.push(newItem);
        }

        return newState;
    },

    setActive: (state: DropDownState, id: string) => ({
        ...state,
        actSelItemIndex: -1,
        items: mapItems(
            state.items ?? [],
            (item) => (
                (item.active !== (item.id === id))
                    ? { ...item, active: !item.active }
                    : item
            ),
            { includeGroupItems: state.allowActiveGroupHeader },
        ),
        activeItem: id,
    }),

    addItem: (state: DropDownState, item: DropDownMenuItemProps) => processSingleSelection({
        ...state,
        items: (
            pushItem(
                createMenuItem(item, state),
                structuredClone(state.items ?? []),
            )!
        ),
    }),

    addGroup: (state: DropDownState, group: DropDownCreateGroupParam) => ({
        ...state,
        items: pushItem(
            createGroup(group, state),
            structuredClone(state.items ?? []),
        ),
    }),

    append: (state: DropDownState, items: DropDownMenuItemProps[]) => processSingleSelection({
        ...state,
        items: (
            createItems(items, state).reduce(
                (prev, item) => pushItem(item, prev),
                structuredClone(state.items ?? []),
            )
        ),
    }),

    toggleEnableItem: (state: DropDownState, id: string) => ({
        ...state,
        items: mapItems(state.items ?? [], (item) => ({
            ...item,
            disabled: (
                (item.id === id)
                    ? (!item.disabled)
                    : item.disabled
            ),
            active: (
                (item.id === id && !item.disabled)
                    ? false
                    : item.active
            ),
        })),
    }),

    removeItem: (state: DropDownState, id: string) => ({
        ...state,
        items: filterItems(state.items ?? [], (item) => item.id !== id),
    }),

    removeAllItems: (state: DropDownState) => ({ ...state, items: [] }),

    setFullScreenHeight: (state: DropDownState, fullScreenHeight: number) => ({
        ...state,
        fullScreenHeight,
    }),
});

export const { actions, reducer } = slice;
