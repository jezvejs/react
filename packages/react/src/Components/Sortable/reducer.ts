import { createSlice } from '../../utils/createSlice.ts';
import {
    clearTransform,
    findTreeItemIndex,
    getDragZoneItems,
    getNextZoneItems,
    getPossibleZoneIds,
    getSourcePosition,
    mapNextZones,
    mapTreeItems,
    mapZones,
    moveTreeItem,
    setTransform,
} from './helpers.ts';
import {
    AnimationBox,
    InitDragParams,
    OnSortStartParam,
    SortableItemPosition,
    SortableSaveItemMoveParam,
    SortableState,
    SortableTreeItem,
    TransformZonesParams,
    UpdatePositionsParams,
} from './types.ts';

// Reducers
const slice = createSlice({
    saveItemMove: (prev: SortableState, move: SortableSaveItemMoveParam) => {
        const sourceZoneId = prev.sortPosition?.zoneId ?? null;
        const targetZoneId = move.sortPosition?.zoneId ?? null;
        if (sourceZoneId === null || targetZoneId === null) {
            return prev;
        }

        let newState = {
            ...prev,
            zones: {
                ...prev.zones,
            },
        };

        const prevSourceZone = prev.zones[sourceZoneId] ?? {};

        newState.zones[sourceZoneId] = {
            ...prevSourceZone,
            items: [
                ...(prevSourceZone.next ?? prevSourceZone.items),
            ],
        };

        if (targetZoneId !== sourceZoneId) {
            const prevTargetZone = prev.zones[targetZoneId] ?? {};
            newState.zones[targetZoneId] = {
                ...prevTargetZone,
                items: [
                    ...(prevTargetZone.next ?? prevTargetZone.items),
                ],
            };
        }

        newState = moveTreeItem(newState, {
            source: {
                id: newState.origSortPos?.id,
                index: newState.sortPosition?.index ?? -1,
                parentId: newState.sortPosition?.parentId ?? null,
                zoneId: newState.sortPosition?.zoneId ?? null,
            },
            target: {
                id: move.sortPosition.id,
                index: move.sortPosition.index ?? -1,
                parentId: move.sortPosition.parentId ?? null,
                zoneId: move.sortPosition.zoneId ?? null,
            },
            swapWithPlaceholder: move.swapWithPlaceholder,
        });

        const res: SortableState = {
            ...prev,
            prevPosition: {
                ...prev.sortPosition!,
            },
            sortPosition: {
                ...move.sortPosition,
            },
            zones: {
                ...(prev.zones ?? {}),
                [sourceZoneId]: {
                    ...(prev.zones[sourceZoneId] ?? {}),
                    next: [...(newState.zones[sourceZoneId].items ?? [])],
                },
            },
        };

        if (targetZoneId !== sourceZoneId) {
            const prevTargetZone = prev.zones[targetZoneId] ?? {};
            res.zones[targetZoneId] = {
                ...prevTargetZone,
                next: [...(newState.zones[targetZoneId].items ?? [])],
            };
        }

        return res;
    },

    moveItem: (prev: SortableState) => {
        const source = getSourcePosition(prev);
        if (!source) {
            return prev;
        }

        const sourceZoneId = source.zoneId;
        const targetZoneId = prev.sortPosition?.zoneId ?? null;
        if (!sourceZoneId || !targetZoneId) {
            return prev;
        }

        const prevSourceZone = prev.zones[sourceZoneId] ?? {};

        let newState: SortableState = {
            ...prev,
            zones: {
                ...prev.zones,
                [sourceZoneId]: {
                    ...prevSourceZone,
                    items: [
                        ...(prevSourceZone.next ?? prevSourceZone.items),
                    ],
                },
            },
        };

        if (targetZoneId !== sourceZoneId) {
            const prevTargetZone = prev.zones[targetZoneId] ?? {};
            newState = {
                ...newState,
                zones: {
                    ...newState.zones,
                    [targetZoneId]: {
                        ...prevTargetZone,
                        items: [
                            ...(prevTargetZone.next ?? prevTargetZone.items),
                        ],
                    },
                },
                sourcePosition: {
                    ...newState.sortPosition,
                } as SortableItemPosition,
            };
        }

        return newState;
    },

    clearItemsTransform: (prev: SortableState) => {
        const zoneIds = getPossibleZoneIds(prev);
        const newState = mapZones(prev, zoneIds, clearTransform);
        return mapNextZones(newState, zoneIds, clearTransform);
    },

    startSort: (prev: SortableState, { itemId, parentId, zoneId }: OnSortStartParam) => {
        const dragZoneItems = getDragZoneItems(zoneId, prev);
        const index = findTreeItemIndex(dragZoneItems, (item) => item?.id === itemId);
        const sortPosition: SortableItemPosition = {
            id: itemId,
            parentId,
            index,
            zoneId,
        };

        return {
            ...prev,
            boxes: {},
            targetBoxes: {},
            itemId,
            /** Position of moving item where drag started */
            origSortPos: { ...sortPosition },
            /** Position where moving item is currently rendered */
            sourcePosition: { ...sortPosition },
            /** Previous position of moving item */
            prevPosition: { ...sortPosition },
            /** Current target position of source item */
            sortPosition,
        };
    },

    endSort: (prev: SortableState) => ({
        ...prev,
        boxes: {},
        targetBoxes: {},
        origSortPos: null,
        sourcePosition: null,
        prevPosition: null,
        sortPosition: null,
        itemId: null,
        targetId: null,
    }),

    cancelSort: (prev: SortableState) => {
        let newState = prev;

        if (prev.origSortPos && prev.sortPosition) {
            newState = moveTreeItem(newState, {
                source: {
                    id: prev.origSortPos.id,
                    index: prev.sortPosition.index,
                    parentId: prev.sortPosition.parentId,
                    zoneId: prev.sortPosition.zoneId,
                },
                target: {
                    index: prev.origSortPos.index,
                    parentId: prev.origSortPos.parentId,
                    zoneId: prev.origSortPos.zoneId,
                },
            });
        }

        return {
            ...newState,
            boxes: {},
            targetBoxes: {},
            origSortPos: null,
            sourcePosition: null,
            prevPosition: null,
            sortPosition: null,
            itemId: null,
            targetId: null,
        };
    },

    transformZones: (
        prev: SortableState,
        { elems, swapWithPlaceholder }: TransformZonesParams,
    ) => (
        mapZones(
            prev,
            getPossibleZoneIds(prev),
            (item) => setTransform({ item, elems, swapWithPlaceholder }),
        )
    ),

    resetBoxes: (prev: SortableState) => ({
        ...prev,
        boxes: {},
    }),

    initDrag: (
        prev: SortableState,
        {
            downX,
            downY,
            avatarState,
            offset,
            width,
        }: InitDragParams,
    ) => ({
        ...prev,
        avatarState: (avatarState) ? structuredClone(avatarState) : prev.avatarState,
        width,
        origLeft: prev.left,
        origTop: prev.top,
        shiftX: downX - offset.left,
        shiftY: downY - offset.top,
    }),

    updatePositions: (prev: SortableState, { name, newBoxes, zones }: UpdatePositionsParams) => {
        const newState: SortableState = {
            ...prev,
            [name]: {
                ...(prev[name] ?? {}),
            },
        };

        const findItemBox = (itemId: string | null | undefined): AnimationBox | null => {
            if (itemId === null || typeof itemId === 'undefined') {
                return null;
            }

            const zoneId = zones.find((id: string) => newBoxes[id][itemId]);
            const box = (zoneId) ? (newBoxes[zoneId]?.[itemId]) : null;
            return box ?? null;
        };

        const getItemBox = (item: AnimationBox | SortableTreeItem): AnimationBox => ({
            ...(findItemBox(item.id) ?? {}),
            id: item.id,
            ...(
                ((item.items?.length ?? 0) > 0)
                    ? { items: (item.items ?? []).map(getItemBox) }
                    : {}
            ),
        });

        const useNextItems = (name !== 'boxes');
        const mapZoneBoxes = (zoneId: string, state: SortableState): AnimationBox[] => (
            mapTreeItems<AnimationBox>(
                (useNextItems)
                    ? getNextZoneItems(zoneId, state)
                    : getDragZoneItems(zoneId, state),
                getItemBox,
            )
        );

        Object.keys(newBoxes).forEach((id: string) => {
            newState[name][id] = mapZoneBoxes(id, newState);
        });

        return newState;
    },
});

export const { actions, reducer } = slice;
