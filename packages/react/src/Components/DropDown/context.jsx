import { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const DropDownStateContext = createContext(null);
const DropDownDispatchContext = createContext(null);

export const useDropDownState = () => useContext(DropDownStateContext);
export const useDropDownDispatch = () => useContext(DropDownDispatchContext);

export function DropDownContextProvider(props) {
    const {
        reducer,
        initialState,
        init,
        children,
    } = props;
    const [state, dispatch] = useReducer(reducer, initialState, init);

    return (
        <DropDownStateContext.Provider value={state}>
            <DropDownDispatchContext.Provider value={dispatch}>
                {children}
            </DropDownDispatchContext.Provider>
        </DropDownStateContext.Provider>
    );
}

DropDownContextProvider.propTypes = {
    reducer: PropTypes.func,
    initialState: PropTypes.any,
    init: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
};
