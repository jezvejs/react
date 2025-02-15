import { Point } from '../types.ts';

/**
 * Drag start handle
 */
export interface DragHandleQuery {
    query: string;
    includeChilds?: boolean;
}

export interface DragHandleElement {
    elem: string | Element;
    includeChilds?: boolean;
}

export type DragHandle = DragHandleQuery | DragHandleElement | Element | string;

/** Drag start parameters */
export interface OnDragStartParams {
    e: TouchEvent | MouseEvent;
    downX: number;
    downY: number;
}

/** Drag move parameters */
export interface OnDragMoveParams {
    e: TouchEvent | MouseEvent;
    avatar?: DragAvatar;
}

/** Drop allowed callback parameters */
export interface IsDropAllowedParams {
    e: TouchEvent | MouseEvent | Event;
    avatar: DragAvatar;
    dropTarget?: DropTarget;
}

/** Drag end parameters */
export interface OnDragEndParams {
    e: TouchEvent | MouseEvent | Event;
    avatar: DragAvatar;
    avatarInfo?: DragAvatarInfo;
    dropTarget?: DropTarget;
    offset?: { top: number, left: number; };
    border?: { top: number, left: number; };
}

/** Drag cancel params */
export interface OnDragCancelParams {
    e: TouchEvent | MouseEvent | Event;
    avatar?: DragAvatar;
}

/** Drag leave params */
export interface OnDragLeaveParams {
    e: TouchEvent | MouseEvent | Event;
    avatar?: DragAvatar;
    newTarget?: DropTarget | null;
}

/** Drag enter params */
export interface OnDragEnterParams {
    e: TouchEvent | MouseEvent | Event;
    avatar?: DragAvatar;
    prevTarget?: DropTarget | null;
}

/**
 * Drag source zone
 */
export interface DragZone {
    id: string;
    type?: string;
    touchMoveTimeout?: number;
    mouseMoveThreshold?: number;
    elem?: Element | null;
    handles?: DragHandle | DragHandle[];
    copyWidth?: boolean;

    onDragStart: (params: OnDragStartParams) => DragAvatar | null;

    isValidDragHandle?: (hnd: DragHandle) => boolean;

    findDragZoneItem?: (el: Element) => Element | null;
}

export interface DragAvatarInfo {
    id: string;
    type?: string;
    mouseShift: Point;
}

export interface DragAvatarInitParam {
    downX: number;
    downY: number;
    e: TouchEvent | MouseEvent;
}

/**
 * Dragging element
 */
export interface DragAvatar {
    id?: string;
    type?: string;

    scrollRequested?: boolean;

    dragZone?: DragZone | null;
    dropTarget?: DropTarget | null;

    initFromEvent: (params: DragAvatarInitParam) => boolean;

    getTargetElem: () => Element | null;
    getDragInfo: (e?: TouchEvent | MouseEvent | Event) => DragAvatarInfo;

    onDragMove: (params: OnDragMoveParams) => void;

    onDragEnd?: () => void;

    onDragCancel?: (params: OnDragCancelParams) => void;
}

/**
 * Drop target
 */
export interface DropTarget {
    id: string;
    elem?: Element | null;

    onDragEnter?: (params: OnDragEnterParams) => void;

    onDragLeave?: (params: OnDragLeaveParams) => void;

    onDragMove?: (params: OnDragMoveParams) => void;

    isDropAllowed?: (params: IsDropAllowedParams) => boolean;

    onDragEnd?: (params: OnDragEndParams) => void;

    onDragCancel?: (params: OnDragCancelParams) => void;
}

/**
 * Drag'n'Drop state
 */
export interface DragnDropState {
    dragging: boolean;
    draggingId: string | null;

    left: number;
    top: number;

    origLeft: number;
    origTop: number;

    rect?: DOMRect;
    offset?: DOMRect;

    shiftX: number;
    shiftY: number;
}
