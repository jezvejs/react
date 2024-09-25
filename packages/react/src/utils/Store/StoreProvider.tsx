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
    StoreUpdater,
} from './types.ts';

const StoreContext = createContext<StoreProviderContext | null>(null);

export const useStore = () => useContext(StoreContext);

export function StoreProvider(props: StoreProviderProps) {
    const {
        reducer,
        children,
        ...options
    } = props;

    const [state, setState] = useState(options.initialState ?? {});

    const listener = (newState: StoreUpdater) => setState(newState);

    const store = useMemo(() => {
        const res = createStore(reducer, options);
        res.subscribe(listener);
        return res;
    }, []);

    const contextValue = useMemo(() => ({
        store,
        state,
        getState: () => store.getState(),
        setState: (update: StoreUpdater) => store.setState(update),
        dispatch: (action: StoreAction) => store.dispatch(action),
    }), [state]);

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
}
