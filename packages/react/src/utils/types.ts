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
