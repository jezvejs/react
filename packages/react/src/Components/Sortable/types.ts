import {
    CSSProperties,
    ForwardRefExoticComponent,
    RefAttributes,
} from 'react';
import { Point } from '../../utils/types.ts';
import {
    DragAvatar,
    DragnDropState,
    DropTarget,
} from '../../utils/DragnDrop/types.ts';

export interface ItemOffset extends Point {
    id: string;
}

export type GetGroupFunction = (elem: Element | null) => string | null;

/**
 * Sortable item type
 */
export interface SortableTreeItem {
    id: string,
    items?: SortableTreeItem[],

    title?: string;
    className?: string;
    group?: string;
    placeholder?: boolean;
    style?: CSSProperties,

    animationInProgress?: boolean;

    initialOffset?: Point;
    initialTransform?: string;
    offset?: Point;
    offsetTransform?: string;

    rect: AnimationBox;
    targetRect: AnimationBox;

    parent?: ItemOffset | null;
}

/**
 * Callback used by findTreeItem() and filterTreeItems() functions
 */
export type SortableTreeFilterCallback = (
    item: SortableTreeItem,
    index: number,
    arr: SortableTreeItem[],
) => boolean;

/**
 * Position of sortable item at parent container and drag zone
 */
export interface SortableItemPosition {
    id: string | null;
    parentId: string | null;
    index: number;
    zoneId: string | null;
}

/**
 * Sortable drag avatar
 */
export interface SortableDragAvatar extends DragAvatar {
    saveSortTarget: (target: DropTarget | null) => void;
}

export interface SortableAvatarColumn {
    innerStyle: {
        width: string;
    },
}

export interface SortableAvatarState {
    className: string;
    style?: CSSProperties;
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
export interface AnimationBox {
    id?: string;
    x?: number;
    y?: number;
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    width?: number;
    height?: number;
    childContainer?: AnimationBox | null;
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
    parentId: string | null;
    targetZoneId: string | null;
    swapWithPlaceholder: boolean;
    animateElems: SortableItemAnimation[] | null;
}

/**
 * 'ListItem' component type
 */
export type SortableListItemComponent = ForwardRefExoticComponent<
    SortableItemWrapperProps & RefAttributes<SortableItemWrapperRef>
>;

/**
 * 'Avatar' component type
 */
export type SortableAvatarComponent = SortableListItemComponent;

/**
 * 'ItemWrapper' component props
 */
export interface SortableItemWrapperProps {
    id?: string,
    items?: SortableTreeItem[],

    group?: string,
    zoneId?: string,

    title?: string,

    className?: string,
    style?: CSSProperties,

    placeholderClass?: string,
    animatedClass?: string,
    placeholder?: boolean,
    animated?: boolean,
    transitionTimeout?: number,

    initialTransform?: string,
    offsetTransform?: string,

    rect?: AnimationBox,
    targetRect?: AnimationBox,
    childContainer?: AnimationBox,

    components?: {
        ItemWrapper?: SortableListItemComponent,
        ListItem?: SortableListItemComponent;
        Avatar?: SortableAvatarComponent;
    },
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

    targetId: string | null;
    targetIndex: number;
    targetZoneId: string | null;
    targetParentId: string | null;
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
 * Sortable propss
 */
export interface SortableProps {
    id?: string;
    className?: string;
    itemId?: string | null;
    placeholderClass?: string;
    animatedClass?: string;
    dragClass?: string | boolean;
    table?: boolean;
    wrapInTbody?: boolean;
    tree?: boolean;
    vertical?: boolean;
    animated?: boolean;
    copyWidth?: boolean;
    transitionTimeout?: number;
    onSort?: (params: OnSortParam) => void;
    components?: {
        ListItem?: SortableListItemComponent;
        Avatar?: SortableAvatarComponent;
    },
}

/**
 * Sortable state
 */
export interface SortableState extends DragnDropState, SortableProps {
    boxes: {
        [id: string]: AnimationBox;
    },
    targetBoxes: {
        [id: string]: AnimationBox;
    },
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
