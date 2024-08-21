import { isNumber } from '@jezvejs/types';
import {
    DateFormatPartType,
    DateFormatType,
    DateInputProps,
    DateInputState,
    DateRange,
} from './types.ts';

const DEFAULT_SEPARATOR = '.';

/**
 * Dispatches 'input' event to specified element
 * @param {HTMLInputElement} elem
 */
export const dispatchInputEvent = (elem: HTMLInputElement) => {
    const event = new InputEvent('input', {
        bubbles: true,
        cancelable: true,
    });

    elem.dispatchEvent(event);
};

export const formatDatePart = (part: DateFormatPartType, state: DateInputState): string => {
    if (part.type === 'literal') {
        return part.value ?? '';
    }

    if (part.type === 'day') {
        return state.day ?? '';
    }
    if (part.type === 'month') {
        return state.month ?? '';
    }
    if (part.type === 'year') {
        return state.year ?? '';
    }

    return '';
};

export const formatDateString = (state: DateInputState): string => (
    state.formatParts.map((part) => (
        formatDatePart(part, state)
    )).join('')
);

export const getDateFormat = (props: { locales?: string | string[]; }): DateFormatType => {
    const formatter = Intl.DateTimeFormat(props.locales ?? [], { dateStyle: 'short' });
    const parts = formatter.formatToParts();

    const res: DateFormatType = {
        separator: null,
        formatParts: [],
        formatMask: null,
    };

    let currentPos = 0;
    let order = 0;
    parts.forEach(({ type, value }) => {
        const part: DateFormatPartType = {
            type,
            start: currentPos,
            end: currentPos,
            length: (type === 'day' || type === 'month') ? 2 : value.length,
        };
        part.end = part.start + part.length;
        currentPos += part.length;

        if (type === 'day') {
            res.dayRange = { ...part, order };
            order += 1;
        }
        if (type === 'month') {
            res.monthRange = { ...part, order };
            order += 1;
        }
        if (type === 'year') {
            res.yearRange = { ...part, order };
            order += 1;
        }
        if (type === 'literal') {
            if (!res.separator) {
                res.separator = value;
            }
            part.value = value;
        }

        res.formatParts.push(part);
    });

    if (!res.separator) {
        res.separator = DEFAULT_SEPARATOR;
    }

    const maskProps: DateInputState = {
        ...res,
        day: 'dd',
        month: 'mm',
        year: ''.padStart(res.yearRange?.length ?? 0, 'y'),
        emptyState: {
            day: 'dd',
            month: 'mm',
            year: ''.padStart(res.yearRange?.length ?? 0, 'y'),
        },
        maxLength: 0,
        cursorPos: 0,
        selectionEnd: 0,
        emptyStateValue: '',
    };

    maskProps.formatMask = formatDateString(maskProps);
    maskProps.maxLength = maskProps.formatMask.length;

    return maskProps;
};

/**
 * Returns true if specified position is in range
 * @param {number} position - position to check
 * @param {object} range - range object
 */
export const inRange = (position: number, range: DateRange | DateFormatPartType): boolean => (
    range
    && position >= range.start
    && position <= range.end
);

/**
 * Returns true if specified position is in day range
 * @param {number} position - position to check
 */
export const inDayRange = (position: number, state: DateInputState): boolean => (
    inRange(position, state.dayRange as DateFormatPartType)
);

/**
 * Returns true if specified position is in month range
 * @param {number} position - position to check
 */
export const inMonthRange = (position: number, state: DateInputState): boolean => (
    inRange(position, state.monthRange as DateFormatPartType)
);

/**
 * Returns true if specified position is in year range
 * @param {number} position - position to check
 */
export const inYearRange = (position: number, state: DateInputState): boolean => (
    inRange(position, state.yearRange as DateFormatPartType)
);

/**
 * Returns type of range for specified position
 * @param {number} position - position to check
 */
export const getRangeTypeByPosition = (position: number, state: DateInputState) => {
    if (inDayRange(position, state)) {
        return 'day';
    }
    if (inMonthRange(position, state)) {
        return 'month';
    }
    if (inYearRange(position, state)) {
        return 'year';
    }

    return null;
};

/**
 * Returns string value for specified range
 *
 * @param {string} content - content string
 * @param {object} range - range object
 * @returns {string}
 */
export const getContentRange = (content: string, range: DateRange): string => {
    const srcContent = content ?? '';
    if (!range) {
        throw new Error('Invalid range');
    }

    return srcContent.substring(range.start, range.end);
};

export const fixCursorPos = (pos: number, state: DateInputState): number => {
    if (getRangeTypeByPosition(pos, state)) {
        return pos;
    }

    const [validPos] = [state.dayRange, state.monthRange, state.yearRange]
        .flatMap((range?: DateFormatPartType) => ([range?.start ?? 0, range?.end ?? 0]))
        .map((value) => ({ value, diff: Math.abs(value - pos) }))
        .sort((a, b) => a.diff - b.diff);

    return validPos.value;
};

export const escapeRegExp = (str: string): string => (
    str.replaceAll(/\./g, '\\.')
);

export const removeSeparators = (str: string, state: DateInputState): string => {
    const separator = state.separator ?? null;
    if (separator === null) {
        return str;
    }
    const chars = separator.split('');
    const escaped = chars.map((char) => escapeRegExp(char)).join('');
    const expr = new RegExp(`[${escaped}]+`, 'g');

    return str.replaceAll(expr, '');
};

