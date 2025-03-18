import {
    ForwardRefExoticComponent,
    RefAttributes,
} from 'react';
import type { Offset } from '@jezvejs/dom';

import { Point } from '../../utils/types.ts';
import {
    DragAvatar,
    DragHandle,
    DragnDropState,
    DragZone,
    DropTarget,
    OnDragStartParams,
} from '../../utils/DragnDrop/types.ts';
import { UseDropTargetProps } from '../../utils/DragnDrop/useDropTarget.tsx';
import { UseDragZoneProps } from '../../utils/DragnDrop/useDragZone.tsx';

export interface ItemOffset extends Point {
    id: string;
}

export type GetGroupFunction = (elem: Element | null) => string | null;

/**
 * Sortable item type
 */
export interface SortableTreeItem extends BaseTreeItem {
    id: string;
    items?: SortableTreeItem[];

    title?: string;
    className?: string;
    group?: string | GetGroupFunction;
    placeholder?: boolean;
    style?: React.CSSProperties,

    animationInProgress?: boolean;

    initialOffset?: Point | null;
    initialTransform?: string | null;
    offset?: Point | null;
    offsetTransform?: string | null;

    rect?: AnimationBox;
    targetRect?: AnimationBox;

    parent?: ItemOffset | null;
}

export interface BaseTreeItem {
    id: string;
    items?: BaseTreeItem[];
}

export interface TreeFilterCallback<
    T extends BaseTreeItem = BaseTreeItem,
    R = boolean,
> {
    (item: T, index?: number, arr?: T[]): R;
}

/**
 * Position of sortable item at parent container and drag zone
 */
export interface SortableItemPosition {
    id?: string | null;
    parentId?: string | null;
    index: number;
    zoneId?: string | null;
}

/**
 * moveTreeItem() reducer function params
 */
export interface MoveTreeItemParam {
    source: SortableItemPosition;
    target: SortableItemPosition;
    swapWithPlaceholder?: boolean;
}

/**
 * Sortable drag avatar
 */
export interface SortableDragAvatar extends DragAvatar {
    saveSortTarget?: (target: DropTarget | null) => void;
}

export interface SortableAvatarColumn {
    id?: string;
    style?: Partial<React.CSSProperties>;
    innerStyle?: Partial<React.CSSProperties>;
    content?: React.ReactNode;
}

export interface SortableAvatarState {
    className: string;
    style?: React.CSSProperties;
    columns: SortableAvatarColumn[];
}

/**
 * Position of sortable element
 * Returned from getElementPosition() and used by insertAtElementPosition()
 */
export interface SortableNodePosition {
    parent: Element | null;
    prev: Element | null;
    next: Element | null;
}

/**
 * Sortable item position and dimensions
 */
export interface AnimationBox extends BaseTreeItem {
    id: string;
    x?: number;
    y?: number;
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    width?: number;
    height?: number;
    childContainer?: AnimationBox | null;
    items?: AnimationBox[];
}

/**
 * Map of sortable items
 */
export interface SortableItemsPositions {
    [id: string]: AnimationBox;
}

/**
 * Sortable item animation movement
 */
export interface SortableItemRects {
    rect: AnimationBox;
    targetRect: AnimationBox;
    zoneId: string;
}

/**
 * Sortable item animation movement
 */
export interface SortableItemAnimation extends SortableItemPosition {
    rect: AnimationBox;
    targetRect: AnimationBox;
    parent?: ItemOffset | null;
}

/** Sortable drop target onSortMove() callback params */
export interface OnSortMoveParam {
    targetId: string | null;
    targetIndex: number;
    targetParentId: string | null;
    targetZoneId: string | null;
    swapWithPlaceholder: boolean;
    animateElems: SortableItemAnimation[] | null;
}

type WithSelector = {
    selector?: string;
};

/**
 * 'ListItem' component type
 */
export type SortableListItemComponent = (
    (React.FC<SortableItemWrapperProps> & WithSelector)
    | (
        ForwardRefExoticComponent<
            SortableItemWrapperProps & RefAttributes<SortableItemWrapperRef>
        > & WithSelector
    )
);

/**
 * 'Avatar' component type
 */
export type SortableAvatarComponent = SortableListItemComponent;

/**
 * 'ItemWrapper' component props
 */
export interface SortableItemWrapperProps extends SortableTreeItem {
    id: string;
    items?: SortableTreeItem[];

    group?: string | GetGroupFunction;
    zoneId?: string;

    title?: string;

    className?: string;
    style?: React.CSSProperties;

    placeholderClass?: string;
    animatedClass?: string;
    placeholder?: boolean;
    animated?: boolean;
    transitionTimeout?: number;

    initialTransform?: string | null;
    offsetTransform?: string | null;

    rect?: AnimationBox;
    targetRect?: AnimationBox;
    childContainer?: AnimationBox;

