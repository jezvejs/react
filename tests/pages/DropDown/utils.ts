import {
    DropDownMenuItemProps,
    DropDownState,
    MenuItemState,
    MenuItemType,
} from '@jezvejs/react-test';

import {
    filterItems,
    getItemById,
    mapItems,
    toFlatList,
} from '../Menu/utils.ts';

import { defaultDropDownMenuItemProps, defaultDropDownProps } from './defaultProps.ts';
import { InitItemsParams } from './types.ts';

export const getDropDownProps = (
    props: Partial<DropDownState>,
    defaultProps: DropDownState = defaultDropDownProps,
): DropDownState => ({
    ...defaultProps,
    ...props,
    menu: {
        ...(defaultProps.menu ?? {}),
        ...props.menu,
    },
});

export const getDropDownMenuItemProps = (
    props: Partial<MenuItemState>,
    defaultProps: MenuItemState = defaultDropDownMenuItemProps,
): MenuItemState => ({
    ...defaultProps,
    ...props,
});

/** Returns array of items */
export const initItems = (options: InitItemsParams = {}) => {
    const {
        title = 'Item',
        idPrefix = '',
        startFrom = 1,
        count = 10,
        ...props
    } = options;

    const res = [];

    for (let ind = startFrom; ind < startFrom + count; ind += 1) {
        res.push({
            id: `${idPrefix}${ind}`,
            title: `${title} ${ind}`,
            ...props,
        });
    }

    return res;
};

export const groupsItems = () => ([
    getDropDownMenuItemProps({
        id: 'grVisible',
        title: 'Visible',
        type: 'group' as MenuItemType,
        items: [
            getDropDownMenuItemProps({ id: 'groupItem11', title: 'Item 1', group: 'grVisible' }),
            getDropDownMenuItemProps({ id: 'groupItem12', title: 'Item 2', group: 'grVisible' }),
            getDropDownMenuItemProps({
                id: 'groupItem13',
                title: 'Item 3',
                group: 'grVisible',
                selected: true,
            }),
        ],
    }),
    getDropDownMenuItemProps({
        id: 'grHidden',
        title: 'Hidden',
        type: 'group' as MenuItemType,
        items: [
            getDropDownMenuItemProps({ id: 'groupItem24', title: 'Item 4', group: 'grHidden' }),
            getDropDownMenuItemProps({ id: 'groupItem25', title: 'Item 5', group: 'grHidden' }),
            getDropDownMenuItemProps({ id: 'groupItem26', title: 'Item 6', group: 'grHidden' }),
        ],
    }),
]);

export const initGroupItems = () => ([
    { id: 'item1', title: 'Not in group 1' },
    { id: 'item2', title: 'Not in group 2' },
    {
        id: 'group10',
        type: 'group' as MenuItemType,
        title: '1 - 9',
        items: [
            { id: '1', title: 'Item 1', group: 'group10' },
            { id: '2', title: 'Item 2', group: 'group10' },
            { id: '3', title: 'Item 3', group: 'group10' },
            { id: '4', title: 'Item 4', group: 'group10' },
            { id: '5', title: 'Item 5', group: 'group10' },
            { id: '6', title: 'Item 6', group: 'group10' },
            { id: '7', title: 'Item 7', group: 'group10' },
            { id: '8', title: 'Item 8', group: 'group10' },
            { id: '9', title: 'Item 9', group: 'group10' },
        ],
    },
    {
        id: 'group20',
        type: 'group' as MenuItemType,
        title: '10 - 19',
        items: [
            { id: '10', title: 'Item 10', group: 'group20' },
            { id: '11', title: 'Item 11', group: 'group20' },
            { id: '12', title: 'Item 12', group: 'group20' },
            { id: '13', title: 'Item 13', group: 'group20' },
            { id: '14', title: 'Item 14', group: 'group20' },
            { id: '15', title: 'Item 15', group: 'group20' },
            { id: '16', title: 'Item 16', group: 'group20' },
            { id: '17', title: 'Item 17', group: 'group20' },
            { id: '18', title: 'Item 18', group: 'group20' },
            { id: '19', title: 'Item 19', group: 'group20' },
        ],
    },
    {
        id: 'group30',
        type: 'group' as MenuItemType,
        title: '20 - 29',
        items: [
            { id: '20', title: 'Item 20', group: 'group30' },
            { id: '21', title: 'Item 21', group: 'group30' },
            { id: '22', title: 'Item 22', group: 'group30' },
            { id: '23', title: 'Item 23', group: 'group30' },
            { id: '24', title: 'Item 24', group: 'group30' },
            { id: '25', title: 'Item 25', group: 'group30' },
            { id: '26', title: 'Item 26', group: 'group30' },
            { id: '27', title: 'Item 27', group: 'group30' },
            { id: '28', title: 'Item 28', group: 'group30' },
            { id: '29', title: 'Item 29', group: 'group30' },
        ],
    },
]);

