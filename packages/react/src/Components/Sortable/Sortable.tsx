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
    getDragZoneItems,
    getNextZoneItems,
    getSourcePosition,
    getTreeItemById,
} from './helpers.ts';
import {
    SortableAvatarProps,
    SortableProps,
    SortableSaveItemMoveParam,
    SortableState,
    SortableTreeItem,
} from './types.ts';
import { useSortableDragZone } from './useSortableDragZone.tsx';
import { useSortableDropTarget } from './useSortableDropTarget.tsx';
import { actions, reducer } from './reducer.ts';

export * from './types.ts';

export {
    reducer as sortableReducer,
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

    const { getState, dispatch } = useDragnDrop<SortableState>();

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
        dispatch(actions.saveItemMove(move));
    };

    const moveItem = () => {
        dispatch(actions.moveItem());
    };

    const clearItemsTransform = () => {
        dispatch(actions.clearItemsTransform());
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

            dispatch(actions.startSort({ itemId, parentId, zoneId }));
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

            dispatch(actions.transformZones({ elems: animateElems, swapWithPlaceholder }));

            if (swapWithPlaceholder) {
                clearItemsTransform();
                moveItem();
                dispatch(actions.resetBoxes());
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
            dispatch(actions.endSort());

            onSort?.(sortParams);
        },

        onSortCancel() {
            clearItemsTransform();
            dispatch(actions.cancelSort());
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
