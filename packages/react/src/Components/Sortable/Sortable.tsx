import classNames from 'classnames';
import {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useMemo,
} from 'react';

import { useDragnDrop } from '../../utils/DragnDrop/index.ts';

import { SortableContainer } from './components/Container/SortableContainer.tsx';
import { SortableTableContainer } from './components/Container/SortableTableContainer.tsx';
import { SortableItemWrapper } from './components/ItemWrapper/SortableItemWrapper.tsx';
import { SortableDragAvatar } from './SortableDragAvatar.tsx';

import {
    clearTransform,
    findTreeItemIndex,
    formatOffsetMatrix,
    getDragZoneItems,
    getNextZoneItems,
    getPossibleZoneIds,
    getSourcePosition,
    getTreeItemById,
    mapNextZones,
    mapZones,
    moveTreeItem,
} from './helpers.ts';
import {
    SortableAvatarProps,
    SortableItemPosition,
    SortableItemWrapperProps,
    SortableProps,
    SortableSaveItemMoveParam,
    SortableState,
    SortableTreeItem,
} from './types.ts';
import { useSortableDragZone } from './useSortableDragZone.tsx';
import { useSortableDropTarget } from './useSortableDropTarget.tsx';

export {
    SortableItemWrapper,
};

export type SortableRef = HTMLElement | null;

