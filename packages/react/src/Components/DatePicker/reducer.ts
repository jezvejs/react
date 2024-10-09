import { isSameDate } from '@jezvejs/datetime';
import { asArray, isDate } from '@jezvejs/types';

import { createSlice } from '../../utils/createSlice.ts';

import { SlideProps } from '../Slider/types.ts';

import {
    MONTH_VIEW,
    YEAR_VIEW,
    YEARRANGE_VIEW,
} from './constants.ts';
import {
    getNextDate,
    getPreviousDate,
    includesDate,
} from './helpers.ts';
import {
    DatePickerDisabledDateFilter,
    DatePickerRangePart,
    DatePickerSetSelectionParams,
    DatePickerState,
    DatePickerZoomInParams,
    DatePickerZoomOutParams,
} from './types.ts';

// Reducers
const slice = createSlice({
    show: (state: DatePickerState, visible: boolean): DatePickerState => (
        (state.visible === visible)
            ? state
            : { ...state, visible }
    ),

    setRangePart: (
        state: DatePickerState,
        rangePart: DatePickerRangePart | null,
    ): DatePickerState => (
        (state.rangePart === rangePart)
            ? state
            : { ...state, rangePart }
    ),

    setReadyState: (
        state: DatePickerState,
        update: Partial<DatePickerState>,
    ): DatePickerState => ({
        ...state,
        ...update,
        transition: null,
    }),

    resize: (
        state: DatePickerState,
        update: Partial<DatePickerState>,
    ): DatePickerState => ({
        ...state,
        ...update,
    }),

    setSliderPosition: (state: DatePickerState, sliderPosition: number): DatePickerState => ({
        ...state,
        sliderPosition,
    }),

    zoomIn: (state: DatePickerState, params: DatePickerZoomInParams): DatePickerState => {
        if (![YEAR_VIEW, YEARRANGE_VIEW].includes(state.viewType)) {
            return state;
        }

        const currentDate = (state.secondViewTransition)
            ? getPreviousDate(state.date, state.viewType)
            : state.date;

        const nextViewType = (state.viewType === YEAR_VIEW) ? MONTH_VIEW : YEAR_VIEW;
        return {
            ...state,
            nextState: {
                date: params.date,
                viewType: nextViewType,
            },
            transition: 'zoomIn',
            secondViewTransition: params.secondViewTransition,
            date: (
                (params.secondViewTransition)
                    ? getNextDate(currentDate, state.viewType)
                    : currentDate
            ),
        };
    },

    zoomOut: (state: DatePickerState, params: DatePickerZoomOutParams): DatePickerState => {
        if (![MONTH_VIEW, YEAR_VIEW].includes(state.viewType)) {
            return state;
        }

        const currentDate = (state.secondViewTransition)
            ? getPreviousDate(state.date, state.viewType)
            : state.date;

        const nextViewType = (state.viewType === MONTH_VIEW) ? YEAR_VIEW : YEARRANGE_VIEW;
        return {
            ...state,
            nextState: {
                date: (
                    (params.secondViewTransition)
                        ? getNextDate(currentDate, state.viewType)
                        : currentDate
                ),
                viewType: nextViewType,
            },
            transition: 'zoomOut',
            secondViewTransition: params.secondViewTransition,
            date: (
                (params.secondViewTransition)
                    ? getNextDate(currentDate, state.viewType)
                    : currentDate
            ),
        };
    },

    navigateToPrev: (state: DatePickerState): DatePickerState => ({
        ...state,
        nextState: {
            date: getPreviousDate(state.date, state.viewType),
            viewType: state.viewType,
        },
        transition: 'slideToPrevious',
    }),

    navigateToNext: (state: DatePickerState): DatePickerState => ({
        ...state,
        nextState: {
            date: getNextDate(state.date, state.viewType),
            viewType: state.viewType,
        },
        transition: 'slideToNext',
    }),

    finishNavigate: (state: DatePickerState): DatePickerState => ({
        ...state,
        date: state.nextState?.date ?? state.date,
        viewType: state.nextState?.viewType ?? state.viewType,
        nextState: null,
        transition: null,
    }),

    showMonth: (state: DatePickerState, date: Date): DatePickerState => ({
        ...state,
        viewType: MONTH_VIEW,
        date,
    }),

    showYear: (state: DatePickerState, date: Date): DatePickerState => ({
        ...state,
        viewType: YEAR_VIEW,
        date,
    }),

    showYearRange: (state: DatePickerState, date: Date): DatePickerState => ({
        ...state,
        viewType: YEARRANGE_VIEW,
        date,
    }),

    selectDay: (state: DatePickerState, date: Date): DatePickerState => {
        if (!state.multiple) {
            return {
                ...state,
                actDate: date,
            };
        }

        return {
            ...state,
            actDate: (!!state.actDate && includesDate(state.actDate, date))
                ? asArray(state.actDate).filter((item: Date) => !isSameDate(item, date))
                : [...asArray(state.actDate), date],
        };
    },

    startRangeSelect: (state: DatePickerState, date: Date): DatePickerState => ({
        ...state,
        curRange: { start: null, end: null },
        selRange: {
            start: date,
            end: null,
        },
    }),

    setSelection: (
        state: DatePickerState,
        options: DatePickerSetSelectionParams,
    ): DatePickerState => {
        const {
            startDate,
            endDate,
            navigateToFirst = true,
        } = options;

        if (!startDate || !isDate(startDate)) {
            return state;
        }

        const date = startDate.getTime();
        const newState = {
            ...state,
        };
        if (navigateToFirst) {
            newState.viewType = MONTH_VIEW;
            newState.date = new Date(date);
        }

        if (endDate && isDate(endDate)) {
            const dateTo = endDate.getTime();
            newState.curRange = {
                start: new Date(Math.min(date, dateTo)),
                end: new Date(Math.max(date, dateTo)),
            };
            newState.selRange = { start: null, end: null };
        } else {
            newState.actDate = new Date(date);
        }

        return newState;
    },

    clearSelection: (state: DatePickerState): DatePickerState => ({
        ...state,
        curRange: { start: null, end: null },
        selRange: { start: null, end: null },
        actDate: null,
    }),

    setDisabledDateFilter: (
        state: DatePickerState,
        disabledDateFilter: DatePickerDisabledDateFilter | null,
    ): DatePickerState => (
        (state.disabledDateFilter === disabledDateFilter)
            ? state
            : { ...state, disabledDateFilter }
    ),

    setItems: (state: DatePickerState, items: SlideProps[]) => ({
        ...state,
        items: [...items],
    }),
});

export const { actions, reducer } = slice;
