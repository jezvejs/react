import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    useCallback,
    forwardRef,
    useImperativeHandle,
    useMemo,
} from 'react';

import { useDragnDrop } from '../../utils/DragnDrop/index.js';

import { SortableContainer } from './components/Container/SortableContainer.jsx';
import { SortableItemWrapper } from './components/ItemWrapper/SortableItemWrapper.jsx';

import { useSortableDragZone } from './useSortableDragZone.jsx';
import { useSortableDropTarget } from './useSortableDropTarget.jsx';
import { SortableDragAvatar } from './SortableDragAvatar.jsx';
import {
    clearTransform,
    findTreeItemIndex,
    formatOffsetMatrix,
    getDragZoneItems,
    getNextZoneItems,
    getTreeItemById,
    moveTreeItem,
    mapZones,
    mapNextZones,
    getSourcePosition,
    distinctValues,
} from './helpers.js';

export {
    SortableItemWrapper,
};

// eslint-disable-next-line react/display-name
export const Sortable = forwardRef((p, ref) => {
    const defaultProps = {
        onSort: null,
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

    const { ListItem } = components;
    const Avatar = components.Avatar ?? ListItem;

    const { setState, getState } = useDragnDrop();

    const getItems = (dragZoneId = props.id) => {
        const state = getState();
        return getDragZoneItems(dragZoneId, state);
    };

    const findItemById = (id, dragZoneId = props.id) => {
        const items = getItems(dragZoneId);
        return getTreeItemById(id, items);
    };

    const isShowAvatar = () => {
        const state = getState();
        return (
            state.dragging
            && (state.itemId ?? null) !== null
            && (props.id === state.origSortPos?.zoneId)
        );
    };

    const getDraggingItem = () => {
        if (!isShowAvatar()) {
            return null;
        }

        const state = getState();

        const items = getItems(state.sortPosition?.zoneId);
        const itemsRes = getTreeItemById(state.itemId, items);

        const next = getNextZoneItems(state.sortPosition?.zoneId, state);
        const nextRes = getTreeItemById(state.itemId, next);

        return itemsRes ?? nextRes;
    };

    const saveItemMove = (move) => {
        setState((prev) => {
            const sourceZoneId = prev.sortPosition.zoneId;
            const targetZoneId = move.sortPosition.zoneId;

            let newState = {
                ...prev,
            };

            newState[sourceZoneId] = {
                ...(prev[sourceZoneId] ?? {}),
                items: [
                    ...(prev[sourceZoneId].next ?? prev[sourceZoneId].items),
                ],
            };

            if (targetZoneId !== sourceZoneId) {
                newState[targetZoneId] = {
                    ...(prev[targetZoneId] ?? {}),
                    items: [
                        ...(prev[targetZoneId].next ?? prev[targetZoneId].items),
                    ],
                };
            }

            newState = moveTreeItem(newState, {
                source: {
                    id: newState.origSortPos.id,
                    index: newState.sortPosition.index,
                    parentId: newState.sortPosition.parentId,
                    zoneId: newState.sortPosition.zoneId,
                },
                target: {
                    id: move.sortPosition.id,
                    index: move.sortPosition.index,
                    parentId: move.sortPosition.parentId,
                    zoneId: move.sortPosition.zoneId,
                },
                swapWithPlaceholder: move.swapWithPlaceholder,
            });

            const res = {
                ...prev,
                prevPosition: {
                    ...prev.sortPosition,
                },
                sortPosition: {
                    ...move.sortPosition,
                },
                [sourceZoneId]: {
                    ...(prev[sourceZoneId] ?? {}),
                    next: [...(newState[sourceZoneId].items ?? [])],
                },
            };

            if (targetZoneId !== sourceZoneId) {
                res[targetZoneId] = {
                    ...(prev[targetZoneId] ?? {}),
                    next: [...(newState[targetZoneId].items ?? [])],
                };
            }

            return res;
        });
    };

    const moveItem = () => {
        setState((prev) => {
            const source = getSourcePosition(prev);
            if (!source) {
                return prev;
            }

            const sourceZoneId = source.zoneId;
            const targetZoneId = prev.sortPosition.zoneId;

            let newState = {
                ...prev,
                [sourceZoneId]: {
                    ...(prev[sourceZoneId] ?? {}),
                    items: [
                        ...(prev[sourceZoneId].next ?? prev[sourceZoneId].items),
                    ],
                },
            };

            if (targetZoneId !== sourceZoneId) {
                newState = {
                    ...newState,
                    [targetZoneId]: {
                        ...(prev[targetZoneId] ?? {}),
                        items: [
                            ...(prev[targetZoneId].next ?? prev[targetZoneId].items),
                        ],
                    },
                    sourcePosition: {
                        ...newState.sortPosition,
                    },
                };
            }

            return newState;
        });
    };

    const clearItemsTransform = () => {
        setState((prev) => {
            const zoneIds = distinctValues([
                prev.origSortPos?.zoneId,
                prev.sourcePosition?.zoneId,
                prev.prevPosition?.zoneId,
                prev.sortPosition?.zoneId,
            ]);

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

        onDragStart({ itemId, parentId, zoneId }) {
            if (!dragZoneRef.current) {
                return;
            }

            setState((prev) => {
                const dragZoneItems = getDragZoneItems(zoneId, prev);
                const index = findTreeItemIndex(dragZoneItems, (item) => item?.id === itemId);
                const sortPosition = {
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

        onDragMove({
            targetId,
            targetIndex,
            parentId,
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
                && parentId === state.sortPosition?.parentId
                && targetZoneId === sourceZoneId
            ) {
                return;
            }

            if (targetId === parentId && !props.tree) {
                return;
            }

            // Skip move item to parent container without target item
            // if current target item is already at this container
            if (
                targetId === null
                && state.targetId !== null
                && parentId === state.sortPosition?.parentId
                && targetZoneId === sourceZoneId
            ) {
                return;
            }

            // Skip handling same target as the current one
            const targetItem = findItemById(targetId, targetZoneId);
            if (targetId !== null && !targetItem) {
                return;
            }

            const setTransform = (item) => {
                const found = animateElems.find((i) => i.id === item.id);
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
                    x: (targetRect.left - rect.left) + initialOffset.x,
                    y: (targetRect.top - rect.top) + initialOffset.y,
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
                && (state.sourcePosition.zoneId === targetZoneId)
                && (state.sourcePosition.zoneId !== sourceZoneId)
            ) {
                moveItem();
            }

            saveItemMove({
                sortPosition: {
                    id: targetId,
                    index: targetIndex,
                    parentId,
                    zoneId: targetZoneId,
                },
                swapWithPlaceholder,
            });

            setState((prev) => (
                mapZones(
                    prev,
                    [
                        prev.origSortPos?.zoneId,
                        prev.sourcePosition?.zoneId,
                        prev.prevPosition?.zoneId,
                        prev.sortPosition?.zoneId,
                    ],
                    setTransform,
                )
            ));

            if (swapWithPlaceholder) {
                clearItemsTransform();
                moveItem();
                setState((prev) => ({
                    ...prev,
                    boxes: {},
                }));
            }
        },

        onSortEnd() {
            const state = getState();
            const source = getSourcePosition(state);
            if (!source) {
                return;
            }

            const sourceZoneId = source.zoneId;
            const sourceParentId = source.parentId;

            const targetZoneId = state.sortPosition.zoneId;
            const targetParentId = state.sortPosition.parentId;

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

            setState((prev) => ({
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

            setState((prev) => {
                const newState = moveTreeItem(prev, {
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

    const innerRef = useCallback((node) => {
        if (!node) {
            return;
        }

        if (dragZoneRef) {
            dragZoneRef.current = node;
        }
        if (dropTargetRef) {
            dropTargetRef.current = node;
        }
    }, []);
    useImperativeHandle(ref, () => innerRef.current);

    const state = getState();

    const draggingItem = getDraggingItem();
    const avatarProps = draggingItem && ({
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

    if (draggingItem && props.table) {
        const { avatarState } = state;
        avatarProps.columns = avatarState.columns.map((item, index) => ({
            ...(draggingItem.columns[index] ?? {}),
            ...item,
        }));
    }

    const avatarWrapperProps = {
        copyWidth: props.copyWidth,
        table: props.table,
    };

    const avatar = (draggingItem && (
        <SortableDragAvatar {...avatarWrapperProps} >
            <Avatar {...avatarProps} ref={avatarRef} />
        </SortableDragAvatar>
    ));

    const containerProps = {
        className,
        table: props.table,
        wrapInTbody: props.wrapInTbody,
    };

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

    const zoneItems = getItems();
    const listItems = useMemo(() => zoneItems, [zoneItems, state.dragging]);

    const ItemComponent = SortableItemWrapper;
    const Container = SortableContainer;

    return (
        <Container {...containerProps} ref={innerRef}>
            {listItems.map((item) => (
                <ItemComponent
                    {...common}
                    {...item}
                    items={item.items ?? null}
                    key={`srtlist_${item.zoneId}_${item.id}`}
                />
            ))}
            {avatar}
        </Container>
    );
});

const isComponent = PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
]);

Sortable.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    itemId: PropTypes.string,
    placeholderClass: PropTypes.string,
    animatedClass: PropTypes.string,
    dragClass: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
    ]),
    table: PropTypes.bool,
    wrapInTbody: PropTypes.bool,
    tree: PropTypes.bool,
    vertical: PropTypes.bool,
    animated: PropTypes.bool,
    copyWidth: PropTypes.bool,
    transitionTimeout: PropTypes.number,
    onSort: PropTypes.func,
    components: PropTypes.shape({
        ListItem: isComponent,
        Avatar: isComponent,
    }),
};
