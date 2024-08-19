import { getOffsetSum } from '@jezvejs/dom';
import { isFunction, asArray } from '@jezvejs/types';
import { DragMaster } from '../../utils/DragnDrop/DragMaster.ts';
import {
    AnimationBox,
    SortableNodePosition,
    SortableState,
    SortableTreeFilterCallback,
    SortableTreeItem,
} from './types.ts';

/**
 * Returns new array with only distinct(unique) values from specified array
 *
 * @param {Array} arr
 * @returns {Array}
 */
export const distinctValues = <T = string | null>(arr: T | T[]): T[] => (
    asArray(arr).reduce((res: T[], item: T) => (
        (res.includes(item))
            ? res
            : [...res, item]
    ), [])
);

/**
 * Converts tree to flat array of items and returns result
 *
 * @param {SortableTreeItem[]} items
 * @returns {SortableTreeItem[]}
 */
export const toFlatList = (items: SortableTreeItem[]): SortableTreeItem[] => {
    const res: SortableTreeItem[] = [];

    for (let index = 0; index < items.length; index += 1) {
        const item = items[index] ?? {};

        if (Array.isArray(item?.items)) {
            res.push(
                { ...item },
                ...toFlatList(item.items),
            );
        } else {
            res.push({ ...item });
        }
    }

    return res;
};

/**
 * Searches for first tree item for which callback function return true
 *
 * @param {SortableTreeItem[]} items array of items to search in
 * @param {Function} callback function to
 */
export const findTreeItem = (
    items: SortableTreeItem[],
    callback: SortableTreeFilterCallback,
): SortableTreeItem | null => {
    if (!Array.isArray(items)) {
        throw new Error('Invalid items parameter');
    }
    if (!isFunction(callback)) {
        throw new Error('Invalid callback parameter');
    }

    for (let index = 0; index < items.length; index += 1) {
        const item = items[index];
        if (callback(item, index, items)) {
            return item;
        }

        if (Array.isArray(item?.items)) {
            const childRes = findTreeItem(item.items, callback);
            if (childRes) {
                return childRes;
            }
        }
    }

    return null;
};

/**
 * Returns tree item for specified id
 *
 * @param {string} id item id
 * @param {SortableTreeItem[]} items array of items to search in
 */
export const getTreeItemById = (id: string | null, items: SortableTreeItem[]) => {
    const strId = id?.toString() ?? null;
    if (strId === null) {
        return null;
    }

    return findTreeItem(items, (item: SortableTreeItem) => item?.id?.toString() === strId);
};

/**
 * Returns true if tree item has specified child item
 *
 * @param {string} id item id
 * @param {string} childId child item id
 * @param {SortableTreeItem[]} items array of items to search in
 */
export const isTreeContains = (
    id: string | null,
    childId: string | null,
    items: SortableTreeItem[],
): boolean => {
    if (id === null || childId === null) {
        return false;
    }

    const item = getTreeItemById(id, items);
    if (id === childId) {
        return !!item;
    }

    return Array.isArray(item?.items) && !!getTreeItemById(childId, item.items);
};

/**
 * Searches for first tree item for which callback function return true
 *
 * @param {Array} items array of items to search in
 * @param {Function} callback function to
 */
export const findTreeItemIndex = (
    items: SortableTreeItem[],
    callback: (item: SortableTreeItem) => boolean,
) => {
    if (!Array.isArray(items)) {
        throw new Error('Invalid items parameter');
    }
    if (!isFunction(callback)) {
        throw new Error('Invalid callback parameter');
    }

    for (let index = 0; index < items.length; index += 1) {
        const item = items[index];
        if (callback(item)) {
            return index;
        }

        if (Array.isArray(item?.items)) {
            const childRes = findTreeItemIndex(item.items, callback);
            if (childRes !== -1) {
                return childRes;
            }
        }
    }

    return -1;
};

/**
 * Returns index of tree item inside it parent subtree
 *
 * @param {Array} items array of items to search in
 * @param {string} id item id
 */
export const findTreeItemIndexById = (items, id) => {
    const strId = id?.toString();
    return findTreeItemIndex(items, (item) => item?.id?.toString() === strId);
};

/**
 * Searches for first tree item for which callback function return true
 *
 * @param {Array} items array of items to search in
 * @param {Function} callback function to
 */
export const findTreeItemParent = (
    items: SortableTreeItem[],
    callback: (item: SortableTreeItem) => boolean,
): SortableTreeItem | true | null => {
    if (!Array.isArray(items)) {
        throw new Error('Invalid items parameter');
    }
    if (!isFunction(callback)) {
        throw new Error('Invalid callback parameter');
    }

    for (let index = 0; index < items.length; index += 1) {
        const item = items[index];
        if (callback(item)) {
            return true;
        }

        if (Array.isArray(item?.items)) {
            const childRes = findTreeItemParent(item.items, callback);
            if (childRes) {
                return (childRes === true) ? item : childRes;
            }
        }
    }

    return null;
};

