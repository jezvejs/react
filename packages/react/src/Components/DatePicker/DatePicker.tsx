import { asArray } from '@jezvejs/types';
import {
    forwardRef,
    useMemo,
} from 'react';

import { StoreProvider } from '../../utils/Store/StoreProvider.tsx';
import { combineReducers } from '../../utils/combineReducers.ts';
import { DragnDropProvider } from '../../utils/DragnDrop/DragnDropProvider.tsx';

// Local components
import { DatePickerContainer } from './components/Container/DatePickerContainer.tsx';
import { DatePickerMonthView } from './components/MonthView/MonthView.tsx';
import { DatePickerYearView } from './components/YearView/YearView.tsx';
import { DatePickerYearRangeView } from './components/YearRangeView/YearRangeView.tsx';
import { DatePickerHeader } from './components/Header/Header.tsx';
import { DatePickerWeekDaysHeader } from './components/WeekDaysHeader/WeekDaysHeader.tsx';

import { defaultProps } from './defaultProps.ts';
import { reducer } from './reducer.ts';
import * as DatePickerHelpers from './helpers.ts';
import { DatePickerProps } from './types.ts';
import './DatePicker.scss';

export * from './types.ts';
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

type DatePickerRef = HTMLDivElement | null;

export const DatePicker = forwardRef<
    DatePickerRef,
    DatePickerProps
>((props, ref) => {
    const reducers = useMemo(() => {
        const extraReducers = asArray(props.reducers);
        return (extraReducers.length > 0)
            ? combineReducers(reducer, ...extraReducers)
            : reducer;
    }, [props.reducers]);

    const initialState = useMemo(() => (
        DatePickerHelpers.getInitialState(props, defaultProps)
    ), [props]);

    return (
        <StoreProvider
            reducer={reducers}
            initialState={initialState}
        >
            <DragnDropProvider reducer={reducers} initialState={initialState}>
                <DatePickerContainer ref={ref} {...initialState} />
            </DragnDropProvider>
        </StoreProvider>
    );
});

DatePicker.displayName = 'DatePicker';
