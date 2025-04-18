import { DropDownState, MenuItemState, MenuItemType } from '@jezvejs/react-test';

import { getItemById, mapItems, toFlatList } from '../Menu/utils.ts';

import { defaultDropDownMenuItemProps, defaultDropDownProps } from './defaultProps.ts';
import { InitItemsParams } from './types.ts';

export const getDropDownProps = (
    props: Partial<DropDownState>,
    defaultProps: DropDownState = defaultDropDownProps,
): DropDownState => ({
    ...defaultProps,
    ...props,
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

    const menuItems = state.menu.items;

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
