import { asArray } from '@jezvejs/types';
import {
    forwardRef,
    useMemo,
} from 'react';

import { StoreProvider } from '../../utils/Store/StoreProvider.jsx';
import { combineReducers } from '../../utils/combineReducers.js';

// Local components
import { DatePickerContainer } from './components/Container/DatePickerContainer.jsx';
import { DatePickerMonthView } from './components/MonthView/MonthView.jsx';
import { DatePickerYearView } from './components/YearView/YearView.jsx';
import { DatePickerYearRangeView } from './components/YearRangeView/YearRangeView.jsx';
import { DatePickerHeader } from './components/Header/Header.jsx';
import { DatePickerWeekDaysHeader } from './components/WeekDaysHeader/WeekDaysHeader.jsx';

import { defaultProps } from './defaultProps.js';
import { reducer } from './reducer.js';
import * as DatePickerHelpers from './helpers.js';
import './DatePicker.scss';

export {
    // Child components
    DatePickerHeader,
    DatePickerWeekDaysHeader,
    DatePickerMonthView,
    DatePickerYearView,
    DatePickerYearRangeView,
    // utils
    DatePickerHelpers,
};

// eslint-disable-next-line react/display-name
export const DatePicker = forwardRef((props, ref) => {
    const reducers = useMemo(() => {
        const extraReducers = asArray(props.reducers);
        return (extraReducers.length > 0)
            ? combineReducers(reducer, ...extraReducers)
            : reducer;
    }, [props.reducers]);

    const initialState = (
        DatePickerHelpers.getInitialState(props, defaultProps)
    );

    return (
        <StoreProvider
            reducer={reducers}
            initialState={initialState}
        >
            <DatePickerContainer ref={ref} {...initialState} />
        </StoreProvider>
    );
});

DatePicker.propTypes = {
    ...DatePickerContainer.propTypes,
};
