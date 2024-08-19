import { isFunction } from '@jezvejs/types';

export type StoreActionPayload = object | string | number | boolean | bigint | symbol | null;

export interface StoreActionObject {
    type: string,
    payload?: StoreActionPayload,
}

export type StoreActionPayloadFunction = (payload?: StoreActionPayload) => StoreActionObject;
export type StoreActionFunction = (api: StoreActionAPI | null) => void;

export type StoreAction = StoreActionObject | StoreActionFunction;

export type StoreState = object;

export type StoreReducer = (state: StoreState, action: StoreActionObject) => StoreState;
export type StoreReducersList = StoreReducer | StoreReducer[];

export type StoreActionReducer = (state: StoreState, payload?: StoreActionPayload) => StoreState;

export interface StoreOptions {
    initialState?: StoreState,
    sendInitialState?: true,
}

export type StoreListener = (state: StoreState, prevState: StoreState) => void;

export type StoreDispatchFunction = (action: StoreAction) => void;
export type StoreGetStateFunction = () => StoreState;

export interface StoreActionAPI {
    dispatch: StoreDispatchFunction,
    getState: StoreGetStateFunction,
}

export type StoreUpdaterFunction = (prev: StoreState) => StoreState;
export type StoreUpdater = StoreState | StoreUpdaterFunction;

/** State store class */
export class Store {
    reducer: StoreReducer | null = null;

    state: StoreState = {};

    listeners: StoreListener[] = [];

    sendInitialState: boolean = true;

    storeAPI: StoreActionAPI | null = null;

    constructor(reducer: StoreReducer, options: StoreOptions = {}) {
        if (!isFunction(reducer)) {
            throw new Error('Expected reducer to be a function');
        }

        const {
            initialState = {},
            sendInitialState = true,
        } = options;

        this.reducer = reducer;
        this.state = { ...initialState };
        this.listeners = [];
        this.sendInitialState = sendInitialState;

        this.storeAPI = {
            dispatch: (action) => this.dispatch(action),
            getState: () => this.getState(),
        };
    }

    getState() {
        return this.state;
    }

    dispatch(action: StoreAction | StoreActionFunction) {
        if (typeof action === 'function') {
            action(this.storeAPI);
            return;
        }

        if (!this.reducer) {
            return;
        }

        const newState = this.reducer(this.state, action);
        const prevState = this.state;
        this.state = newState;
        this.listeners.forEach((listener: StoreListener) => listener(newState, prevState));
    }

    setState(state: StoreUpdater) {
        const newState = (typeof state === 'function')
            ? state(this.state)
            : state;
        if (this.state === newState) {
            return;
        }

        const prevState = this.state;
        this.state = newState;
        this.listeners.forEach((listener) => listener(newState, prevState));
    }

    subscribe(listener: StoreListener) {
        if (!isFunction(listener)) {
            throw new Error('Expected listener to be a function');
        }

        // Don't subscribe same listener twice
        if (this.listeners.some((l) => l === listener)) {
            return;
        }

        this.listeners.push(listener);

        // Send initial state to new listener
        if (this.sendInitialState) {
            listener(this.state, {});
        }
    }
}

export const createStore = (
    reducer: StoreReducer,
    options: StoreOptions = {},
) => (
    new Store(reducer, options)
);
