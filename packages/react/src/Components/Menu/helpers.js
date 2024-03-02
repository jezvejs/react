import { isFunction } from '@jezvejs/types';

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

export const getClosestItemElement = (elem, props) => (
    elem?.closest?.(props?.itemSelector ?? props?.components?.ListItem?.selector) ?? null
);