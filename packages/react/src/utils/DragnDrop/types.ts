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

/**
 * Drag source zone
 */
export interface DragZone {
    id: string,
    touchMoveTimeout?: number,
    mouseMoveThreshold?: number,
    elem?: Element | null,
    handles?: DragHandle[],
    copyWidth?: boolean,

    onDragStart: (params: OnDragStartParams) => DragAvatar | null,

    isValidDragHandle?: (hnd: DragHandle) => boolean,

    findDragZoneItem?: (el: Element) => Element | null,
}

export interface DragAvatarInfo {
    id: string;
    mouseShift: Point;
}

/**
 * Dragging element
 */
export interface DragAvatar {
    scrollRequested?: boolean,

    dragZone?: DragZone | null,
    dropTarget?: DropTarget | null,

    initFromEvent: (
        params: {
            downX: number,
            downY: number,
            e: TouchEvent | MouseEvent,
        },
    ) => boolean,

    getTargetElem: () => Element | null,
    getDragInfo: (e?: TouchEvent | MouseEvent | Event) => DragAvatarInfo,

    onDragMove: (e: TouchEvent | MouseEvent) => void,

    onDragEnd?: () => void,

    onDragCancel?: (params: { e: TouchEvent | MouseEvent | Event; }) => void,
}

/**
 * Drop target
 */
export interface DropTarget {
    id: string,
    elem?: Element | null,

    onDragEnter?: (
        prevTarget: DropTarget | null,
        avatar: DragAvatar, e: TouchEvent | MouseEvent,
    ) => void,

    onDragLeave?: (
        newTarget: DropTarget | null,
        avatar: DragAvatar,
        e: TouchEvent | MouseEvent,
    ) => void,

    onDragMove?: (avatar: DragAvatar, e: TouchEvent | MouseEvent) => void,

    onDragEnd?: (params: OnDragEndParams) => void,

    onDragCancel?: (params: OnDragCancelParams) => void,
}

/**
 * Drag'n'Drop state
 */
export interface DragnDropState {
    dragging: boolean,
    draggingId: string | null,

    left: number,
    top: number,

    origLeft: number,
    origTop: number,

    shiftX: number,
    shiftY: number,
}
