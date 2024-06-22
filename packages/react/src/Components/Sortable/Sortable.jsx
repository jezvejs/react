import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useCallback, forwardRef, useImperativeHandle } from 'react';

import { useDragnDrop } from '../../utils/DragnDrop/index.js';

import { useSortableDragZone } from './useSortableDragZone.jsx';
import { useSortableDropTarget } from './useSortableDropTarget.jsx';
import { SortableDragAvatar } from './SortableDragAvatar.jsx';
import {
    findTreeItemIndex,
    getDragZoneItems,
    getTreeItemById,
    moveTreeItem,
} from './helpers.js';

// eslint-disable-next-line react/display-name
export const Sortable = forwardRef((props, ref) => {
    const {
        className,
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
        return findItemById(state.itemId, state.sortPosition?.zoneId);
    };

    const {
        dragZoneRef,
        avatarRef,
    } = useSortableDragZone({
        ...commonProps,

        onDragStart({ itemId, parentId, zoneId }) {
            setState((prev) => {
                const dragZoneItems = getDragZoneItems(zoneId, prev);
                const index = findTreeItemIndex(dragZoneItems, (item) => item?.id === itemId);
                return {
                    ...prev,
                    itemId,
                    origSortPos: {
                        id: itemId,
                        parentId,
                        index,
                        zoneId,
                    },
                    sortPosition: {
                        id: itemId,
                        parentId,
                        index,
                        zoneId,
                    },
                };
            });
        },
    });

    const {
        dropTargetRef,
    } = useSortableDropTarget({
        ...commonProps,

        onDragMove({
            targetId,
            parentId,
            targetZoneId,
            swapWithPlaceholder,
        }) {
            if (targetId === parentId) {
                return;
            }

            setState((prev) => (
                moveTreeItem(prev, {
                    source: {
                        id: prev.origSortPos.id,
                        index: prev.sortPosition.index,
                        parentId: prev.sortPosition.parentId,
                        zoneId: prev.sortPosition.zoneId,
                    },
                    target: {
                        id: targetId,
                        parentId,
                        zoneId: targetZoneId,
                    },
                    swapWithPlaceholder,
                })
            ));
        },

        onSortEnd() {
            const state = getState();
            const sortParams = {
                id: state.origSortPos.id,
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

        onSortCancel() {
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
                && props.id === state.sortPosition.zoneId
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