/**
 * Returns parent of tree item
 *
 * @param {Array} items array of items to search in
 * @param {string} id item id
 */
export const findTreeItemParentById = (
    items: SortableTreeItem[],
    id: string | null,
): SortableTreeItem | null => {
    const strId = id?.toString() ?? null;
    if (strId === null) {
        return null;
    }

    const res = findTreeItemParent(items, (item) => item?.id?.toString() === strId);
    // findTreeItemParent() return true if item is found on first level
    return (res === true) ? null : res;
};

/**
 * Returns list of tree items transformed with callback function
 * @param {Array} items
 * @param {Function} callback
 * @returns {Array}
 */
export const mapTreeItems = (
    items: SortableTreeItem[],
    callback: (
        item: SortableTreeItem,
        index: number,
        array: SortableTreeItem[],
    ) => SortableTreeItem,
): SortableTreeItem[] => {
    if (!isFunction(callback)) {
        throw new Error('Invalid callback parameter');
    }

    const res: SortableTreeItem[] = [];
    for (let index = 0; index < items.length; index += 1) {
        const item = {
            ...items[index],
        };
        const cbRes = callback(item, index, items);

        if (Array.isArray(item?.items) && item.items === cbRes?.items) {
            res.push({
                ...cbRes,
                items: mapTreeItems(
                    item.items,
                    callback,
                ),
            });
        } else {
            res.push(cbRes);
        }
    }

    return res;
};

/**
 * Returns list of tree items filtered by callback function
 * @param {Array} items
 * @param {Function} callback
 * @returns {Array}
 */
export const filterTreeItems = (
    items: SortableTreeItem[],
    callback: SortableTreeFilterCallback,
): SortableTreeItem[] => {
    if (!isFunction(callback)) {
        throw new Error('Invalid callback parameter');
    }

    const res: SortableTreeItem[] = [];
    for (let index = 0; index < items.length; index += 1) {
        const item = items[index] as SortableTreeItem;
        const cbRes = callback(item, index, items);
        if (!cbRes) {
            continue;
        }

        if (Array.isArray(item?.items)) {
            const children = filterTreeItems(item.items, callback);
            res.push({
                ...item,
                items: children,
            });
        } else {
            res.push({ ...item });
        }
    }

    return res;
};

/**
 * Returns list items for specified drag zone
 * @param {string} dragZoneId
 * @param {object} state
 * @returns {object}
 */
export const getDragZone = (dragZoneId, state: SortableState) => (
    state[dragZoneId]
);

/**
 * Returns list items for specified drag zone
 * @param {string} dragZoneId
 * @param {object} state
 * @returns {Array}
 */
export const getDragZoneItems = (dragZoneId, state) => (
    state[dragZoneId]?.items ?? []
);

/**
 * Returns list next items for specified drag zone
 * @param {string} dragZoneId
 * @param {object} state
 * @returns {Array}
 */
export const getNextZoneItems = (dragZoneId, state) => (
    state[dragZoneId]?.next ?? getDragZoneItems(dragZoneId, state)
);

/**
 * Returns list of cached item positions for specified drag zone
 * @param {string} zoneId
 * @param {object} state
 * @returns {Array}
 */
export const getPositionsCache = (zoneId, state) => (
    state.boxes[zoneId] ?? []
);

/**
 * Returns list of target item positions for specified drag zone
 * @param {string} zoneId
 * @param {object} state
 * @returns {Array}
 */
export const getTargetPositions = (zoneId, state) => (
    state.targetBoxes?.[zoneId] ?? []
);

/**
 * Returns cached position for specified item at drag zone
 * @param {string} id
 * @param {string} zoneIds
 * @param {object} state
 * @returns {object}
 */
export const getPositionCacheById = (
    id: string,
    zoneIds: string | string[],
    state: SortableState,
): AnimationBox | null => {
    const ids = asArray(zoneIds);

    for (let index = 0; index < ids.length; index += 1) {
        const zoneId = ids[index];
        const item = getTreeItemById(id, getPositionsCache(zoneId, state));
        if (item) {
            return { ...item };
        }
    }

    return null;
};

/**
 * Returns target position for specified item at drag zone
 * @param {string} id
 * @param {string} zoneIds
 * @param {object} state
 * @returns {AnimationBox|null}
 */
export const getTargetPositionById = (
    id: string,
    zoneIds: string | string[],
    state: SortableState,
): AnimationBox | null => {
    const ids = asArray(zoneIds);

    for (let index = 0; index < ids.length; index += 1) {
        const zoneId = ids[index];
        const item = getTreeItemById(id, getTargetPositions(zoneId, state));
        if (item) {
            return { ...item };
        }
    }

    return null;
};

