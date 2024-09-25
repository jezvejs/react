import type {
    StoreReducer,
    StoreState,
    StoreListener,
    StoreActionAPI,
    StoreOptions,
    StoreAction,
    StoreActionFunction,
    StoreUpdater,
} from './types.ts';

export * from './types.ts';

/** State store class */
export class Store {
    reducer: StoreReducer | null = null;

    state: StoreState = {};

    listeners: StoreListener[] = [];

    sendInitialState: boolean = true;

    storeAPI: StoreActionAPI | null = null;

    constructor(reducer: StoreReducer, options: StoreOptions = {}) {
        if (typeof reducer !== 'function') {
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
        if (typeof listener !== 'function') {
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
