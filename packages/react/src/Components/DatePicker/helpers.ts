import { getLongMonthName, isSameDate } from '@jezvejs/datetime';
import { asArray, isDate, isFunction } from '@jezvejs/types';

import {
    viewTypesMap,
    MONTH_VIEW,
    YEAR_VIEW,
    YEARRANGE_VIEW,
    YEAR_RANGE_LENGTH,
} from './constants.ts';
import {
    DatePickerHeaderTitleParam,
    DatePickerProps,
    DatePickerRange,
    DatePickerState,
    DatePickerViewType,
} from './types.ts';

export const toCSSValue = (val: number): number => (+val.toFixed(4));

/** Returns initial state object for specified props */
export const getInitialState = (props: DatePickerProps, defaultProps: DatePickerProps) => {
    const mode = props.mode ?? defaultProps?.mode;
    if (!(mode in viewTypesMap)) {
        throw new Error('Invalid mode');
    }

    const res: DatePickerState = {
        ...(defaultProps ?? {}),
        ...props,
        visible: !!props.inline || props.visible,
        fixed: false,
        viewType: viewTypesMap[mode] as DatePickerViewType,
        date: isDate(props.date) ? props.date : new Date(),
        curRange: { start: null, end: null },
        selRange: { start: null, end: null },
        actDate: null,
        transition: null,
        secondViewTransition: false,
        waitingForAnimation: false,
        position: {
            ...(defaultProps?.position ?? {}),
            ...(props.position ?? {}),
        },
        components: {
            ...(defaultProps?.components ?? {}),
            ...props.components,
        },
    };

    return res;
};

/** Returns previous date for specified view type */
export const getPrevViewDate = (date: Date, viewType: DatePickerViewType) => {
    if (!isDate(date)) {
        throw new Error('Invalid date');
    }

    const typeMap = {
        [MONTH_VIEW]: (d: Date) => (new Date(d.getFullYear(), d.getMonth() - 1, 1)),
        [YEAR_VIEW]: (d: Date) => (new Date(d.getFullYear() - 1, 1, 1)),
        [YEARRANGE_VIEW]: (d: Date) => (new Date(d.getFullYear() - YEAR_RANGE_LENGTH, 1, 1)),
    };

    if (!isFunction(typeMap[viewType])) {
        throw new Error('Invalid view type');
    }

    return typeMap[viewType](date);
};

/** Returns next date for specified view type */
export const getNextViewDate = (date: Date, viewType: DatePickerViewType) => {
    if (!isDate(date)) {
        throw new Error('Invalid date');
    }

    const typeMap = {
        [MONTH_VIEW]: (d: Date) => (new Date(d.getFullYear(), d.getMonth() + 1, 1)),
        [YEAR_VIEW]: (d: Date) => (new Date(d.getFullYear() + 1, 1, 1)),
        [YEARRANGE_VIEW]: (d: Date) => (new Date(d.getFullYear() + YEAR_RANGE_LENGTH, 1, 1)),
    };

    if (!isFunction(typeMap[viewType])) {
        throw new Error('Invalid view type');
    }

    return typeMap[viewType](date);
};

/** Returns true if array includes Date object for same date as specified */
export const includesDate = (arr: Date | Date[], date: Date) => (
    asArray(arr).some((item: Date) => isSameDate(item, date))
);

/** Returns width of screen considering orientation */
export const getScreenWidth = (): number => {
    const { angle } = window.screen.orientation;
    const { width, height } = window.screen;
    return (angle === 270 || angle === 90)
        ? Math.max(width, height)
        : Math.min(width, height);
};

/** Returns header title string for specified view state */
export const getHeaderTitle = (state: DatePickerHeaderTitleParam): string => {
    const { viewType, date, locales } = state;
    const rYear = date.getFullYear();

    if (viewType === MONTH_VIEW) {
        const monthLong = getLongMonthName(date, locales);
        return `${monthLong} ${rYear}`;
    }

    if (viewType === YEAR_VIEW) {
        return rYear.toString();
    }

    if (viewType === YEARRANGE_VIEW) {
        const startYear = rYear - (rYear % 10) - 1;
        return `${startYear + 1}-${startYear + YEAR_RANGE_LENGTH}`;
    }

    throw new Error('Invalid view type');
};

/** Returns offsetHeight for specified component */
export const getComponentHeight = (component: HTMLElement): number => (
    component?.offsetHeight ?? 0
);

/**
 * Check specified date is in range
 * @param {Date} date - date to check
 * @param {object} range - date range object
 */
export const inRange = (date: Date, range: DatePickerRange): boolean => {
    if (
        !isDate(date)
        || !isDate(range?.start)
        || !isDate(range?.end)
    ) {
        return false;
    }

    const time = date?.getTime() ?? 0;
    const rangeStart = range.start?.getTime() ?? 0;
    const rangeEnd = range.end?.getTime() ?? 0;

    return (time - rangeStart >= 0 && time - rangeEnd <= 0);
};