export const isEmptyState = (state: DateInputState) => (
    state.day === state.emptyState.day
    && state.month === state.emptyState.month
    && state.year === state.emptyState.year
);

export const renderValue = (state: DateInputState) => (
    isEmptyState(state) ? '' : formatDateString(state)
);

/** Move cursor beyond the groups separator */
export const moveCursor = (state: DateInputState, range: DateFormatPartType) => (
    (
        state.cursorPos === range.end
        && state.cursorPos < state.maxLength
    )
        ? { ...state, cursorPos: state.cursorPos + (state.separator ?? '').length }
        : state
);

/**
 * Move cursor one position to the right
 */
export const stepCursor = (prev: DateInputState): DateInputState => ({
    ...prev,
    cursorPos: prev.cursorPos + 1,
    selectionEnd: prev.cursorPos + 1,
});

/** Set specified cursor position */
export const setCursor = (prev: DateInputState, cursorPos: number): DateInputState => ({
    ...prev,
    cursorPos,
    selectionEnd: cursorPos,
});

/**
 * Extract day, month and year from specified string, update cursor position if needed
 *  and returns resulting state object
 *
 * @param {string} content - input string
 * @param {DateInputState} state - current state object
 * @param {boolean} updateCursor - update cursor position in the returned state
 * @returns {object}
 */
export const handleExpectedContent = (
    content: string,
    state: DateInputState,
    updateCursor: boolean = false,
): DateInputState => {
    const expContent = content ?? '';
    if (expContent === '' || expContent === state.emptyStateValue) {
        return {
            ...state,
            ...state.emptyState,
        };
    }

    let expectedDay = getContentRange(expContent, state.dayRange!);
    let expectedMonth = getContentRange(expContent, state.monthRange!);
    const expectedYear = getContentRange(expContent, state.yearRange!);

    const search = new RegExp(`${state.guideChar}`, 'g');
    const testExp = new RegExp(`^[0-9${state.guideChar}]+$`);

    const dayStr = expectedDay.replaceAll(search, '');
    const dayVal = parseInt(dayStr, 10);
    if (dayStr.length > 0 && (!isNumber(dayStr) || !(dayVal >= 0 && dayVal <= 31))) {
        return state;
    }
    if (dayStr.length > 0 && !testExp.test(dayStr)) {
        return state;
    }
    if (dayStr.length === 2 && dayVal === 0) {
        return state;
    }

    const monthStr = expectedMonth.replaceAll(search, '');
    const monthVal = parseInt(monthStr, 10);
    if (monthStr.length > 0 && (!isNumber(monthStr) || !(monthVal >= 0 && monthVal <= 12))) {
        return state;
    }
    if (monthStr.length > 0 && !testExp.test(monthStr)) {
        return state;
    }
    if (monthStr.length === 2 && monthVal === 0) {
        return state;
    }

    const yearStr = expectedYear.replaceAll(search, '');
    const yearVal = parseInt(yearStr, 10);
    if (
        yearStr.length > 0
        && (!isNumber(yearStr) || (state.yearRange?.length === 4 && yearVal < 1))
    ) {
        return state;
    }
    if (yearStr.length > 0 && !testExp.test(yearStr)) {
        return state;
    }

    let newState = {
        ...state,
    };

    // input day
    if (expectedDay !== state.day) {
        const firstChar = expectedDay.substring(0, 1);
        if (
            firstChar !== state.guideChar
            && firstChar !== '0'
            && dayVal < 10
            && dayVal * 10 > 31
        ) {
            expectedDay = `0${dayVal}`;
            if (updateCursor) {
                newState = stepCursor(newState);
            }
        }
        if (updateCursor && newState.dayRange) {
            newState = moveCursor(newState, newState.dayRange);
        }
    }
    // input month
    if (expectedMonth !== state.month) {
        const firstChar = expectedMonth.substring(0, 1);
        if (
            firstChar !== state.guideChar
            && firstChar !== '0'
            && monthVal < 10
            && monthVal * 10 > 12
        ) {
            expectedMonth = `0${monthVal}`;
            if (updateCursor) {
                newState = stepCursor(newState);
            }
        }
        if (updateCursor && newState.monthRange) {
            newState = moveCursor(newState, newState.monthRange);
        }
    }
    // input year
    if (expectedYear !== state.year && updateCursor && newState.yearRange) {
        newState = moveCursor(newState, newState.yearRange);
    }

    return {
        ...newState,
        day: expectedDay,
        month: expectedMonth,
        year: expectedYear,
    };
};

export const getInitialState = (props: DateInputProps): DateInputState => {
    const dateFormat = getDateFormat(props);
    const emptyState = {
        day: ''.padStart(dateFormat.dayRange?.length ?? 0, props.guideChar),
        month: ''.padStart(dateFormat.monthRange?.length ?? 0, props.guideChar),
        year: ''.padStart(dateFormat.yearRange?.length ?? 0, props.guideChar),
    };

    const res: DateInputState = {
        ...props,
        ...dateFormat,
        emptyState,
        maxLength: dateFormat.formatMask?.length ?? 0,
        cursorPos: 0,
        selectionEnd: 0,
        emptyStateValue: '',
        day: '',
        month: '',
        year: '',
    };
    res.emptyStateValue = formatDateString({ ...res, ...emptyState });

    return handleExpectedContent(props.value ?? '', res);
};