/**
 * Moves tree item from one position to another
 * If 'swapWithPlaceholder' option is enabled then swaps source and target items
 *
 * @param {object} state
 * @param {object} options
 * @returns {object}
 */
export const moveTreeItem = (state: SortableState, options): SortableState => {
    const {
        source,
        target,
        swapWithPlaceholder = false,
    } = options;

    const targetId = target?.id ?? null;

    if (source.id === target.id) {
        return state;
    }

    const dragZoneItems = getDragZoneItems(target.zoneId, state);

    // Prevent to move parent subtree into own child
    if (isTreeContains(source.id, target.id, dragZoneItems)) {
        return state;
    }

    // Prevent to move drag zone to parent subtree
    if (
        targetId === null
        && target.parentId === target.zoneId
        && dragZoneItems.length > 0
        && target.parentId === state.sortPosition?.parentId
        && target.zoneId === state.sortPosition?.zoneId
    ) {
        return state;
    }

    const insertToEnd = true;
    const indexAtNewZone = (insertToEnd) ? dragZoneItems.length : 0;

    let index = target.index ?? null;
    if (index === null) {
        index = (targetId !== null)
            ? findTreeItemIndexById(dragZoneItems, target.id)
            : indexAtNewZone;
    }

    if (
        index === -1
        || (
            index === state.sortPosition?.index
            && target.parentId === state.sortPosition?.parentId
            && target.zoneId === state.sortPosition?.zoneId
        )
    ) {
        return state;
    }

    const newState = {
        ...state,
        targetId,
        sortPosition: {
            id: targetId,
            index,
            parentId: target.parentId,
            zoneId: target.zoneId,
        },
        swapWithPlaceholder,
    };

    // Remove item from source list
    const sourceItems = getDragZoneItems(source.zoneId, state);
    let destItems = getDragZoneItems(target.zoneId, state);

    const movingItem = getTreeItemById(source.id, sourceItems);
    const targetItem = getTreeItemById(target.id, destItems);
    const sourceIndex = findTreeItemIndexById(sourceItems, source.id);

    if (!movingItem) {
        return state;
    }

    if (!targetItem && (!target.parentId || !target.zoneId)) {
        return state;
    }

    if (!swapWithPlaceholder || targetItem) {
        newState[source.zoneId] = {
            ...newState[source.zoneId],
            items: (swapWithPlaceholder)
                ? sourceItems.toSpliced(sourceIndex, 1, targetItem)
                : filterTreeItems(sourceItems, (item) => item?.id !== source.id),
        };
    }

    // Insert item to destination list
    destItems = getDragZoneItems(target.zoneId, newState);
    const deleteLength = (swapWithPlaceholder) ? 1 : 0;

    newState[target.zoneId] = {
        ...newState[target.zoneId],
        items: (target.parentId === target.zoneId)
            ? destItems.toSpliced(index, deleteLength, movingItem)
            : (
                mapTreeItems(destItems, (item) => (
                    (item.id !== target.parentId)
                        ? item
                        : {
                            ...item,
                            items: asArray(item.items)
                                .toSpliced(index, deleteLength, movingItem),
                        }
                ))
            ),
    };

    return newState;
};

/**
 * Returns matrix transform string for specified array
 * @param {Array} transform
 * @returns {string}
 */
export const formatMatrixTransform = (transform) => (
    `matrix(${asArray(transform).join(', ')})`
);

/**
 * Returns offset matrix transform string for specified offset
 * @param {*} param0
 * @returns
 */
export const formatOffsetMatrix = ({ x, y }) => (
    formatMatrixTransform([1, 0, 0, 1, x, y])
);

/**
 * Cleans up the state of sortable item and returns result
 * @param {object} item
 * @returns {object}
 */
export const clearTransform = (item) => ({
    ...item,
    initialOffset: null,
    initialTransform: null,
    offset: null,
    offsetTransform: null,
});

/**
 * Applies callback function to each item inside specified zone and returns new state object
 *
 * @param {object} state
 * @param {string} zoneId
 * @param {Function} callback
 * @returns {object}
 */
export const mapZoneItems = (state, zoneId, callback) => ({
    ...state,
    [zoneId]: {
        ...state[zoneId],
        items: mapTreeItems(
            getDragZoneItems(zoneId, state),
            callback,
        ),
    },
});

/**
 * Applies callback function to each item of the next state inside specified zone
 * and returns new state object
 *
 * @param {object} state
 * @param {string} zoneId
 * @param {Function} callback
 * @returns {object}
 */
