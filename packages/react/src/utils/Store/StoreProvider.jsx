import {
    createContext,
    useContext,
    useMemo,
    useState,
} from 'react';
import PropTypes from 'prop-types';
import { createStore } from './Store.js';

const StoreContext = createContext(null);

export const useStore = () => useContext(StoreContext);

export function StoreProvider(props) {
    const {
        reducer,
        children,
        ...options
    } = props;

    const [state, setState] = useState(options.initialState ?? {});

    const listener = (newState) => setState(newState);

    const store = useMemo(() => {
        const res = createStore(reducer, options);
        res.subscribe(listener);
        return res;
    }, []);

    const contextValue = useMemo(() => ({
        store,
        state,
        getState: () => store.getState(),
        dispatch: (...args) => store.dispatch(...args),
    }), [state]);

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
}

StoreProvider.propTypes = {
    reducer: PropTypes.func,
    options: PropTypes.any,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
};
