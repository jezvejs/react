import {
    MenuItemState,
    MenuState,
} from '@jezvejs/react-test';
import { asArray, isFunction } from '@jezvejs/types';
import { defaultCollapsibleGroupMenuItemProps, defaultMenuItemProps } from './defaultProps.ts';
import { CollapsibleGroupsMenuItemState } from './types.ts';

/**
 * shouldIncludeParentItem() function params
 */
export interface IncludeGroupItemsParam {
    includeGroupItems?: boolean;
    includeChildItems?: boolean;
}

/**
 * toFlatList() function params
 */
export interface ToFlatListParam extends IncludeGroupItemsParam {
    parentId?: string;
    disabled?: boolean;
}

export interface MenuItemCallback<T extends MenuItemState = MenuItemState, R = boolean> {
    (item: T, index?: number, arr?: T[]): R;
}

/**
 * forItems() function params
 */
export interface MenuLoopParam<
    T extends MenuItemState = MenuItemState,
> extends IncludeGroupItemsParam {
    group?: T | null;
}

const checkboxTypes = ['checkbox', 'checkbox-link'];

/**
 * Returns true if specified item is checkbox
 * @param {MenuItemState} item
 * @returns {boolean}
 */
export const isCheckbox = (item: MenuItemState | null): boolean => (
    typeof item?.type === 'string'
    && checkboxTypes.includes(item.type.toLowerCase())
);

/**
 * Returns true if specified item support child items
 *
 * @param {<T = MenuItemState>} item
 * @returns {boolean}
 */
export function isChildItemsAvailable<T extends MenuItemState = MenuItemState>(
    item: T,
): boolean {
    return (
        item.type === 'group'
        || item.type === 'parent'
    );
}

/**
 * Returns true if specified item itself should be included to the tree data processing
 *
 * @param {<T = MenuItemState>} item
 * @param {ToFlatListParam} options
 * @returns {boolean}
 */
export function shouldIncludeParentItem<
    T extends MenuItemState = MenuItemState,
    OPT extends IncludeGroupItemsParam = IncludeGroupItemsParam,
>(
    item: T,
    options?: OPT | null,
): boolean {
    return !!(
        (item.type === 'group' && options?.includeGroupItems)
        || (item.type === 'parent')
    );
}

/**
 * Returns true if children of specified item should be included to the tree data processing
 *
 * @param {<T = MenuItemState>} item
 * @param {ToFlatListParam} options
 * @returns {boolean}
 */
export function shouldIncludeChildItems<
    T extends MenuItemState = MenuItemState,
    OPT extends IncludeGroupItemsParam = IncludeGroupItemsParam,
>(
    item: T,
    options?: OPT | null,
): boolean {
    return !!(
        (item.type === 'group')
        || (item.type === 'parent' && !!options?.includeChildItems)
    );
}

/**
 * Converts multilevel menu list to flat array of items and returns result
 *
 * @param {<T = MenuItemState>[]} items
 * @param {ToFlatListParam} options
 * @returns {T[]}
 */
export function toFlatList<T extends MenuItemState = MenuItemState>(
    items: T[],
    options?: ToFlatListParam,
): T[] {
    const res: T[] = [];
    const parentId = options?.parentId;

    for (let index = 0; index < items.length; index += 1) {
        const item = items[index];
        const disabled = options?.disabled || item.disabled;

        if (isChildItemsAvailable(item)) {
            if (shouldIncludeParentItem(item, options)) {
                res.push({ ...item, parentId, disabled });
            }

            if (shouldIncludeChildItems(item, options)) {
                res.push(
                    ...toFlatList<T>(
                        asArray(item.items),
                        {
                            ...options,
                            parentId: item.id,
                            disabled,
                            includeGroupItems: options?.includeGroupItems,
                        },
                    ),
                );
            }
        } else {
            res.push({ ...item, parentId, disabled });
        }
    }

    return res;
}

