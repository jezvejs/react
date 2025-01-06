import { asArray, isFunction } from '@jezvejs/types';
import {
    IncludeGroupItemsParam,
    MenuItemCallback,
    MenuItemProps,
    MenuListProps,
    MenuLoopParam,
    MenuProps,
    MenuState,
    MultiMenuState,
    ToFlatListParam,
} from './types.ts';

const checkboxTypes = ['checkbox', 'checkbox-link'];

/**
 * Returns true if specified item is checkbox
 * @param {MenuItemProps} item
 * @returns {boolean}
 */
export const isCheckbox = (item: MenuItemProps | null): boolean => (
    typeof item?.type === 'string'
    && checkboxTypes.includes(item.type.toLowerCase())
);

/**
 * Returns true if specified item support child items
 *
 * @param {<T = MenuItemProps>} item
 * @returns {boolean}
 */
export function isChildItemsAvailable<T extends MenuItemProps = MenuItemProps>(
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
 * @param {<T = MenuItemProps>} item
 * @param {ToFlatListParam} options
 * @returns {boolean}
 */
export function shouldIncludeParentItem<
    T extends MenuItemProps = MenuItemProps,
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
 * @param {<T = MenuItemProps>} item
 * @param {ToFlatListParam} options
 * @returns {boolean}
 */
export function shouldIncludeChildItems<
    T extends MenuItemProps = MenuItemProps,
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
 * @param {<T = MenuItemProps>[]} items
 * @param {ToFlatListParam} options
 * @returns {T[]}
 */
export function toFlatList<T extends MenuItemProps = MenuItemProps>(
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
 * Searches for first menu item for which callback function return true
 *
 * @param {<T = MenuItemProps>[]} items array of items to search in
 * @param {MenuItemCallback<T>} callback
 * @param {ToFlatListParam} options
 */
export function findMenuItem<T extends MenuItemProps = MenuItemProps>(
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
 * @param {<T = MenuItemProps>[]} items array of items to search in
 * @param {MenuItemCallback<T>} callback function to
 * @param {ToFlatListParam} options
 */
export function findLastMenuItem<T extends MenuItemProps = MenuItemProps>(
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
 * @param {<T = MenuItemProps>[]} items array of items to search in
 */
export function getItemById<T extends MenuItemProps = MenuItemProps>(
    id: string | null,
    items: T[],
): T | null {
    if (id === null) {
        return null;
    }

    return findMenuItem<T>(items, (item: T) => item.id?.toString() === id);
}

/**
 * Returns menu group item for specified id
 *
 * @param {string} id item id
 * @param {<T = MenuItemProps>[]} items array of items to search in
 */
export function getGroupById<T extends MenuItemProps = MenuItemProps>(
    id: string | null,
    items: T[],
): T | null {
    if (id === null) {
        return null;
    }

    return findMenuItem<T>(items, (item) => (
        item.id?.toString() === id
        && item.type === 'group'
    ));
}

/**
 * Returns new identifier for menu
 *
 * @param {string} prefix optional string to prepend id with
 */
export const generateMenuId = (prefix: string = ''): string => {
    const id = Date.now() * Math.random() * 10000;
    return `${prefix}${id.toString(36)}`;
};

/**
 * Returns new identifier not existing in the specified list of items
 *
 * @param {<T = MenuItemProps>[]} items array of items to search in
 * @param {string} prefix optional string to prepend id with
 */
export const generateItemId = (items: MenuItemProps[], prefix: string = ''): string => {
    let found: MenuItemProps | null = null;
    let id: string;

    do {
        id = `${prefix}${Date.now()}${Math.random() * 10000}`;
        found = getItemById(id, items);
    } while (found);

    return id;
};

/**
 * Returns active menu item
 *
 * @param {MenuState} state
 * @returns {MenuItemProps}
 */
export const getActiveItem = (state: MenuState): MenuItemProps | null => (
    getItemById(state.activeItem ?? null, state.items ?? [])
);

/**
 * Iterates list of menu items with callback function
 * @param {<T = MenuItemProps>[]} items menu items array
 * @param {MenuItemCallback} callback
 * @param {MenuLoopParam} options
 */
export function forItems<T extends MenuItemProps = MenuItemProps>(
    items: T[],
    callback: MenuItemCallback<T, void>,
    options: MenuLoopParam<T> | null = null,
): T[] {
    if (!isFunction(callback)) {
        throw new Error('Invalid callback parameter');
    }

    const res: T[] = [];
    for (let index = 0; index < items.length; index += 1) {
        const item = items[index];

        if (isChildItemsAvailable(item)) {
            if (shouldIncludeParentItem(item, options)) {
                callback(item, index, items);
            }

            forItems<T>((item.items ?? []) as T[], callback, options);
        } else {
            callback(item, index, items);
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
export function mapItems<T extends MenuItemProps = MenuItemProps>(
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
export function filterItems<T extends MenuItemProps = MenuItemProps>(
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
 * @param {<T = MenuItemProps>[]} items array of menu list items
 * @param {MenuItemCallback<T>|null} filterCallback optional callback function to verify
 * @param {ToFlatListParam} options
 * @returns {T|null}
 */
export function getPreviousItem<T extends MenuItemProps = MenuItemProps>(
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
 * @param {<T = MenuItemProps>[]} items array of menu list items
 * @param {MenuItemCallback<T>|null} filterCallback optional callback function to verify
 * @param {ToFlatListParam} options
 * @returns {T|null}
 */
export function getNextItem<T extends MenuItemProps = MenuItemProps>(
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
 * Returns menu container CSS selector string for specified props
 * @param {MenuState | MenuListProps} props
 * @returns {string | null}
 */
export const getMenuSelector = (props: MenuState | MenuListProps): string | null => (
    props?.menuSelector ?? null
);

/**
 * Returns exact menu container CSS selector string for specified props
 * @param {MenuState | MenuListProps} props
 * @returns {string | null}
 */
export const getExactMenuSelector = (props: MenuState | MenuListProps): string | null => {
    const menuSelector = getMenuSelector(props);
    return (menuSelector) ? `${menuSelector}[data-id="${props.id}"]` : null;
};

/**
 * Returns menu item CSS selector string for specified props
 * @param {MenuState | MenuListProps} props
 * @returns {string | null}
 */
export const getItemSelector = (props: MenuState | MenuListProps): string | null => (
    props?.itemSelector ?? props?.components?.ListItem?.selector ?? null
);

/**
 * Returns exact menu item CSS selector string for specified props
 * @param {MenuState | MenuListProps} props
 * @returns {string | null}
 */
export const getExactItemSelector = (
    props: MenuState | MenuListProps,
    itemId: string,
): string | null => {
    const itemSelector = getItemSelector(props);
    return (itemSelector) ? `${itemSelector}[data-id="${itemId}"]` : null;
};

/**
 * Returns element closest to the specified element and matching selector
 *
 * @param {HTMLElement | null} elem
 * @param {string | null} selector
 * @returns {HTMLElement | null}
 */
export const getClosestItemElement = (
    elem: HTMLElement | null,
    selector: string | null,
): HTMLElement | null => (
    (selector && elem?.closest?.(selector)) as HTMLElement ?? null
);

/**
 * Finds the item element closest to the specified element and
 * returns item id if found element or null otherwise
 *
 * @param {HTMLElement | null} elem
 * @param {MenuState | MenuListProps} props
 * @returns {string | null}
 */
export const getItemIdByElem = (
    elem: HTMLElement | null,
    props: MenuState | MenuListProps,
): string | null => {
    const selector = getItemSelector(props);
    const closestElem = getClosestItemElement(elem, selector) as HTMLElement;
    return closestElem?.dataset?.id ?? null;
};

/**
 * Returns menu element closest to the specified element
 *
 * @param {HTMLElement | null} elem
 * @param {MenuState | MenuListProps} props
 * @returns {HTMLElement | null}
 */
export const getClosestMenuByElem = (
    elem: HTMLElement | null,
    props: MenuState | MenuListProps,
): HTMLElement | null => {
    const selector = getMenuSelector(props);
    return getClosestItemElement(elem, selector) as HTMLElement;
};

/**
 * Finds the menu element closest to the specified element and
 * returns menu id if found element or null otherwise
 *
 * @param {HTMLElement | null} elem
 * @param {MenuState | MenuListProps} props
 * @returns {string | null}
 */
export const getMenuIdByElem = (
    elem: HTMLElement | null,
    props: MenuState | MenuListProps,
): string | null => {
    const closestElem = getClosestMenuByElem(elem, props);
    return closestElem?.dataset?.id ?? null;
};

/**
 * Finds the menu element closest to the specified element and
 * returns menu id if found element or null otherwise
 *
 * @param {HTMLElement | null} elem
 * @param {MenuState | MenuListProps} props
 * @returns {string | null}
 */
export const getMenuParentIdByElem = (
    elem: HTMLElement | null,
    props: MenuState | MenuListProps,
): string | null => {
    const closestElem = getClosestMenuByElem(elem, props);
    return closestElem?.dataset?.parent ?? null;
};

export const isAvailableItem = (item: MenuItemProps, state: MenuState): boolean => !!(
    item
    && !item.hidden
    && !item.disabled
    && item.type !== 'separator'
    && (
        (item.type !== 'group')
        || state.allowActiveGroupHeader
    )
);

export const getItemProps = (item: MenuItemProps, state: MenuListProps): MenuItemProps => {
    const itemDefaultProps = state.getItemDefaultProps?.() ?? {};

    const res: MenuItemProps = {
        ...itemDefaultProps,
        ...item,
        parentId: state.id,
        active: item.id === state.activeItem,
        iconAlign: item.iconAlign || state.iconAlign,
        disabled: item.disabled || state.disabled,
        checkboxSide: item.checkboxSide || state.checkboxSide,
        renderNotSelected: item.renderNotSelected || state.renderNotSelected,
        tabThrough: state.tabThrough,
        type: item.type ?? state.defaultItemType,
        beforeContent: item.beforeContent || state.beforeContent,
        afterContent: item.afterContent || state.afterContent,
        components: state.components,
    };

    return res;
};

export function toggleSelectItem<T extends MenuProps = MenuState>(
    state: T,
    itemId: string,
): T {
    return {
        ...state,
        items: mapItems(
            state.items ?? [],
            (item) => {
                if (item.id?.toString() === itemId) {
                    if (!item.selectable || item.disabled) {
                        return item;
                    }

                    return {
                        ...item,
                        selected: (state.multiple) ? !item.selected : true,
                    };
                }

                return (state.multiple)
                    ? item
                    : { ...item, selected: false };
            },
            { includeGroupItems: state.allowActiveGroupHeader },
        ),
    };
}

/**
 * Reducer function. Closes or opens menu by specified id
 * @param {T} state
 * @param {string} itemId
 * @param {boolean} open
 * @returns {T}
 */
export function setMenuOpen<
    S extends MenuState = MenuState,
    T extends MultiMenuState<S> = MultiMenuState<S>,
>(
    state: T,
    itemId: string,
    open: boolean,
): T {
    return {
        ...state,
        menu: {
            ...(state.menu ?? {}),
            [itemId]: {
                ...(state.menu?.[itemId] ?? {}),
                open,
            },
        },
    };
}

/**
 * Reducer function. Opens menu by specified id
 * @param {S} state
 * @param {string} itemId
 * @returns {T}
 */
export function openMenu<
    S extends MenuState = MenuState,
    T extends MultiMenuState<S> = MultiMenuState<S>,
>(
    state: T,
    itemId: string,
): T {
    return setMenuOpen(state, itemId, true);
}

/**
 * Reducer function. Closes menu by specified id
 * @param {T} state
 * @param {string} itemId
 * @returns {T}
 */
export function closeMenu<
    S extends MenuState = MenuState,
    T extends MultiMenuState<S> = MultiMenuState<S>,
>(
    state: T,
    itemId: string,
): T {
    return setMenuOpen(state, itemId, false);
}

/**
 * Reducer function. Activates menu item by specified id.
 * Deactivates all items if null is specified as itemId.
 * @param {T} state
 * @param {string|null} itemId
 * @returns {T}
 */
export function setActiveItemById<T extends MenuProps = MenuState>(
    state: T,
    itemId: string | null,
): T {
    return (
        (state.activeItem === itemId)
            ? state
            : {
                ...state,
                items: mapItems(
                    state.items ?? [],
                    (item) => (
                        (item.active !== (item.id === itemId))
                            ? { ...item, active: !item.active }
                            : item
                    ),
                    { includeGroupItems: state.allowActiveGroupHeader },
                ),
                activeItem: itemId,
            }
    );
}

/**
 * Appends specified item to the end of list or group and returns resulting list
 * @param {MenuItemProps} item
 * @param {MenuItemProps[]} items
 * @returns {MenuItemProps[] | null}
 */
export const pushItem = (
    item: MenuItemProps,
    items: MenuItemProps[],
): MenuItemProps[] => {
    const res = items ?? [];
    if (!item) {
        return res;
    }

    if (item.group) {
        const group = getGroupById(item.group, res);
        if (group) {
            group.items?.push(item);
        }
    } else {
        res.push(item);
    }

    return res;
};

/** Returns item object for specified props after applying default values */
export const createMenuItem = <T extends MenuItemProps, S extends MenuState>(
    props: T,
    state: S,
): T => {
    if (!props) {
        throw new Error('Invalid item object');
    }
    if (!state) {
        throw new Error('Invalid state object');
    }

    const defaultItemType = state.defaultItemType ?? ((state.multiple) ? 'checkbox' : 'button');
    const itemDefaultProps = state.getItemDefaultProps?.() ?? {};

    const res: T = {
        ...itemDefaultProps,
        ...props,
        active: false,
        id: props.id?.toString() ?? generateItemId(state?.items ?? [], 'item'),
        parentId: state.id,
        type: props.type ?? defaultItemType,
    };

    const { type } = res;
    const checkboxAvail = !!res.selectable && state.multiple;
    if (
        !checkboxAvail
        && (type === 'checkbox' || type === 'checkbox-link')
    ) {
        res.type = (type === 'checkbox') ? 'button' : 'link';
    }

    return res;
};

/**
 * Create menu items from specified array
 * @param {MenuItemProps | MenuItemProps[]} items
 * @param {MenuState} state
 */
export const createItems = (items: MenuItemProps | MenuItemProps[], state: MenuState) => (
    mapItems(
        asArray(items),
        (item) => createMenuItem(item, state),
        { includeGroupItems: state.allowActiveGroupHeader },
    )
);

/**
 * Returns initial state object for specified props
 *
 * @param {MenuProps} props
 * @param {MenuProps} defProps
 * @returns {MenuState}
 */
export const getInitialState = (
    props: Partial<MenuProps>,
    defProps: MenuProps,
): MenuState => {
    const res: MenuState = {
        ...(defProps ?? {}),
        ...props,
        ignoreTouch: false,
        inputDevice: null,
        components: {
            ...(defProps?.components ?? {}),
            ...props.components,
        },
    };

    res.items = createItems(props.items ?? [], res);

    return res;
};
