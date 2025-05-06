import {
    createContext,
    useContext,
    useMemo,
    useState,
} from 'react';
import { createStore } from './Store.ts';
import type {
    StoreAction,
    StoreProviderContext,
    StoreProviderProps,
    StoreState,
    StoreUpdater,
} from './types.ts';

const initialContext = {
    store: {},
    state: {},
    getState: () => ({}),
    setState: () => { },
    dispatch: () => { },
};

const StoreContext = createContext<StoreProviderContext>(initialContext);

export function useStore<State extends StoreState = StoreState>() {
    return useContext(StoreContext) as unknown as StoreProviderContext<State>;
}

export function StoreProvider<State extends StoreState = StoreState>(
    props: StoreProviderProps<State>,
) {
    const {
        reducer,
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
        <StoreContext.Provider value={contextValue as StoreProviderContext}>
            {children}
        </StoreContext.Provider>
    );
}