/**
 * Returns list of menu items transformed with callback function
 * @param {T[]} items menu items array
 * @param {MenuItemCallback<T, T>} callback
 * @param {MenuLoopParam<T>} options
 * @returns {T[]}
 */
export function mapItems<T extends MenuItemState = MenuItemState>(
    items: T[],
    callback: MenuItemCallback<T, T>,
    options: MenuLoopParam<T> | null = null,
): T[] {
    if (!isFunction(callback)) {
        throw new Error('Invalid callback parameter');
    }

    const res: T[] = [];

    for (let index = 0; index < items.length; index += 1) {
        const item: T = {
            ...items[index],
            group: options?.group?.id,
        };

        if (isChildItemsAvailable(item)) {
            const group = shouldIncludeParentItem(item, options)
                ? callback(item, index, items)
                : item;

            res.push({
                ...group,
                items: mapItems<T>(
                    (item.items ?? []) as T[],
                    callback,
                    {
                        ...(options ?? {}),
                        group,
                    },
                ),
            });
        } else {
            res.push(callback(item, index, items));
        }
    }

    return res;
}

/**
 * Returns list of menu items filtered by callback function
 * @param {T[]} items menu items array
 * @param {MenuItemCallback<T>} callback
 * @param {MenuLoopParam<T>} options
 * @returns {T[]}
 */
export function filterItems<T extends MenuItemState = MenuItemState>(
    items: T[],
    callback: MenuItemCallback<T>,
    options: MenuLoopParam<T> | null = null,
): T[] {
    if (!isFunction(callback)) {
        throw new Error('Invalid callback parameter');
    }

    const res: T[] = [];

    for (let index = 0; index < items.length; index += 1) {
        const item = items[index];

        if (isChildItemsAvailable(item)) {
            const includeParentItem = shouldIncludeParentItem(item, options);
            if (
                !includeParentItem
                || callback(item, index, items)
            ) {
                const children = filterItems<T>((item.items ?? []) as T[], callback, options);
                if (children.length > 0) {
                    res.push({
                        ...item,
                        items: children,
                    });
                }
            }
        } else if (callback(item, index, items)) {
            res.push({ ...item });
        }
    }

    return res;
}

/**
 * Returns closest item before specified that satisfies filter
 *
 * @param {string|null} id identifier of item to start from
 * @param {<T = MenuItemState>[]} items array of menu list items
 * @param {MenuItemCallback<T>|null} filterCallback optional callback function to verify
 * @param {ToFlatListParam} options
 * @returns {T|null}
 */
export function getPreviousItem<T extends MenuItemState = MenuItemState>(
    id: string | null,
    items: T[],
    filterCallback: MenuItemCallback<T> | null = null,
    options: ToFlatListParam = {},
): T | null {
    if (id === null) {
        return null;
    }

    const flatList = toFlatList(items, options);
    let startItem: T | null = null;
    const callback = (typeof filterCallback === 'function') ? filterCallback : null;

    for (let index = flatList.length - 1; index >= 0; index -= 1) {
        const item = flatList[index];
        if (item.id?.toString() === id) {
            startItem = item;
            continue;
        }

        if (startItem) {
            if (callback === null || callback(item)) {
                return item;
            }
        }
    }

    return null;
}

/**
 * Returns closest item after specified that satisfies filter
 *
 * @param {string|null} id identifier of item to start from
 * @param {<T = MenuItemState>[]} items array of menu list items
 * @param {MenuItemCallback<T>|null} filterCallback optional callback function to verify
 * @param {ToFlatListParam} options
 * @returns {T|null}
 */