/**
 * Returns DropDown component state after toggle select menu item
 * @param {DropDownState} state
 * @param {string} itemId
 * @returns {DropDownState}
 */
export const toggleSelectItem = (state: DropDownState, itemId: string): DropDownState => {
    if (!state.open) {
        return state;
    }

    const { inputString } = state;

    const menuItems = (typeof inputString === 'string' && inputString.length > 0)
        ? state.menu.filteredItems
        : state.menu.items;

    const options = {
        includeGroupItems: state.menu.allowActiveGroupHeader,
        includeChildItems: false,
    };

    const targetItem = getItemById(itemId, menuItems);
    if (!targetItem || targetItem.disabled) {
        return state;
    }

    let value: string | string[] = targetItem.id;
    if (state.multiple) {
        const selectedIds = toFlatList(menuItems, options)
            .filter((item) => item?.selected)
            .map((item) => item.id);

        const expectedSelectedIds = (selectedIds.includes(itemId))
            ? selectedIds.filter((id) => id !== itemId)
            : [...selectedIds, itemId];

        value = expectedSelectedIds.join(',');
    }

    return {
        ...state,
        open: !!state.multiple,
        value,
        textValue: targetItem.title,
        menu: {
            ...state.menu,
            visible: !!state.multiple,
            items: mapItems(menuItems, (item) => {
                const isTargetItem = item?.id === itemId;
                let selected = isTargetItem;
                if (state.multiple) {
                    selected = (isTargetItem) ? !item.selected : item.selected;
                }

                return {
                    ...item,
                    selected,
                    active: (state.multiple) ? isTargetItem : false,
                };
            }, options),
        },
    };
};

/**
 * Returns DropDown component state after filter items by specified string
 * @param {DropDownState} state
 * @param {string} value
 * @returns {DropDownState}
 */
export const filterDropDownItems = (state: DropDownState, value: string): DropDownState => {
    if (!state.open) {
        return state;
    }

    const menuItems = state.menu.items;
    const lfstr = value.toLowerCase();
    let exactMatch = false;

    const options = {
        includeGroupItems: false,
    };

    return {
        ...state,
        open: true,
        inputString: value,
        menu: {
            ...state.menu,
            visible: true,
            filteredItems: filterItems(menuItems, (item) => {
                const lowerTitle = item.title?.toLowerCase() ?? '';
                exactMatch = exactMatch || lowerTitle === lfstr;

                const matchFilter = lowerTitle.includes(lfstr);

                return matchFilter;
            }, options),
        },
    };
};

/** Returns true is item is visible */
export const isVisibleItem = (item: DropDownMenuItemProps, state: DropDownState) => !!(
    (state?.filtered)
        ? (item?.matchFilter && !item.hidden)
        : (item && !item.hidden)
);

/** Returns array of visible items */
export const getVisibleItems = (state: DropDownState | MenuItemState) => (
    toFlatList<MenuItemState>(('items' in state) ? state?.items : [], {
        includeGroupItems: (state as DropDownState).allowActiveGroupHeader,
    }).filter((item: MenuItemState): boolean => (
        (item.type === 'group' && getVisibleItems(item).length > 0)
        || (item.type !== 'group' && isVisibleItem(item, state as DropDownState))
    ))
);
