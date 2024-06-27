import PropTypes from 'prop-types';
import {
    useCallback,
    forwardRef,
    useImperativeHandle,
    useRef,
    useEffect,
} from 'react';

import { useDragnDrop } from '../../utils/DragnDrop/index.js';

import { SortableListItem } from './components/ListItem/SortableListItem.jsx';
import { useSortableDragZone } from './useSortableDragZone.jsx';
import { useSortableDropTarget } from './useSortableDropTarget.jsx';
import { SortableDragAvatar } from './SortableDragAvatar.jsx';
import {
    AnimationStages,
    findTreeItemIndex,
    getDragZoneItems,
    getTreeItemById,
    mapTreeItems,
    moveTreeItem,
} from './helpers.js';

// eslint-disable-next-line react/display-name
export const Sortable = forwardRef((p, ref) => {
    const props = {
        onSort: null,
        animatedClass: 'animated',
        transitionTimeout: 300,
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
            animateElems,
        }) {
            if (targetId === parentId) {
                return;
            }

            const setTransformIfNeeded = (item) => {
                const found = animateElems.find((i) => i.id === item.id);
                if (!found) {
                    return item;
                }

                if (
                    item.animationStage
                    && item.animationStage !== AnimationStages.exiting
                ) {
                    return item;
                }

                const distX = found.rect.left - found.targetRect.left;
                const distY = found.rect.top - found.targetRect.top;

                const transformMatrix = [1, 0, 0, 1, distX, distY];

                return {
                    ...item,
                    transformMatrix,
                    animationStage: AnimationStages.entering,
                };
            };

            setState((prev) => {
                const newState = moveTreeItem(prev, {
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
                });

                const sourceZoneId = prev.sortPosition.zoneId;

                newState[sourceZoneId] = {
                    ...newState[sourceZoneId],
                    items: mapTreeItems(
                        newState[sourceZoneId].items,
                        setTransformIfNeeded,
                    ),
                };

                if (targetZoneId !== sourceZoneId) {
                    newState[targetZoneId] = {
                        ...newState[targetZoneId],
                        items: mapTreeItems(
                            newState[targetZoneId].items,
                            setTransformIfNeeded,
                        ),
                    };
                }

                newState.animation = Date.now();

                return newState;
            });
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

    // Animation
    const animationFrameRef = useRef(0);

    /** Cancels previously requested animation frame */
    const cancelAnimation = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = 0;
        }
    };

    const animationState = getState();

    useEffect(() => {
        if (animationFrameRef.current) {
            return undefined;
        }

        animationFrameRef.current = requestAnimationFrame(() => {
            animationFrameRef.current = 0;

            setState((prev) => ({
                ...prev,
                [props.id]: {
                    ...prev[props.id],
                    items: mapTreeItems(prev[props.id].items, (item) => {
                        if (item.animationStage === AnimationStages.entering) {
                            return {
                                ...item,
                                transformMatrix: null,
                                animationStage: AnimationStages.entered,
                            };
                        }

                        return item;
                    }),
                },
            }));
        });

        return () => cancelAnimation();
    }, [animationState.animation]);

    const draggingItem = getDraggingItem();
    const avatarProps = draggingItem && { ...draggingItem };

    const avatar = (draggingItem && (
        <SortableDragAvatar copyWidth={props.copyWidth} >
            <Avatar {...avatarProps} ref={avatarRef} />
        </SortableDragAvatar>
    ));

    const containerProps = {
        className,
    };

    const common = {
        ...commonProps,
        placeholderClass,
        animatedClass,
        dragging: props.dragging,
        draggingId: props.draggingId,
        animated: props.animated,
        placeholder: props.placeholder,
        itemId: props.itemId,
        zoneId: props.id,
        components: { ...props.components },
    };

    return (
        <div {...containerProps} ref={innerRef}>
            {getItems().map((item) => (
                <SortableListItem
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
