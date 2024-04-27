import { asArray, isFunction } from '@jezvejs/types';

const checkboxTypes = ['checkbox', 'checkbox-link'];

/**
 * Returns true if type of specified item
 * @param {Object} state
 * @returns {boolean}
 */
export const isCheckbox = (item) => (
    typeof item?.type === 'string'
    && checkboxTypes.includes(item.type.toLowerCase())
);

/**
 * Converts multilevel menu list to flat array of items and returns result
 *
 * @param {Array} items source multilevel array of menu items
 * @returns {Array}
 */
export const toFlatList = (items, options = {}) => {
    const res = [];
    for (let index = 0; index < items.length; index += 1) {
        const item = items[index];
        const disabled = options?.disabled || item.disabled;

        if (item.type === 'group') {
            if (options.includeGroupItems) {
                res.push({ ...item, disabled });
            }

            res.push(
                ...toFlatList(
                    item.items,
                    {
                        disabled,
                        includeGroupItems: options.includeGroupItems,
                    },
                ),
            );
        } else {
            res.push({ ...item, disabled });
        }
    }

    return res;
};

/**
 * Searches for first menu item for which callback function return true
 *
 * @param {Array} items array of items to search in
 * @param {Function} callback function to
 */
export const findMenuItem = (items, callback) => {
    if (!Array.isArray(items)) {
        throw new Error('Invalid items parameter');
    }
    if (!isFunction(callback)) {
        throw new Error('Invalid callback parameter');
    }

    for (let index = 0; index < items.length; index += 1) {
        let item = items[index];
        if (callback(item)) {
            return item;
        }

        if (item.type === 'group') {
            item = findMenuItem(item.items, callback);
            if (item) {
                return item;
            }
        }
    }

    return null;
};

/**
 * Searches for last menu item for which callback function return true
 *
 * @param {Array} items array of items to search in
 * @param {Function} callback function to
 * @param {Object} options
 */
export const findLastMenuItem = (items, callback, options = {}) => {
    if (!Array.isArray(items)) {
        throw new Error('Invalid items parameter');
    }
    if (!isFunction(callback)) {
        throw new Error('Invalid callback parameter');
    }

    const flatList = toFlatList(items, options);
    for (let index = flatList.length - 1; index >= 0; index -= 1) {
        const item = flatList[index];
        if (callback(item)) {
            return item;
        }
    }

    return null;
};

/**
 * Returns menu item for specified id
 *
 * @param {String} id item id
 * @param {Array} items array of items to search in
 */
export const getItemById = (id, items) => {
    const strId = id?.toString() ?? null;
    if (strId === null) {
        return null;
    }

    return findMenuItem(items, (item) => item.id?.toString() === strId);
};

/**
 * Returns menu group item for specified id
 *
 * @param {String} id item id
 * @param {Array} items array of items to search in
 */
export const getGroupById = (id, items) => {
    const strId = id?.toString() ?? null;
    if (strId === null) {
        return null;
    }

    return findMenuItem(items, (item) => (
        item.id?.toString() === strId
        && item.type === 'group'
    ));
};

/**
 * Returns new identifier not existing in the specified list of items
 *
 * @param {Array} items array of items to search in
 * @param {String} prefix optional string to prepend id with
 */
export const generateItemId = (items, prefix = '') => {
    let found;

    do {
        const id = `${prefix}${Date.now()}${Math.random() * 10000}`;
        found = getItemById(id, items);
        if (!found) {
            return id;
        }
    } while (found);

    return null;
};

/**
 * Returns active menu item
 *
 * @param {Array} items array of items to search in
 */
export const getActiveItem = (state) => (
    getItemById(state.activeItem, state.items)
);

/**
 * Iterates list of menu items with callback function
 * @param {Array} items menu items array
 * @param {Function} callback
 * @param {Object} options
 */
export const forItems = (items, callback, options = {}) => {
    if (!isFunction(callback)) {
        throw new Error('Invalid callback parameter');
    }

    const res = [];
    for (let index = 0; index < items.length; index += 1) {
        const item = items[index];

        if (item.type === 'group') {
            if (options.includeGroupItems) {
                callback(item, index, items);
            }

            forItems(item.items, callback);
        } else {
            callback(item, index, items);
        }
    }

    return res;
};

/**
 * Returns list of menu items transformed with callback function
 * @param {Array} items menu items array
 * @param {Function} callback
 * @param {Object} options
 * @returns {Array}
 */
export const mapItems = (items, callback, options = {}) => {
    if (!isFunction(callback)) {
        throw new Error('Invalid callback parameter');
    }

    const res = [];
    for (let index = 0; index < items.length; index += 1) {
        const item = {
            ...items[index],
            group: options.group?.id,
        };

        if (item.type === 'group') {
            const group = (options.includeGroupItems)
                ? callback(item, index, items)
                : item;

            res.push({
                ...group,
                items: mapItems(
                    item.items,
                    callback,
                    { ...options, group },
                ),
            });
        } else {
            res.push(callback(item, index, items));
        }
    }

    return res;
};

/**
 * Returns list of menu items filtered by callback function
 * @param {Array} items menu items array
 * @param {Function} callback
 * @param {Object} options
 * @returns {Array}
 */