export const Sortable = forwardRef<SortableRef, SortableProps>((p, ref) => {
    const defaultProps = {
        animatedClass: 'animated',
        transitionTimeout: 300,
        dragClass: 'drag',
        table: false,
        wrapInTbody: false,
    };

    const props = {
        ...defaultProps,
        ...p,
    };

    const {
        className,
        placeholderClass,
        animatedClass,
        onSort,
        components,
        ...commonProps
    } = props;
    if ('items' in commonProps) {
        delete commonProps.items;
    }

    const Avatar = components?.Avatar ?? components?.ListItem;

    const { getState, setState } = useDragnDrop<SortableState>();

    const getItems = (dragZoneId: string | null) => {
        const state = getState();
        return getDragZoneItems(dragZoneId, state);
    };

    const findItemById = (itemId: string | null, dragZoneId: string | null) => {
        const items = getItems(dragZoneId);
        return getTreeItemById(itemId, items);
    };

    const isShowAvatar = () => {
        const state = getState();
        return (
            !!state.dragging
            && (state.itemId ?? null) !== null
            && (props.id === state.origSortPos?.zoneId)
        );
    };

    const getDraggingItem = (): SortableTreeItem | null => {
        if (!isShowAvatar()) {
            return null;
        }

        const state = getState();
        if (state.itemId === null) {
            return null;
        }

        const sortPositionZone = state.sortPosition?.zoneId ?? null;

        const items = getItems(sortPositionZone);
        const itemsRes = getTreeItemById(state.itemId, items);
        if (itemsRes) {
            return itemsRes;
        }

        const next = getNextZoneItems(sortPositionZone, state);
        return getTreeItemById(state.itemId, next);
    };

    const saveItemMove = (move: SortableSaveItemMoveParam) => {
        setState((prev: SortableState) => {
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
        });
    };

    const moveItem = () => {
        setState((prev: SortableState) => {
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
        });
    };

    const clearItemsTransform = () => {
        setState((prev: SortableState) => {
            const zoneIds = getPossibleZoneIds(prev);
            const newState = mapZones(prev, zoneIds, clearTransform);
            return mapNextZones(newState, zoneIds, clearTransform);
        });
    };

    const {
        dragZoneRef,
        avatarRef,
    } = useSortableDragZone({
        ...commonProps,
        placeholderClass,
        animatedClass,

        onSortStart({ itemId, parentId, zoneId }) {
            if (!dragZoneRef.current) {
                return;
            }

            setState((prev: SortableState) => {
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
            });
        },
    });

    const {
        dropTargetRef,
    } = useSortableDropTarget({
        ...commonProps,
        components,

        onSortMove({
            targetId,
            targetIndex,
            targetParentId,
            targetZoneId,
            swapWithPlaceholder,
            animateElems,
        }) {
            const state = getState();
            const sourceId = state.origSortPos?.id ?? null;
            const sourceZoneId = state.sortPosition?.zoneId;

            // Skip the same item
            if (
                targetId === sourceId
                && targetParentId === state.sortPosition?.parentId
                && targetZoneId === sourceZoneId
            ) {
                return;
            }

            if (targetId === targetParentId && !props.tree) {
                return;
            }

            // Skip move item to parent container without target item
            // if current target item is already at this container
            if (
                targetId === null
                && state.targetId !== null
                && targetParentId === state.sortPosition?.parentId
                && targetZoneId === sourceZoneId
            ) {
                return;
            }

            // Skip handling same target as the current one
            const targetItem = findItemById(targetId, targetZoneId);
            if (targetId !== null && !targetItem) {
                return;
            }

            const setTransform = (item: SortableItemWrapperProps) => {
                const found = animateElems?.find((i) => i.id === item.id);
                if (!found) {
                    return item;
                }

                const initialOffset = item.initialOffset ?? ({ x: 0, y: 0 });
                const initialTransform = formatOffsetMatrix(initialOffset);

                const { rect, targetRect, parent } = found;
                if (!rect || !targetRect) {
                    return item;
                }

                const offset = {
                    x: ((targetRect.left ?? 0) - (rect.left ?? 0)) + initialOffset.x,
                    y: ((targetRect.top ?? 0) - (rect.top ?? 0)) + initialOffset.y,
                };
                const offsetTransform = formatOffsetMatrix(offset);

                const res = {
                    ...item,
                    animationInProgress: true,
                    initialOffset,
                    initialTransform,
                    offset,
                    offsetTransform,
                    rect,
                    targetRect,
                    parent,
                };

                if (swapWithPlaceholder) {
                    res.animated = false;
                }

                return res;
            };

            if (
                swapWithPlaceholder
                && state.sourcePosition
                && (state.sourcePosition.zoneId === targetZoneId)
                && (state.sourcePosition.zoneId !== sourceZoneId)
            ) {
                moveItem();
            }

            saveItemMove({
                sortPosition: {
                    id: targetId,
                    index: targetIndex,
                    parentId: targetParentId,
                    zoneId: targetZoneId,
                },
                swapWithPlaceholder,
            });

            setState((prev: SortableState) => (
                mapZones(
                    prev,
                    getPossibleZoneIds(prev),
                    setTransform,
                )
            ));

            if (swapWithPlaceholder) {
                clearItemsTransform();
                moveItem();
                setState((prev: SortableState) => ({
                    ...prev,
                    boxes: {},
                }));
            }
        },

        onSortEnd() {
            const state = getState();
            const source = getSourcePosition(state);
            if (!source || !state.origSortPos?.id || !state.sortPosition) {
                return;
            }

            const sourceZoneId = source.zoneId ?? null;
            const sourceParentId = source.parentId ?? null;

            const targetZoneId = state.sortPosition.zoneId ?? null;
            const targetParentId = state.sortPosition.parentId ?? null;

            const sortParams = {
                id: state.origSortPos.id,
                sourceIndex: source?.index,
                sourceZoneId,
                sourceParentId,
                targetId: state.sortPosition.id,
                targetIndex: state.sortPosition.index,
                targetZoneId,
                targetParentId,
            };

            clearItemsTransform();
            moveItem();

            setState((prev: SortableState) => ({
                ...prev,
                boxes: {},
                targetBoxes: {},
                origSortPos: null,
                sourcePosition: null,
                prevPosition: null,
                sortPosition: null,
                itemId: null,
                targetId: null,
            }));

            onSort?.(sortParams);
        },

        onSortCancel() {
            clearItemsTransform();

            setState((prev: SortableState) => {
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
            });
        },
    });

    const innerRef = useCallback((node: Node | null): Node | null => {
        if (!node) {
            return null;
        }

        if (dragZoneRef) {
            dragZoneRef.current = node as HTMLElement;
        }
        if (dropTargetRef) {
            dropTargetRef.current = node as HTMLElement;
        }

        return node;
    }, []);
    useImperativeHandle<SortableRef, SortableRef>(ref, () => dragZoneRef?.current as HTMLElement);

    const state = getState();

    const draggingItem = getDraggingItem();

    const avatarProps: SortableAvatarProps | null = draggingItem && ({
        columns: [],
        ...draggingItem,

        className: classNames(
            (props.dragClass === true)
                ? 'drag'
                : props.dragClass,
            draggingItem.className,
        ),
        table: props.table,
        components: {
            ...props.components,
            ItemWrapper: SortableItemWrapper,
        },
    });

    if (draggingItem && avatarProps && props.table) {
        const { avatarState } = state;
        avatarProps.columns = (avatarState?.columns ?? [])?.map?.((item, index) => ({
            ...(avatarProps.columns[index] ?? {}),
            ...item,
        }));
    }

    const avatarWrapperProps = {
        copyWidth: props.copyWidth,
        table: props.table,
    };

    const avatar = (Avatar && draggingItem && avatarProps && (
        <SortableDragAvatar {...avatarWrapperProps} >
            <Avatar {...avatarProps} ref={avatarRef} />
        </SortableDragAvatar>
    ));

    const common = useMemo(() => ({
        ...commonProps,
        placeholderClass,
        animatedClass,
        dragging: state.dragging,
        draggingId: state.draggingId,
        animated: props.animated,
        zoneId: props.id,
        components: {
            ...props.components,
            ItemWrapper: SortableItemWrapper,
        },
    }), [
        state.dragging,
        state.draggingId,
        props.animated,
        props.id,
    ]);

    const zoneItems = getItems(props.id ?? null);
    const listItems = useMemo(() => zoneItems, [zoneItems, state.dragging]);

    const ItemComponent = SortableItemWrapper;

    const commonContainerProps = {
        className,
    };

    const containerProps = (props.table)
        ? {
            ...commonContainerProps,
            wrapInTbody: props.wrapInTbody,
        }
        : { ...commonContainerProps };

    const Container = (props.table)
        ? SortableTableContainer
        : SortableContainer;

    return (
        <Container {...containerProps} ref={innerRef}>
            {listItems.map((item: SortableTreeItem) => (
                <ItemComponent
                    {...common}
                    {...item}
                    key={`srtlist_${common.zoneId}_${item.id}`}
                />
            ))}
            {avatar}
        </Container>
    );
});

Sortable.displayName = 'Sortable';