    renderItem?: (item: SortableTreeItem) => React.ReactNode;

    components?: {
        ItemWrapper?: SortableListItemComponent;
        ListItem?: SortableListItemComponent;
        Avatar?: SortableAvatarComponent;
    };
}

/**
 * 'ItemWrapper' component ref
 */
export type SortableItemWrapperRef = HTMLElement | null;

/**
 * 'Avatar' component props
 */
export interface SortableAvatarProps extends SortableTreeItem {
    className?: string;
    table: boolean;
    columns: SortableAvatarColumn[];

    components: {
        ItemWrapper?: SortableListItemComponent,
        ListItem?: SortableListItemComponent;
        Avatar?: SortableAvatarComponent;
    };
}

/** onSortStart() callback params */
export interface OnSortStartParam {
    itemId: string | null;
    parentId: string | null;
    zoneId: string | null;
}

/** acceptChild() callback params */
export interface AcceptChildParam {
    avatar: SortableDragAvatar;
    e: Event;
    dropTarget?: UseSortableDropTargetProps;
}

/** onSortEnd() callback params */
export interface OnSortEndParam {
    avatar: SortableDragAvatar;
    e: Event;
}

/** onSortCancel() callback params */
export interface OnSortCancelParam {
    avatar: SortableDragAvatar;
    e: Event;
}

/** onSort() callback params */
export interface OnSortParam {
    id: string | null;
    sourceIndex: number;
    sourceZoneId: string | null;
    sourceParentId: string | null;

    targetId?: string | null;
    targetIndex: number;
    targetZoneId: string | null;
    targetParentId: string | null;
}

/** transformZones action params */
export interface TransformZonesParams {
    elems: SortableItemAnimation[];
    swapWithPlaceholder: boolean;
}

/** setTransform() function params */
export interface SetTransformParams extends TransformZonesParams {
    item: SortableItemWrapperProps;
}

/** initDrag action params */
export interface InitDragParams {
    downX: number;
    downY: number;
    offset: Offset;
    avatarState?: SortableAvatarState;
    width?: number | null;
}

/** updatePositions action params */
export interface UpdatePositionsParams {
    name: SortablePositionType;
    newBoxes: SortableZonePositionsMap;
    zones: string[];
}

/**
 * saveItemMove() function params
 */
export interface SortableSaveItemMoveParam {
    sortPosition: SortableItemPosition;
    swapWithPlaceholder: boolean;
}

/**
 * SortableDropTarget.getMovingItems() params
 */
export interface SortableMoveInfo {
    sourceId: string;
    sourceIndex: number;
    sourceZoneId: string;
    sourceParentId: string;

    targetIndex: number;
    targetId: string | null;
    targetZoneId: string;
    targetParentId: string | null;

    dragZoneAfterTarget: boolean;
    dragZoneBeforeTarget: boolean;
    dragZoneContainsTarget: boolean;
    targetContainsDragZone: boolean;
    origSourceContainsDragZone: boolean;
}

/**
 * setAnimationTransform() function params
 */
export interface SortableAnimationTransform {
    initialTransform?: string | null;
    offsetTransform?: string | null;
}

/**
 * Sortable props
 */
export interface SortableProps<ITEM_TYPE = SortableTreeItem> {
    id?: string;
    group?: string | GetGroupFunction;
    className?: string;
    itemId?: string | null;
    items?: ITEM_TYPE[];
    selector?: string;
    containerSelector?: string;
    placeholderClass?: string;
    animatedClass?: string;
    dragClass?: string | boolean;
    handles?: DragHandle | DragHandle[];
    onlyRootHandle?: boolean;

    table?: boolean;
    wrapInTbody?: boolean;
    tree?: boolean;
    vertical?: boolean;
    animated?: boolean;
    copyWidth?: boolean;
    allowSingleItemSort?: boolean;
    transitionTimeout?: number;

    container?: Element | DocumentFragment | null;

    acceptChild?: (params: AcceptChildParam) => boolean;

    onSort?: (params: OnSortParam) => void;

    // renderItem?: (item: ITEM_TYPE) => React.ReactNode;
    renderItem?: (item: SortableTreeItem) => React.ReactNode;

    components?: {
        ListItem?: SortableListItemComponent;
        Avatar?: SortableAvatarComponent;
    },
}

export interface SortableZone {
    items: SortableTreeItem[];
    next?: SortableTreeItem[];
}

/**
 * Map of sortable item positions arrays for drag zones:
 *
 * {
 *     [zoneId1]: [
 *         { id1, x, y, ... }, // AnimationBox
 *         { id2, x, y, ..., items: [
 *             { id2_1, x, y, ... }, // children items
 *         ] },
 *     ],
 * }
 */
export interface SortableZonePositions {
    [id: string]: AnimationBox[];
}