export function getNextItem<T extends MenuItemState = MenuItemState>(
    id: string | null,
    items: T[],
    filterCallback: MenuItemCallback<T> | null = null,
    options: ToFlatListParam = {},
): T | null {
    if (id === null) {
        return null;
    }

    const flatList = toFlatList<T>(items, options);
    let startItem: T | null = null;
    const callback = (typeof filterCallback === 'function') ? filterCallback : null;

    for (let index = 0; index < flatList.length; index += 1) {
        const item = flatList[index];
        if (item.id?.toString() === id) {
            startItem = item;
            continue;
        }

        if (startItem) {
            if (callback === null || callback(item)) {
                return item;
            }
        }
    }

    return null;
}

/**
 * Searches for first menu item for which callback function return true
 *
 * @param {<T = MenuItemState>[]} items array of items to search in
 * @param {MenuItemCallback<T>} callback
 * @param {ToFlatListParam} options
 */
export function findMenuItem<T extends MenuItemState = MenuItemState>(
    items: T[],
    callback: MenuItemCallback<T>,
    options?: ToFlatListParam,
): T | null {
    if (!Array.isArray(items)) {
        throw new Error('Invalid items parameter');
    }
    if (!isFunction(callback)) {
        throw new Error('Invalid callback parameter');
    }

    const parentId = options?.parentId;

    for (let index = 0; index < items.length; index += 1) {
        let item: T | null = items[index];
        if (callback(item)) {
            return { ...item, parentId };
        }

        if (isChildItemsAvailable(item) && Array.isArray(item.items)) {
            item = findMenuItem<T>(
                (item.items ?? []) as T[],
                callback,
                { ...options, parentId: item.id },
            );
            if (item) {
                return { ...item, parentId };
            }
        }
    }

    return null;
}

/**
 * Searches for last menu item for which callback function return true
 *
 * @param {<T = MenuItemState>[]} items array of items to search in
 * @param {MenuItemCallback<T>} callback function to
 * @param {ToFlatListParam} options
 */
export function findLastMenuItem<T extends MenuItemState = MenuItemState>(
    items: T[],
    callback: MenuItemCallback<T>,
    options?: ToFlatListParam,
): T | null {
    if (!Array.isArray(items)) {
        throw new Error('Invalid items parameter');
    }
    if (!isFunction(callback)) {
        throw new Error('Invalid callback parameter');
    }

    const flatList = toFlatList<T>(items, options);
    for (let index = flatList.length - 1; index >= 0; index -= 1) {
        const item = flatList[index];
        if (callback(item)) {
            return item;
        }
    }

    return null;
}

/**
 * Returns menu item for specified id
 *
 * @param {string} id item id
 * @param {<T = MenuItemState>[]} items array of items to search in
 */
export function getItemById<T extends MenuItemState = MenuItemState>(
    id: string | null,
    items?: T[],
): T | null {
    if (id === null) {
        return null;
    }

    return findMenuItem<T>(items ?? [], (item: T) => item.id?.toString() === id);
}

export const isAvailableItem = (item: MenuItemState, state: MenuState): boolean => !!(
    item
    && item.visible
    && !item.disabled
    && item.type !== 'separator'
    && (
        (item.type !== 'group')
        || state.allowActiveGroupHeader
    )
);

/**
 * Returns active menu item
 *
 * @param {MenuState} state
 * @returns {MenuItemState}
 */
export const getActiveItem = (state: MenuState): MenuItemState | null => (
    findMenuItem(
        state.items,
        (item) => isAvailableItem(item, state) && item.active,
        {
            includeGroupItems: state.allowActiveGroupHeader,
            includeChildItems: false,
        },
    )
);

export const getMenuItemProps = (
    props: Partial<MenuItemState>,
    defaultProps: MenuItemState = defaultMenuItemProps,
): MenuItemState => ({
    ...defaultProps,
    ...props,
});

export const getCollapsibleGroupMenuItemProps = (
    props: Partial<CollapsibleGroupsMenuItemState>,
    defaultProps: CollapsibleGroupsMenuItemState = defaultCollapsibleGroupMenuItemProps,
): CollapsibleGroupsMenuItemState => ({
    ...defaultProps,
    ...props,
});
