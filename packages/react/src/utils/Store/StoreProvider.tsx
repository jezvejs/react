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
    StoreReducer,
    StoreState,
    StoreUpdater,
} from './Store.ts';

export interface StoreProviderProps {
    reducer: StoreReducer,
    initialState: StoreState,
    children: ReactNode,
}

export interface StoreProviderContext {
    store: Store,
    state: StoreState,
    getState: () => StoreState,
    setState: (state: StoreUpdater) => void,
    dispatch: (action: StoreAction) => void,
}

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
