import { getLongMonthName, isSameDate } from '@jezvejs/datetime';
import { asArray, isDate, isFunction } from '@jezvejs/types';

import {
    viewTypesMap,
    MONTH_VIEW,
    YEAR_VIEW,
    YEARRANGE_VIEW,
    YEAR_RANGE_LENGTH,
    slideTransitions,
    zoomTransitions,
} from './constants.ts';
import {
    DatePickerHeaderTitleParam,
    DatePickerProps,
    DatePickerRange,
    DatePickerState,
    DatePickerViewType,
} from './types.ts';
import { Rect } from '../../utils/types.ts';

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
        slideIndex: 0,
        sliderPosition: 0,
        width: 0,
        height: 0,
        next: null,
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

/**
 * Returns offsetWidth for specified element
 * @param {HTMLElement|null} elem
 * @returns {number}
 */
export const getWidth = (elem: HTMLElement | null): number => (
    elem?.offsetWidth ?? 0
);

/**
 * Returns offsetHeight for specified element
 * @param {HTMLElement|null} elem
 * @returns {number}
 */
export const getHeight = (elem: HTMLElement | null): number => (
    elem?.offsetHeight ?? 0
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

/**
 * Returns true if view type of next state is the same as current
 * @param {DatePickerState} state
 * @returns {boolean}
 */
export const isSameNextViewType = (state: DatePickerState): boolean => (
    !!state.next
    && state.next.viewType === state.viewType
);

/**
 * Returns true if date of next state is the same as current
 * @param {DatePickerState} state
 * @returns {boolean}
 */
export const isSameNextDate = (state: DatePickerState): boolean => (
    !!state.next
    && isSameDate(state.next.date, state.date)
);

/**
 * Returns true if current transition is 'slideToPrevious' or 'slideToNext'
 * @param {DatePickerState} state
 * @returns {boolean}
 */
export const isSlideTransition = (state: DatePickerState): boolean => (
    isSameNextViewType(state)
    && !!state.transition
    && slideTransitions.includes(state.transition)
);

/**
 * Returns true if current transition is 'zoomIn' or 'zoomOut'
 * @param {DatePickerState} state
 * @returns {boolean}
 */
export const isZoomTransition = (state: DatePickerState): boolean => (
    /* isSameNextDate(state)
    && */
    !!state.transition
    && zoomTransitions.includes(state.transition)
);

export interface DatePickerViewDates {
    previous: Date;
    current: Date;
    second: Date;
    next: Date;
}

export const getViewDates = (state: DatePickerState): DatePickerViewDates => {
    let prevDate = getPrevViewDate(state.date, state.viewType);
    if (state.doubleView && state.secondViewTransition) {
        prevDate = getPrevViewDate(prevDate, state.viewType);
    }

    const currentDate = (state.doubleView && state.secondViewTransition)
        ? getPrevViewDate(state.date, state.viewType)
        : state.date;

    const secondDate = (state.secondViewTransition)
        ? state.date
        : getNextViewDate(state.date, state.viewType);

    let nextDate = getNextViewDate(state.date, state.viewType);
    if (state.doubleView && !state.secondViewTransition) {
        nextDate = getNextViewDate(nextDate, state.viewType);
    }

    return {
        previous: prevDate,
        current: currentDate,
        second: secondDate,
        next: nextDate,
    };
};

/**
 * Returns matrix transform string for specified array
 * @param {Array} transform
 * @returns {string}
 */
export const formatMatrixTransform = (
    transform: number | number[] | string | string[],
): string => (
    `matrix(${asArray(transform).map(toCSSValue).join(', ')})`
);

/**
 * Returns all child item elements for specified view
 * @param {HTMLElement|null} elem
 * @returns {HTMLElement[]}
 */
export const getViewItems = (elem: HTMLElement | null): HTMLElement[] => (
    Array.from(elem?.querySelectorAll?.('.dp__cell') ?? [])
);

/**
 * Returns Date object for specified view item element or null in case of invalid item
 * @param {HTMLElement|null} elem
 * @returns {Date|null}
 */
export const getViewItemDate = (elem: HTMLElement | null): Date | null => {
    const time = parseInt(elem?.dataset?.date ?? '', 10);
    return (time) ? (new Date(time)) : null;
};

/**
 * Returns dimensions object for specified view item element
 * @param {HTMLElement|null} elem
 * @param {DatePickerState} state
 * @returns {Rect|null}
 */
export const getViewItemBox = (elem: HTMLElement | null, state: DatePickerState): Rect | null => {
    if (!elem) {
        return null;
    }

    const { vertical, secondViewTransition } = state;

    const x = (secondViewTransition && !vertical)
        ? (elem.offsetLeft - elem.offsetWidth)
        : elem.offsetLeft;

    const y = (secondViewTransition && vertical)
        ? (elem.offsetTop - elem.offsetHeight)
        : elem.offsetTop;

    const width = (secondViewTransition && !vertical)
        ? (elem.offsetWidth * 2)
        : elem.offsetWidth;
    const height = (secondViewTransition && vertical)
        ? (elem.offsetHeight * 2)
        : elem.offsetHeight;

    return {
        x,
        y,
        width,
        height,
    };
};
