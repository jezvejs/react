import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    useCallback,
    forwardRef,
    useImperativeHandle,
    useMemo,
} from 'react';

import { useDragnDrop } from '../../utils/DragnDrop/index.js';

import { SortableListItem } from './components/ListItem/SortableListItem.jsx';
import { useSortableDragZone } from './useSortableDragZone.jsx';
import { useSortableDropTarget } from './useSortableDropTarget.jsx';
import { SortableDragAvatar } from './SortableDragAvatar.jsx';
import {
    clearTransform,
    findTreeItemIndex,
    formatOffsetMatrix,
    getAnimationBox,
    getDragZoneItems,
    getNextZoneItems,
    getTreeItemById,
    moveTreeItem,
    mapZones,
} from './helpers.js';

// eslint-disable-next-line react/display-name
export const Sortable = forwardRef((p, ref) => {
    const props = {
        onSort: null,
        animatedClass: 'animated',
        transitionTimeout: 300,
        dragClass: 'drag',
        ...p,
    };

    const {
        className,
        placeholderClass,
        animatedClass,
        onSort = null,
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

            newState = mapZones(newState, [sourceZoneId, targetZoneId], clearTransform);

            const res = {
                ...prev,
                prevPosition: {
                    ...prev.sortPosition,
                },
                sortPosition: {
                    ...move.sortPosition,
                },
                swapWithPlaceholder: move.swapWithPlaceholder,
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
            const sourceZoneId = prev.origSortPos.zoneId;
            const targetZoneId = prev.sortPosition.zoneId;

            const newState = {
                ...prev,
                [sourceZoneId]: {
                    ...(prev[sourceZoneId] ?? {}),
                    items: [
                        ...(prev[sourceZoneId].next ?? prev[sourceZoneId].items),
                    ],
                },
            };

            if (targetZoneId !== sourceZoneId) {
                newState[targetZoneId] = {
                    ...(prev[targetZoneId] ?? {}),
                    items: [
                        ...(prev[targetZoneId].next ?? prev[targetZoneId].items),
                    ],
                };
            }

            return newState;
        });
    };

    const clearItemsTransform = () => {
        setState((prev) => (
            mapZones(
                prev,
                [
                    prev.origSortPos?.zoneId,
                    prev.prevPosition?.zoneId,
                    prev.sortPosition?.zoneId,
                ],
                clearTransform,
            )
        ));
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

            const selector = ListItem.selector ?? this.selector;
            const elems = Array.from(dragZoneRef.current.querySelectorAll(selector));
            const boxes = elems.map((el) => getAnimationBox(el));

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
                    boxes: {
                        ...(prev.boxes ?? {}),
                        [zoneId]: boxes,
                    },
                    itemId,
                    origSortPos: { ...sortPosition },
                    prevPosition: { ...sortPosition },
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
            const sourceId = state.origSortPos.id ?? null;

            // Skip the same item
            if (
                targetId === sourceId
                && parentId === state.sortPosition.parentId
                && targetZoneId === state.sortPosition.zoneId
            ) {
                return;
            }

            if (targetId === parentId) {
                return;
            }

            // Skip move item to parent container without target item
            // if current target item is already at this container
            if (
                targetId === null
                && state.targetId !== null
                && parentId === state.sortPosition.parentId
                && targetZoneId === state.sortPosition.zoneId
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

                const { targetRect } = found;

                const rect = (item.animationInProgress && item.rect)
                    ? item.rect
                    : found.rect;

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
                };

                if (swapWithPlaceholder) {
                    res.animated = false;
                }

                return res;
            };

            saveItemMove({
                sortPosition: {
                    id: targetId,
                    index: targetIndex,
                    parentId,
                    zoneId: targetZoneId,
                },
                swapWithPlaceholder,
            });

            setState((prev) => {
                const sourceZoneId = prev.prevPosition.zoneId;

                let newState = {
                    ...prev,
                };

                newState = mapZones(newState, [sourceZoneId, targetZoneId], setTransform);

                return newState;
            });

            if (swapWithPlaceholder) {
                clearItemsTransform();
                moveItem();
            }
        },

        onSortEnd() {
            const state = getState();

            const sourcePosition = state.prevPosition ?? state.origSortPos;
            const sourceZoneId = sourcePosition?.zoneId;
            const sourceParentId = sourcePosition?.parentId;
            const targetZoneId = state.sortPosition.zoneId;

            const sortParams = {
                id: state.origSortPos.id,
                sourceIndex: sourcePosition?.index,
                sourceZoneId,
                sourceParentId,
                targetId: state.sortPosition.id,
                targetIndex: state.sortPosition.index,
                targetZoneId,
                targetParentId: state.sortPosition.parentId,
            };

            clearItemsTransform();
            moveItem();

            setState((prev) => ({
                ...prev,
                origSortPos: null,
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
                    swapWithPlaceholder: prev.swapWithPlaceholder,
                });

                return {
                    ...newState,
                    origSortPos: null,
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

    const draggingItem = getDraggingItem();
    const avatarProps = draggingItem && ({
        ...draggingItem,
        className: classNames(
            (props.dragClass === true)
                ? 'drag'
                : props.dragClass,
            draggingItem.className,
        ),
    });

    const avatar = (draggingItem && (
        <SortableDragAvatar copyWidth={props.copyWidth} >
            <Avatar {...avatarProps} ref={avatarRef} />
        </SortableDragAvatar>
    ));

    const containerProps = {
        className,
    };

    const common = useMemo(() => ({
        ...commonProps,
        placeholderClass,
        animatedClass,
        dragging: props.dragging,
        draggingId: props.draggingId,
        animated: props.animated,
        placeholder: props.placeholder,
        zoneId: props.id,
        components: { ...props.components },
    }), []);

    const zoneItems = getItems();
    const listItems = useMemo(() => zoneItems, [zoneItems]);

    const ItemComponent = SortableListItem;

    return (
        <div {...containerProps} ref={innerRef}>
            {listItems.map((item) => (
                <ItemComponent
                    {...common}
                    {...item}
                    key={`srtlist_${item.zoneId}_${item.id}`}
                />
            ))}
            {avatar}
        </div>
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
    dragging: PropTypes.bool,
    draggingId: PropTypes.bool,
    placeholder: PropTypes.bool,
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
