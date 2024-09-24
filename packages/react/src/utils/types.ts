import { SVGAttributes } from 'react';

/**
 * Native event listener used by .addEventListener() and .removeEventListener() methods
 */
export interface ListenerFunction<T extends Event = Event> {
    (e: T): void;
}

export interface ListenerOptions {
    passive?: boolean;
    capture?: boolean;
    once?: boolean;
    signal?: AbortSignal;
}

/**
 * Event listener object supported by setEvents() and removeEvents() functions
 */
export interface ListenerObject {
    listener: ListenerFunction;
    options?: ListenerOptions;
}

export type Listener = ListenerFunction | ListenerObject;

export interface ListenerFunctionsGroup {
    [type: string]: ListenerFunction;
}

export interface ListenersGroup {
    [type: string]: Listener;
}

/**
 * Coordinates point
 */
export interface Point {
    x: number;
    y: number;
}

/**
 * Rectangle
 */
export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Range type
 */
export interface RangeType {
    start: number;
    end: number;
}

/**
 * Indexed CSS style object
 */
export type StyleDeclaration = Partial<CSSStyleDeclaration> & { [propName: string]: string; };

/**
 * Indexed SVG attributes object
 */
export type IndexedSVGAttributes<T> = Partial<SVGAttributes<T>> & {
    [propName: string]: string;
};

/**
 * Animation stages
 */
export enum AnimationStages {
    exited = 0,
    entering,
    entered,
    exiting,
}
