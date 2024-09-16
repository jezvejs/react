import { UseDropTargetProps } from '../../utils/DragnDrop/useDropTarget.tsx';
import { Point } from '../../utils/types.ts';

/**
 * useSlidable() hook props interface
 */
export interface UseSlidableProps {
    id: string;

    vertical?: boolean;
    allowMouse?: boolean;
    allowTouch?: boolean;
    allowWheel?: boolean;

    isReady?: boolean | (() => boolean);

    updatePosition: (position: number) => void;

    onDragCancel: () => void;

    onWheel: (e: Event) => void;

    onSlideEnd?: (position: number, totalDistance: number, velocity: number) => void,
}

export interface PositionShift {
    shiftX: number;
    shiftY: number;
}

/**
 * useSlidableDragZone() hook props
 */
export interface UseSlidableDragZoneProps {
    id: string,

    vertical: boolean;
    allowMouse: boolean;
    allowTouch: boolean;

    isReady: boolean | (() => boolean);

    updatePosition: (position: number) => void;

    onDragCancel: () => void;
}

/**
 * useSlidableDropTarget() hook props
 */
export interface UseSlidableDropTargetProps extends UseDropTargetProps {
    id: string,

    onWheel?: (e: WheelEvent) => void;

    onSlideEnd?: (position: number, totalDistance: number, velocity: number) => void,
}

/**
 * useSlidable() hook inner state
 */
export interface SlidableState {
    id: string;

    vertical: boolean;
    allowMouse: boolean;
    allowTouch: boolean;
    allowWheel: boolean;

    moved: boolean;

    startPoint?: Point;

    lastTime: number;
    position: number;
    origPosition: number;

    distance: number;
    totalDistance: number;

    velocity: number;

    shiftX: number;
    shiftY: number;
}
