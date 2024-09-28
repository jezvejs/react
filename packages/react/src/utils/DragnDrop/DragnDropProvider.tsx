import {
    createContext,
    ReactNode,
    useContext,
    useMemo,
    useState,
} from 'react';

import {
    createStore,
    Store,
    StoreAction,
    StoreProviderContext,
    StoreReducer,
    StoreState,
    StoreUpdater,
} from '../Store/Store.ts';

export interface DragnDropContextStore<State extends StoreState = StoreState> {
    store: Store | object,
    state: State,
    getState: () => State,
    setState: (update: StoreUpdater<State>) => void,
    dispatch: (action: StoreAction) => void,
}

export interface DragnDropProviderProps<State extends StoreState = StoreState> {
    reducer?: StoreReducer<State>,
    initialState: State,
    children: ReactNode,
}

export const initialContext: StoreProviderContext = {
    store: {},
    state: {},
    getState: () => ({}),
    /* eslint-disable @typescript-eslint/no-unused-vars */
    setState: (_: StoreUpdater) => { },
    dispatch: (_: StoreAction) => { },
    /* eslint-enable @typescript-eslint/no-unused-vars */
};

const DragnDropContext = createContext<DragnDropContextStore>(initialContext);

export function useDragnDrop<
    State extends StoreState = StoreState,
>(): DragnDropContextStore<State> {
    return useContext(DragnDropContext) as StoreProviderContext<State>;
}

export function DragnDropProvider<State extends StoreState = StoreState>(
    props: DragnDropProviderProps<State>,
) {
    const {
        reducer = (state: State): State => state,
        children,
        ...options
    } = props;

    const [state, setState] = useState<State>(options.initialState ?? {});

    const listener = (newState: State) => setState(newState);

    const store = useMemo(() => {
        const res = createStore<State>(reducer, options);
        res.subscribe(listener);
        return res;
    }, []);

    const contextValue = useMemo(() => ({
        store,
        state,
        getState: () => store.getState(),
        setState: (update: StoreUpdater<State>) => store.setState(update),
        dispatch: (action: StoreAction) => store.dispatch(action),
    }), [state]);

    return (
        <DragnDropContext.Provider value={contextValue as StoreProviderContext}>
            {children}
        </DragnDropContext.Provider>
    );
}
