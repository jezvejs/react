import {
    createContext,
    useContext,
    useMemo,
    useState,
} from 'react';
import PropTypes from 'prop-types';
import { createStore } from '../Store/Store.js';

const DragnDropContext = createContext(null);

export const useDragnDrop = () => useContext(DragnDropContext);

export function DragnDropProvider(props) {
    const {
        reducer = (state) => state,
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
        setState: (...args) => store.setState(...args),
        dispatch: (...args) => store.dispatch(...args),
    }), [state]);

    return (
        <DragnDropContext.Provider value={contextValue}>
            {children}
        </DragnDropContext.Provider>
    );
}

DragnDropProvider.propTypes = {
    reducer: PropTypes.func,
    initialState: PropTypes.object,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
};
