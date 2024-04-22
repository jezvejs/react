import { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const DatePickerStateContext = createContext(null);
const DatePickerDispatchContext = createContext(null);

export const useDatePickerState = () => useContext(DatePickerStateContext);
export const useDatePickerDispatch = () => useContext(DatePickerDispatchContext);

export function DatePickerContextProvider(props) {
    const {
        reducer,
        initialState,
        init,
        children,
    } = props;
    const [state, dispatch] = useReducer(reducer, initialState, init);

    return (
        <DatePickerStateContext.Provider value={state}>
            <DatePickerDispatchContext.Provider value={dispatch}>
                {children}
            </DatePickerDispatchContext.Provider>
        </DatePickerStateContext.Provider>
    );
}

DatePickerContextProvider.propTypes = {
    reducer: PropTypes.func,
    initialState: PropTypes.any,
    init: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
};