export const filterItems = (items, callback, options = {}) => {
    if (!isFunction(callback)) {
        throw new Error('Invalid callback parameter');
    }

    const res = [];
    for (let index = 0; index < items.length; index += 1) {
        const item = items[index];

        if (item.type === 'group') {
            if (
                !options.includeGroupItems
                || callback(item, index, items)
            ) {
                const children = filterItems(item.items, callback, options);
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
};

/**
 * Returns closest item before specified that satisfies filter
 *
 * @param {String} id identifier of item to start from
 * @param {Array} items array of menu list items
 * @param {Function|null} filterCallback optional callback function to verify
 * @param {Object} options
 * @returns
 */
export const getPreviousItem = (id, items, filterCallback = null, options = {}) => {
    const strId = id?.toString() ?? null;
    if (strId === null) {
        return null;
    }

    const flatList = toFlatList(items, options);
    let startItem = null;
    const callback = isFunction(filterCallback) ? filterCallback : null;

    for (let index = flatList.length - 1; index >= 0; index -= 1) {
        const item = flatList[index];
        if (item.id?.toString() === strId) {
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
};

/**
 * Returns closest item after specified that satisfies filter
 *
 * @param {String} id identifier of item to start from
 * @param {Array} items array of menu list items
 * @param {Function|null} filterCallback optional callback function to filter returned item
 * @param {Object} options
 * @returns
 */
export const getNextItem = (id, items, filterCallback = null, options = {}) => {
    const strId = id?.toString() ?? null;
    if (strId === null) {
        return null;
    }

    const flatList = toFlatList(items, options);
    let startItem = null;
    const callback = isFunction(filterCallback) ? filterCallback : null;

    for (let index = 0; index < flatList.length; index += 1) {
        const item = flatList[index];
        if (item.id?.toString() === strId) {
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
};

export const getClosestItemElement = (elem, props) => (
    elem?.closest?.(props?.itemSelector ?? props?.components?.ListItem?.selector) ?? null
);

export const isAvailableItem = (item, state) => (
    item
    && !item.hidden
    && !item.disabled
    && item.type !== 'separator'
    && (
        item.type !== 'group'
        || state.allowActiveGroupHeader
    )
);

export const getItemProps = (item, state) => {
    const { ListItem } = state.components;

    const res = {
        ...ListItem.defaultProps,
        ...item,
        iconAlign: item.iconAlign || state.iconAlign,
        disabled: item.disabled || state.disabled,
        checkboxSide: item.checkboxSide || state.checkboxSide,
        renderNotSelected: item.renderNotSelected || state.renderNotSelected,
        activeItem: state.activeItem,
        tabThrough: state.tabThrough,
        key: item.id,
        type: item.type ?? state.defaultItemType,
        components: state.components,
        beforeContent: item.beforeContent || state.beforeContent,
        afterContent: item.afterContent || state.afterContent,
        onItemClick: state.onItemClick,
        onMouseEnter: state.onMouseEnter,
        onMouseLeave: state.onMouseLeave,
    };

    if (item.type === 'group') {
        res.getItemProps = state.getItemProps;
    }

    return res;
};

export const toggleSelectItem = (itemId) => (state) => ({
    ...state,
    items: mapItems(
        state.items,
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
});

/**
 * Appends specified item to the end of list or group and returns resulting list
 * @param {Object} item
 * @param {Array} items
 * @returns {Array}
 */
export const pushItem = (item, items) => {
    if (!item) {
        return null;
    }

    const res = items;
    if (item.group) {
        const group = getGroupById(item.group, res);
        if (group) {
            group.items.push(item);
        }
    } else {
        res.push(item);
    }

    return res;
};

/** Returns item object for specified props after applying default values */
export const createMenuItem = (props, state) => {
    if (!props) {
        throw new Error('Invalid item object');
    }
    if (!state) {
        throw new Error('Invalid state object');
    }

    const { ListItem } = state.components;
    const defaultItemType = state.defaultItemType ?? ((state.multiple) ? 'checkbox' : 'button');

    const res = {
        ...ListItem.defaultProps,
        ...props,
        active: false,
        id: props.id?.toString() ?? generateItemId(state?.items ?? [], 'item'),
        type: props.type ?? defaultItemType,
    };

    const { type } = res;
    const checkboxAvail = res.selectable && state.multiple;
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
 * @param {Object|Object[]} items
 * @param {Object} state
 */
export const createItems = (items, state) => (
    mapItems(
        asArray(items),
        (item) => createMenuItem(item, state),
        { includeGroupItems: state.allowActiveGroupHeader },
    )
);

/**
 * Returns initial state object for specified props
 *
 * @param {Object} props
 * @param {Object} defaultProps
 * @returns {Object}
 */
export const getInitialState = (props, defaultProps) => {
    const res = {
        ...(defaultProps ?? {}),
        ...props,
        activeItem: null,
        ignoreTouch: false,
        components: {
            ...(defaultProps?.components ?? {}),
            ...props.components,
        },
    };

    res.items = createItems(props.items, res);

    return res;
};
