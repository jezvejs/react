import { getOffsetSum } from '@jezvejs/dom';
import { isFunction, asArray } from '@jezvejs/types';
import { DragMaster } from '../../utils/DragnDrop/DragMaster.ts';
import {
    AnimationBox,
    BaseTreeItem,
    MoveTreeItemParam,
    SortableItemPosition,
    SortableNodePosition,
    SortableState,
    SortableTreeItem,
    SortableZone,
    TreeFilterCallback,
} from './types.ts';
import { DragZone } from '../../utils/DragnDrop/types.ts';
import { Point } from '../../utils/types.ts';
import { px } from '../../utils/common.ts';

/**
 * Returns new array with only distinct(unique) values from specified array
 *
 * @param {Array} arr
 * @returns {Array}
 */
export const distinctValues = <T = (string | null)>(arr: T | T[]): T[] => (
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
export function findTreeItem<
    Item extends BaseTreeItem = BaseTreeItem
>(
    items: Item[],
    callback: TreeFilterCallback<Item>,
): Item | null {
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
            const childRes = findTreeItem<Item>(item.items as Item[], callback);
            if (childRes) {
                return childRes;
            }
        }
    }

    return null;
}

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
 * @param {Function} callback
 */
export const findTreeItemIndex = (
    items: SortableTreeItem[],
    callback: TreeFilterCallback<SortableTreeItem>,
): number => {
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
 * @param {SortableTreeItem[]} items array of items to search in
 * @param {string} id item id
 */
export const findTreeItemIndexById = (items: SortableTreeItem[], id: string | null) => {
    if (id === null) {
        return -1;
    }

    return findTreeItemIndex(items, (item) => item?.id?.toString() === id);
};

/**
 * Searches for first tree item for which callback function return true
 *
 * @param {Array} items array of items to search in
 * @param {Function} callback function to
 */
export const findTreeItemParent = (
    items: SortableTreeItem[],
    callback: TreeFilterCallback<SortableTreeItem>,
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
export const mapTreeItems = <Item extends BaseTreeItem = SortableTreeItem>(
    items: Item[],
    callback: TreeFilterCallback<Item, Item>,
): Item[] => {
    if (!isFunction(callback)) {
        throw new Error('Invalid callback parameter');
    }

    const res: Item[] = [];
    for (let index = 0; index < items.length; index += 1) {
        const item = {
            ...items[index],
        };
        const cbRes = callback(item, index, items);

        if (Array.isArray(item?.items) && item.items === cbRes?.items) {
            res.push({
                ...cbRes,
                items: mapTreeItems<Item>(
                    (item.items ?? []) as Item[],
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
    callback: TreeFilterCallback<SortableTreeItem>,
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
 * @param {SortableState} state
 * @returns {SortableZone|null}
 */
export const getDragZone = (
    dragZoneId: string | null,
    state: SortableState,
): SortableZone | null => (
    (dragZoneId === null) ? null : (state.zones[dragZoneId] ?? null)
);

/**
 * Returns list items for specified drag zone
 * @param {string | null} dragZoneId
 * @param {SortableState} state
 * @returns {SortableTreeItem[]}
 */
export function getDragZoneItems<Item extends BaseTreeItem = SortableTreeItem>(
    dragZoneId: string | null,
    state: SortableState,
): Item[] {
    if (dragZoneId === null || !state?.zones) {
        return [];
    }

    const res = state.zones[dragZoneId]?.items ?? [];
    return (res as object[]) as Item[];
}

/**
 * Returns list next items for specified drag zone
 * @param {string} dragZoneId
 * @param {SortableState} state
 * @returns {Array}
 */
export function getNextZoneItems<Item extends BaseTreeItem = SortableTreeItem>(
    dragZoneId: string | null,
    state: SortableState,
): Item[] {
    const res = (
        (dragZoneId === null)
            ? []
            : (state.zones[dragZoneId]?.next ?? getDragZoneItems(dragZoneId, state))
    );

    return (res as object[]) as Item[];
}

/**
 * Returns list of cached item positions for specified drag zone
 * @param {string} zoneId
 * @param {SortableState} state
 * @returns {Array}
 */
export const getPositionsCache = (zoneId: string, state: SortableState) => (
    state.boxes[zoneId] ?? []
);

/**
 * Returns list of target item positions for specified drag zone
 * @param {string} zoneId
 * @param {object} state
 * @returns {Array}
 */
export const getTargetPositions = (zoneId: string, state: SortableState) => (
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
 * @param {string | string[]} zoneIds
 * @param {SortableState} state
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
 * @param {SortableState} state
 * @param {MoveTreeItemParam} options
 * @returns {SortableState}
 */
export const moveTreeItem = (state: SortableState, options: MoveTreeItemParam): SortableState => {
    const {
        source,
        target,
        swapWithPlaceholder = false,
    } = options;

    const sourceId = source.id ?? null;
    const targetId = target?.id ?? null;

    if (
        (sourceId === null)
        || (source.zoneId === null)
        || (target.zoneId === null)
        || (sourceId === targetId)
    ) {
        return state;
    }

    const dragZoneItems = getDragZoneItems(target.zoneId, state);

    // Prevent to move parent subtree into own child
    if (isTreeContains(sourceId, targetId, dragZoneItems)) {
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
            ? findTreeItemIndexById(dragZoneItems, targetId)
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
        zones: {
            ...state.zones,
        },
    };

    // Remove item from source list
    const sourceItems = getDragZoneItems(source.zoneId, state);
    let destItems = getDragZoneItems(target.zoneId, state);

    const movingItem = getTreeItemById(sourceId, sourceItems);
    const targetItem = getTreeItemById(targetId, destItems);
    const sourceIndex = findTreeItemIndexById(sourceItems, sourceId);

    if (!movingItem) {
        return state;
    }

    if (!targetItem && (!target.parentId || !target.zoneId)) {
        return state;
    }

    if (!swapWithPlaceholder || targetItem) {
        newState.zones[source.zoneId] = {
            ...newState.zones[source.zoneId],
            items: (swapWithPlaceholder)
                ? sourceItems.toSpliced(sourceIndex, 1, targetItem!)
                : filterTreeItems(sourceItems, (item) => item?.id !== sourceId),
        };
    }

    // Insert item to destination list
    destItems = getDragZoneItems(target.zoneId, newState);
    const deleteLength = (swapWithPlaceholder) ? 1 : 0;

    newState.zones[target.zoneId] = {
        ...newState.zones[target.zoneId],
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
export const formatMatrixTransform = (
    transform: number | number[] | string | string[],
): string => (
    `matrix(${asArray(transform).join(', ')})`
);

/**
 * Returns offset matrix transform string for specified offset
 * @param {*} param0
 * @returns
 */
export const formatOffsetMatrix = ({ x, y }: Point) => (
    `translate3d(${px(x)}, ${px(y)}, 0)`
);

/**
 * Cleans up the state of sortable item and returns result
 * @param {object} item
 * @returns {object}
 */
export const clearTransform = (item: SortableTreeItem): SortableTreeItem => ({
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
export function mapZoneItems<Item extends BaseTreeItem = SortableTreeItem>(
    state: SortableState,
    zoneId: string,
    callback: TreeFilterCallback<Item, Item>,
): SortableState {
    return {
        ...state,
        zones: {
            ...state.zones,
            [zoneId]: {
                ...state.zones[zoneId],
                items: mapTreeItems<Item>(
                    getDragZoneItems(zoneId, state),
                    callback,
                ),
            },
        },
    };
}

/**
 * Applies callback function to each item of the next state inside specified zone
 * and returns new state object
 *
 * @param {object} state
 * @param {string} zoneId
 * @param {Function} callback
 * @returns {object}
 */
export function mapNextZoneItems<Item extends BaseTreeItem = SortableTreeItem>(
    state: SortableState,
    zoneId: string,
    callback: TreeFilterCallback<Item, Item>,
): SortableState {
    return {
        ...state,
        zones: {
            ...state.zones,
            [zoneId]: {
                ...state.zones[zoneId],
                next: mapTreeItems<Item>(
                    getNextZoneItems(zoneId, state),
                    callback,
                ),
            },
        },
    };
}

/**
 * Applies callback function to each item inside multiple drag zones and returns new state object
 *
 * @param {object} state
 * @param {string|string[]} zoneIds
 * @param {Function} callback
 * @returns {object}
 */
export function mapZones<Item extends BaseTreeItem = SortableTreeItem>(
    state: SortableState,
    zoneIds: string | string[],
    callback: TreeFilterCallback<Item, Item>,
): SortableState {
    const ids: string[] = [];
    let newState = {
        ...state,
        zones: {
            ...state.zones,
        },
    };

    asArray(zoneIds).forEach((zoneId: string) => {
        const id = zoneId ?? null;
        if (id !== null && !ids.includes(id)) {
            newState = mapZoneItems<Item>(newState, id, callback);
            ids.push(id);
        }
    });

    return newState;
}

/**
 * Applies callback function to each item of the next state of multiple drag zones
 * and returns new state object
 *
 * @param {object} state
 * @param {string|string[]} zoneIds
 * @param {Function} callback
 * @returns {object}
 */
export function mapNextZones<Item extends BaseTreeItem = SortableTreeItem>(
    state: SortableState,
    zoneIds: string | string[],
    callback: TreeFilterCallback<Item, Item>,
): SortableState {
    const ids: string[] = [];
    let newState = {
        ...state,
        zones: {
            ...state.zones,
        },
    };

    asArray(zoneIds).forEach((zoneId: string) => {
        const id = zoneId ?? null;
        if (id !== null && !ids.includes(id)) {
            newState = mapNextZoneItems<Item>(newState, id, callback);
            ids.push(id);
        }
    });

    return newState;
}

/**
 * Returns dimensions of element
 * @param {HTMLElement} elem
 * @returns {AnimationBox|null}
 */
export const getAnimationBox = (elem: HTMLElement): AnimationBox => {
    const { style } = elem;

    const prevWidth = style.width;
    const prevHeight = style.height;

    style.width = '';
    style.height = '';

    const { top, left } = getOffsetSum(elem);
    const width = elem.offsetWidth;
    const height = elem.offsetHeight;
    const res = {
        id: elem.dataset?.id ?? '',
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
 * @param {SortableTreeItem} props
 * @param {SortableState} state
 * @returns {boolean}
 */
export const isPlaceholder = (props: SortableTreeItem, state: SortableState): boolean => (
    props.placeholder
    || (
        state.dragging
        && props.id === state.itemId
    )
);

/**
 * Returns array of ids of drag zones affected by current drag
 * @param {SortableState} state
 * @returns {string[]}
 */
export const getPossibleZoneIds = (state: SortableState): string[] => (
    distinctValues([
        state.origSortPos?.zoneId ?? null,
        state.sourcePosition?.zoneId ?? null,
        state.prevPosition?.zoneId ?? null,
        state.sortPosition?.zoneId ?? null,
    ]).filter((item) => !!item) as string[]
);

/**
 * Returns position of source item
 * @param {object} state
 * @returns {object|null}
 */
export const getSourcePosition = (state: SortableState): SortableItemPosition | null => {
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
export const getSourceDragZone = (state: SortableState): DragZone | null => {
    const dragMaster = DragMaster.getInstance();
    const position = getSourcePosition(state);
    const zoneId = position?.zoneId ?? null;
    if (zoneId === null) {
        return null;
    }

    return dragMaster?.findDragZoneById?.(zoneId) ?? null;
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
export const toggleMeasureMode = (elem: HTMLElement, value: boolean) => {
    const { style } = elem ?? {};
    if (style) {
        style.pointerEvents = (value) ? 'none' : '';
    }
};