export const mapNextZoneItems = (state, zoneId, callback) => ({
    ...state,
    [zoneId]: {
        ...state[zoneId],
        next: mapTreeItems(
            getNextZoneItems(zoneId, state),
            callback,
        ),
    },
});

/**
 * Applies callback function to each item inside multiple drag zones and returns new state object
 *
 * @param {object} state
 * @param {string|string[]} zoneIds
 * @param {Function} callback
 * @returns {object}
 */
export const mapZones = (state, zoneIds, callback) => {
    const ids: string[] = [];
    let newState = state;

    asArray(zoneIds).forEach((zoneId) => {
        const id = zoneId ?? null;
        if (id !== null && !ids.includes(id)) {
            newState = mapZoneItems(newState, id, callback);
            ids.push(id);
        }
    });

    return newState;
};

/**
 * Applies callback function to each item of the next state of multiple drag zones
 * and returns new state object
 *
 * @param {object} state
 * @param {string|string[]} zoneIds
 * @param {Function} callback
 * @returns {object}
 */
export const mapNextZones = (state, zoneIds, callback) => {
    const ids: string[] = [];
    let newState = state;

    asArray(zoneIds).forEach((zoneId: string) => {
        const id = zoneId ?? null;
        if (id !== null && !ids.includes(id)) {
            newState = mapNextZoneItems(newState, id, callback);
            ids.push(id);
        }
    });

    return newState;
};

/**
 * Returns dimensions of element
 * @param {HTMLElement} elem
 * @returns {AnimationBox|null}
 */
export const getAnimationBox = (elem: HTMLElement): AnimationBox | null => {
    if (!elem) {
        return null;
    }
    const { style } = elem;

    const prevWidth = style.width;
    const prevHeight = style.height;

    style.width = '';
    style.height = '';

    const { top, left } = getOffsetSum(elem);
    const width = elem.offsetWidth;
    const height = elem.offsetHeight;
    const res = {
        id: elem.dataset?.id,
        top,
        left,
        x: left,
        y: top,
        width,
        height,
        bottom: top + height,
        right: left + width,
    };

    style.width = prevWidth;
    style.height = prevHeight;

    return res;
};

/**
 * Returns true if specified item is placeholder
 * @param {object} props
 * @param {object} state
 * @returns {boolean}
 */
export const isPlaceholder = (props, state) => (
    props.placeholder
    || (
        state.dragging
        && props.id === state.itemId
    )
);

/**
 * Returns array of ids of drag zones affected by current drag
 * @param {object} state
 * @returns {Array}
 */
export const getPossibleZoneIds = (state) => distinctValues([
    state.origSortPos?.zoneId,
    state.sourcePosition?.zoneId,
    state.prevPosition?.zoneId,
    state.sortPosition?.zoneId,
]);

/**
 * Returns position of source item
 * @param {object} state
 * @returns {object|null}
 */
export const getSourcePosition = (state) => {
    if (!state) {
        return null;
    }

    const positions = [
        state.origSortPos,
        state.sourcePosition,
        state.prevPosition,
        state.sortPosition,
    ];

    for (let index = 0; index < positions.length; index += 1) {
        const position = positions[index];
        if (!position) {
            continue;
        }

        const sourceZone = getDragZoneItems(position?.zoneId, state);
        const item = getTreeItemById(state?.itemId, sourceZone);
        if (item) {
            return { ...position };
        }
    }

    return null;
};

/**
 * Returns source drag zone for specified state
 * @param {SortableState} state
 * @returns {object|null}
 */
export const getSourceDragZone = (state: SortableState) => {
    const dragMaster = DragMaster.getInstance();
    const position = getSourcePosition(state);

    return dragMaster?.findDragZoneById?.(position?.zoneId) ?? null;
};

/**
 * Returns parent and closest siblings elements of specified element
 * @param {Element} elem
 * @returns {object}
 */
export const getElementPosition = (elem: Element): SortableNodePosition => ({
    parent: elem?.parentElement,
    prev: elem?.previousElementSibling,
    next: elem?.nextElementSibling,
});

/**
 * Inserts element to the specified position
 * Position object is returned by getElementPosition() function
 * @param {Element} elem
 * @param {object} pos
 */
export const insertAtElementPosition = (elem: Element, pos: SortableNodePosition) => {
    if (pos.prev && pos.prev.parentNode) {
        pos.prev.after(elem);
    } else if (pos.next && pos.next.parentNode) {
        pos.next.before(elem);
    } else {
        pos.parent?.append(elem);
    }
};

/**
 * Toggles measure mode on specified element
 * @param {Element} elem
 * @param {boolean} value
 */
export const toggleMeasureMode = (elem, value) => {
    const { style } = elem ?? {};
    if (style) {
        style.pointerEvents = (value) ? 'none' : '';
    }
};
