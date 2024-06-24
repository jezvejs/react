import { getLongMonthName, isSameDate } from '@jezvejs/datetime';
import { asArray, isDate, isFunction } from '@jezvejs/types';

import {
    viewTypesMap,
    MONTH_VIEW,
    YEAR_VIEW,
    YEARRANGE_VIEW,
    YEAR_RANGE_LENGTH,
} from './constants.js';

export const toCSSValue = (val) => (+val.toFixed(4));

/** Returns initial state object for specified props */
export const getInitialState = (props, defaultProps) => {
    const { mode } = props;
    if (!(mode in viewTypesMap)) {
        throw new Error('Invalid mode');
    }

    const res = {
        ...(defaultProps ?? {}),
        ...props,
        visible: !!props.inline,
        fixed: false,
        viewType: viewTypesMap[mode],
        date: isDate(props.date) ? props.date : new Date(),
        curRange: { start: null, end: null },
        selRange: { start: null, end: null },
        actDate: null,
        transition: null,
        secondViewTransition: false,
        position: {
            ...(props.position ?? {}),
        },
        components: {
            ...(defaultProps?.components ?? {}),
            ...props.components,
        },
    };

    return res;
};

/** Compares order of view types and returns result */
export const compareViewTypes = (a, b) => {
    const typeMap = {
        [MONTH_VIEW]: 1,
        [YEAR_VIEW]: 2,
        [YEARRANGE_VIEW]: 3,
    };

    if (!(a in typeMap) || !(b in typeMap)) {
        throw new Error('Invalid view type');
    }

    return typeMap[a] - typeMap[b];
};

/** Returns previous date for specified view type */
export const getPrevViewDate = (date, viewType) => {
    if (!isDate(date)) {
        throw new Error('Invalid date');
    }

    const typeMap = {
        [MONTH_VIEW]: (d) => (new Date(d.getFullYear(), d.getMonth() - 1, 1)),
        [YEAR_VIEW]: (d) => (new Date(d.getFullYear() - 1, 1, 1)),
        [YEARRANGE_VIEW]: (d) => (new Date(d.getFullYear() - YEAR_RANGE_LENGTH, 1, 1)),
    };

    if (!isFunction(typeMap[viewType])) {
        throw new Error('Invalid view type');
    }

    return typeMap[viewType](date);
};

/** Returns next date for specified view type */
export const getNextViewDate = (date, viewType) => {
    if (!isDate(date)) {
        throw new Error('Invalid date');
    }

    const typeMap = {
        [MONTH_VIEW]: (d) => (new Date(d.getFullYear(), d.getMonth() + 1, 1)),
        [YEAR_VIEW]: (d) => (new Date(d.getFullYear() + 1, 1, 1)),
        [YEARRANGE_VIEW]: (d) => (new Date(d.getFullYear() + YEAR_RANGE_LENGTH, 1, 1)),
    };

    if (!isFunction(typeMap[viewType])) {
        throw new Error('Invalid view type');
    }

    return typeMap[viewType](date);
};

/** Returns true if array includes Date object for same date as specified */
export const includesDate = (arr, date) => (
    asArray(arr).some((item) => isSameDate(item, date))
);

/** Returns width of screen considering orientation */
export const getScreenWidth = () => {
    const { angle } = window.screen.orientation;
    const { width, height } = window.screen;
    return (angle === 270 || angle === 90)
        ? Math.max(width, height)
        : Math.min(width, height);
};

/** Returns header title string for specified view state */
export const getHeaderTitle = (state) => {
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
export const getComponentHeight = (component) => (
    component?.offsetHeight ?? 0
);