/**
 * Map of sortable item positions maps for drag zones:
 *
 * {
 *     [zoneId1]: {
 *         [id1]: { id1, x, y, ... }, // AnimationBox
 *         [id2]: { id2, x, y, ... },
 *         [id2_1]: { id2_1, x, y, ... },
 *     },
 * }
 */
export interface SortableZonePositionsMap {
    [id: string]: SortableItemsPositions;
}

export type SortablePositionType = 'boxes' | 'targetBoxes';

/**
 * Sortable state
 */
export interface SortableState<
    ITEM_TYPE = SortableTreeItem
> extends DragnDropState, SortableProps<ITEM_TYPE> {
    zones: {
        [id: string]: SortableZone;
    },
    boxes: SortableZonePositions;
    targetBoxes: SortableZonePositions;
    origSortPos: SortableItemPosition | null;
    sourcePosition: SortableItemPosition | null;
    prevPosition: SortableItemPosition | null;
    sortPosition: SortableItemPosition | null;
    itemId: string | null;
    targetId: string | null;

    hidden: boolean;
    width: number;

    avatarState?: SortableAvatarState | null;
}

/**
 * useSortableDropTarget() hook props
 */
export interface UseSortableDragZoneProps extends UseDragZoneProps {
    group?: string | GetGroupFunction;

    selector?: string;
    placeholderClass?: string;
    animatedClass?: string;
    dragClass?: string | boolean;
    containerSelector?: string;

    allowSingleItemSort?: boolean;
    onlyRootHandle?: boolean;
    dragOriginal?: boolean;
    absolutePos?: boolean;
    copyWidth?: boolean;

    table?: boolean;
    tree?: boolean;

    sourceNode?: HTMLElement | null;
    sourceNodeRestored?: boolean;
    nodeObserver?: MutationObserver | null;

    onDragStart: (params: OnDragStartParams) => DragAvatar | null;

    onSortStart?: (params: OnSortStartParam) => void;

    getClosestItemElement?: (elem: Element | null) => Element | null;
    itemIdFromElem?: (elem: Element | null) => string | null;
    getDragItemElement?: () => Element | null;
    findDragZoneItem?: (target: Element | null) => Element | null;
    findAllDragZoneItems?: () => Element[];
    isValidDragHandle?: (target: Element) => boolean;

    getPlaceholder?: () => string | null;
    getAnimatedClass?: () => string | null;
    getItemSelector?: () => string | null;
    getContainerSelector?: () => string | null;
    getDragClass?: () => string | null;

    restoreSourceNode?: () => void;
    observeNode?: (node: Element | null) => void;
    disconnectNodeObserver?: () => void;
    removeSourceNode?: () => void;
    finishDrag?: () => void;

    makeSortableTableAvatar?: () => SortableDragAvatar | null;
    makeSortableAvatar?: () => SortableDragAvatar | null;
    makeAvatar?: () => SortableDragAvatar | null;

    getGroup?: GetGroupFunction;

    components?: {
        Avatar?: React.ComponentType;
    };
}

/**
 * useSortableDropTarget() hook props
 */
export interface UseSortableDropTargetProps extends UseDropTargetProps {
    group?: string | GetGroupFunction;

    parent_id?: string;
    zone_id?: string;

    selector?: string;
    placeholderClass?: string;
    hoverClass?: string;
    containerSelector?: string;
    tree?: boolean;

    getGroup?: () => string | null;

    isAceptableAvatar?: (avatar: DragAvatar | null) => boolean;
    acceptChild?: (params: AcceptChildParam) => boolean;

    onSortMove?: (params: OnSortMoveParam) => void;
    onSortEnd?: (params: OnSortEndParam) => void;
    onSortCancel?: (params: OnSortCancelParam) => void;

    getItemElementById?: (id: string, elem: Element) => Element | null;

    getItemsPositions?: (dragZone: DragZone | null) => SortableItemsPositions | null;

    updatePositions?: (options: {
        name: SortablePositionType;
        zoneIds: string | string[];
    }) => void;

    checkPositionsCache?: (zoneIds: string | string[]) => void;

    getTargetPositions?: (zoneIds: string[]) => void;

    getAnimatedItem?: (
        id: string | null,
        index: number,
        zoneIds: string[],
        parentId: string | null,
    ) => SortableItemAnimation | null;

    getItemRects?: (
        itemId: string,
        zoneIds: string[],
        state: SortableState,
    ) => SortableItemRects | null,

    getMovingItems?: (options: SortableMoveInfo) => SortableItemAnimation[] | null;

    finishDrag?: () => void,

    applySort?: (oarams: OnSortEndParam) => void;
    cancelSort?: (params: OnSortCancelParam) => void;

    components?: {
        ListItem?: SortableListItemComponent;
    },
}
