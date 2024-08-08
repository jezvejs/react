import {
    Context,
    createContext,
    ReactNode,
    useContext,
    useMemo,
    useState,
} from 'react';
import { createStore } from '../Store/Store.ts';

export interface DragnDropContextStore {
    store: object,
    state: object,
    getState: () => object,
    setState: (...args: any[]) => void,
    dispatch: (...args: any[]) => void,
};

export interface DragnDropProviderProps {
    reducer: (state: object, action: object) => object,
    initialState: object,
    children: ReactNode,
};

const DragnDropContext = createContext(null);

export const useDragnDrop = () => useContext(DragnDropContext);

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
        setState: (...args: any[]) => store.setState(...args),
        dispatch: (...args: any[]) => store.dispatch(...args),
    }), [state]);

    return (
        <DragnDropContext.Provider value={contextValue}>
            {children}
        </DragnDropContext.Provider>
    );
}
