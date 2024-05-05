import { asArray } from '@jezvejs/types';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useCallback, forwardRef, useImperativeHandle } from 'react';

import { useDragnDrop } from '../../utils/DragnDrop/index.js';

import { useSortableDragZone } from './useSortableDragZone.jsx';
import { useSortableDropTarget } from './useSortableDropTarget.jsx';
import { SortableDragAvatar } from './SortableDragAvatar.jsx';
import {
    filterTreeItems,
    findTreeItemIndex,
    getTreeItemById,
    isTreeContains,
    mapTreeItems,
} from './helpers.js';

// eslint-disable-next-line react/display-name
export const Sortable = forwardRef((props, ref) => {
    const {
        className,
        onSort,
        components,
        ...commonProps
    } = props;
    const { ListItem } = components;
    const Avatar = components.Avatar ?? ListItem;

    const { setState, getState } = useDragnDrop();

    const getDragZoneItems = (dragZoneId, state) => (
        state[dragZoneId]?.items ?? []
    );

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
            && (props.id === state.origSortPos?.parentZoneId)
        );
    };

    const getDraggingItem = () => {
        if (!isShowAvatar()) {
            return null;
        }

        const state = getState();
        return findItemById(state.itemId, state.sortPosition?.parentZoneId);
    };

    const {
        dragZoneRef,
        avatarRef,
    } = useSortableDragZone({
        ...commonProps,

        onDragStart({ itemId, parentId, parentZoneId }) {
            setState((prev) => {
                const dragZoneItems = getDragZoneItems(parentZoneId, prev);
                const index = findTreeItemIndex(dragZoneItems, (item) => item.id === itemId);
                return {
                    ...prev,
                    itemId,
                    origSortPos: {
                        id: itemId,
                        parentId,
                        index,
                        parentZoneId,
                    },
                    sortPosition: {
                        id: itemId,
                        parentId,
                        index,
                        parentZoneId,
                    },
                };
            });
        },
    });

    const {
        dropTargetRef,
    } = useSortableDropTarget({
        ...commonProps,

        onDragMove({ targetId, parentId, targetZoneId }) {
            if (targetId === parentId) {
                return;
            }

            setState((prev) => {
                if (prev.itemId === targetId) {
                    return prev;
                }

                const dragZoneItems = getDragZoneItems(targetZoneId, prev);

                // Prevent to move parent subtree into own child
                if (isTreeContains(prev.itemId, targetId, dragZoneItems)) {
                    return prev;
                }

                const index = (targetId !== null)
                    ? findTreeItemIndex(dragZoneItems, (item) => item.id === targetId)
                    : 0;

                if (
                    index === -1
                    || (
                        index === prev.sortPosition.index
                        && parentId === prev.sortPosition.parentId
                        && targetZoneId === prev.sortPosition.parentZoneId
                    )
                ) {
                    return prev;
                }

                const newState = {
                    ...prev,
                    targetId,
                    sortPosition: {
                        id: targetId,
                        index,
                        parentId,
                        parentZoneId: targetZoneId,
                    },
                };

                // Remove item from source list
                const sourceZoneId = prev.sortPosition.parentZoneId;
                const sourceItems = prev[sourceZoneId].items;

                newState[sourceZoneId] = {
                    ...newState[sourceZoneId],
                    items: filterTreeItems(sourceItems, (item) => item?.id !== newState.itemId),
                };

                // Insert item to destination list
                const movingItem = getTreeItemById(newState.itemId, sourceItems);
                const destItems = getDragZoneItems(targetZoneId, newState);

                newState[targetZoneId] = {
                    ...newState[targetZoneId],
                    items: (parentId === targetZoneId)
                        ? destItems.toSpliced(index, 0, movingItem)
                        : (
                            mapTreeItems(destItems, (item) => {
                                if (item.id !== parentId) {
                                    return item;
                                }

                                return {
                                    ...item,
                                    items: asArray(item.items).toSpliced(index, 0, movingItem),
                                };
                            })
                        ),
                };

                return newState;
            });
        },

        onSortEnd() {
            const state = getState();
            const sortParams = {
                id: state.itemId,
                parentId: state.origSortPos.parentId,
                targetPos: state.sortPosition.index,
                targetParentId: state.sortPosition.parentId,
            };

            setState((prev) => ({
                ...prev,
                origSortPos: null,
                sortPosition: null,
                itemId: null,
                targetId: null,
            }));

            onSort?.(sortParams);
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

    const renderItem = (item) => {
        if (!item) {
            return item;
        }

        const { placeholderClass } = props;
        const state = getState();

        const isPlaceholder = (
            item.placeholder
            || (
                state.dragging
                && item.id === state.itemId
                && props.id === state.sortPosition.parentZoneId
            )
        );

        return (
            <ListItem
                {...item}
                className={classNames(
                    item.className,
                    { [placeholderClass]: isPlaceholder },
                )}
                renderItem={renderItem}
                key={`srtlist_${props.id}_${item.id}`}
            />
        );
    };

    const draggingItem = getDraggingItem();
    const avatarProps = draggingItem && { ...draggingItem };

    const avatar = (draggingItem && (
        <SortableDragAvatar copyWidth={props.copyWidth} >
            <Avatar {...avatarProps} ref={avatarRef} />
        </SortableDragAvatar>
    ));

    return (
        <div className={className} ref={innerRef}>
            {getItems().map((item) => renderItem(item))}
            {avatar}
        </div>
    );
});

Sortable.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    placeholderClass: PropTypes.string,
    copyWidth: PropTypes.bool,
    onSort: PropTypes.func,
    components: PropTypes.shape({
        ListItem: PropTypes.object,
        Avatar: PropTypes.object,
    }),
};

Sortable.defaultProps = {
    onSort: null,
};
