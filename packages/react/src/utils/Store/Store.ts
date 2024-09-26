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
export class Store<State extends StoreState = StoreState> {
    reducer: StoreReducer<State> | null = null;

    state: State | object = {};

    listeners: StoreListener<State>[] = [];

    sendInitialState: boolean = true;

    storeAPI: StoreActionAPI<State> | null = null;

    constructor(reducer: StoreReducer<State>, options: StoreOptions<State> = {}) {
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

    getState(): State {
        return this.state as State;
    }

    dispatch(action: StoreAction | StoreActionFunction) {
        if (typeof action === 'function') {
            action(this.storeAPI);
            return;
        }

        if (!this.reducer) {
            return;
        }

        const newState = this.reducer(this.getState(), action);
        const prevState = this.getState();
        this.state = newState;
        this.listeners.forEach((listener: StoreListener<State>) => listener(newState, prevState));
    }

    setState(state: StoreUpdater<State>) {
        const newState = (typeof state === 'function')
            ? state(this.getState())
            : state;
        if (this.state === newState) {
            return;
        }

        const prevState = this.getState();
        this.state = newState;
        this.listeners.forEach((listener) => listener(newState, prevState));
    }

    subscribe(listener: StoreListener<State>) {
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
            listener(this.getState(), {} as State);
        }
    }
}

export function createStore<State extends StoreState = StoreState>(
    reducer: StoreReducer<State>,
    options: StoreOptions<State> = {},
) {
    return new Store<State>(reducer, options);
}
