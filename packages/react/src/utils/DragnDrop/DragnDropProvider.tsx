import {
    createContext,
    ReactNode,
    useContext,
    useMemo,
    useState,
} from 'react';
import {
    createStore,
    StoreAction,
    StoreReducer,
    StoreUpdater,
} from '../Store/Store.ts';

export interface DragnDropContextStore {
    store: object,
    state: object,
    getState: () => object,
    setState: (update: StoreUpdater) => void,
    dispatch: (action: StoreAction) => void,
}

export interface DragnDropProviderProps {
    reducer: StoreReducer,
    initialState: object,
    children: ReactNode,
}

const initialContext = {
    store: {},
    state: {},
    getState: () => ({}),
    /* eslint-disable @typescript-eslint/no-unused-vars */
    setState: (_: StoreUpdater) => {},
    dispatch: (_: StoreAction) => {},
    /* eslint-enable @typescript-eslint/no-unused-vars */
};

const DragnDropContext = createContext<DragnDropContextStore>(initialContext);

export const useDragnDrop = (): DragnDropContextStore => useContext(DragnDropContext);

export function DragnDropProvider(props: DragnDropProviderProps) {
    const {
        reducer = (state) => state,
        children,
        ...options
    } = props;

    const [state, setState] = useState(options.initialState ?? {});

    const listener = (newState: object) => setState(newState);

    const store = useMemo(() => {
        const res = createStore(reducer, options);
        res.subscribe(listener);
        return res;
    }, []);

    const contextValue: DragnDropContextStore = useMemo(() => ({
        store,
        state,
        getState: () => store.getState(),
        setState: (update: StoreUpdater) => store.setState(update),
        dispatch: (action: StoreAction) => store.dispatch(action),
    }), [state]);

    return (
        <DragnDropContext.Provider value={contextValue}>
            {children}
        </DragnDropContext.Provider>
    );
}
