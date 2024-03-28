import { isNumber } from '@jezvejs/types';

const DEFAULT_SEPARATOR = '.';
const dateParts = ['day', 'month', 'year'];

/**
 * Dispatches 'input' event to specified element
 * @param {HTMLInputElement} elem
 */
export const dispatchInputEvent = (elem) => {
    const event = new InputEvent('input', {
        bubbles: true,
        cancelable: true,
    });

    elem.dispatchEvent(event);
};

export const formatDatePart = (part, state) => {
    if (part.type === 'literal') {
        return part.value;
    }

    return (dateParts.includes(part.type))
        ? state[part.type]
        : '';
};

export const formatDateString = (state) => (
    state.formatParts.map((part) => (
        formatDatePart(part, state)
    )).join('')
);

export const getDateFormat = (props) => {
    const formatter = Intl.DateTimeFormat(props.locales, { dateStyle: 'short' });
    const parts = formatter.formatToParts();

    const res = {
        separator: null,
        formatParts: [],
    };

    let currentPos = 0;
    let order = 0;
    parts.forEach(({ type, value }) => {
        const part = {
            type,
            start: currentPos,
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

    res.formatMask = formatDateString({
        ...res,
        day: 'dd',
        month: 'mm',
        year: ''.padStart(res.yearRange.length, 'y'),
    });

    return res;
};

/**
 * Returns true if specified position is in range
 * @param {Number} position - position to check
 * @param {object} range - range object
 */
export const inRange = (position, range) => (
    position >= range.start && position <= range.end
);

/**
 * Returns true if specified position is in day range
 * @param {Number} position - position to check
 */
export const inDayRange = (position, state) => (
    inRange(position, state.dayRange)
);

/**
 * Returns true if specified position is in month range
 * @param {Number} position - position to check
 */
export const inMonthRange = (position, state) => (
    inRange(position, state.monthRange)
);

/**
 * Returns true if specified position is in year range
 * @param {Number} position - position to check
 */
export const inYearRange = (position, state) => (
    inRange(position, state.yearRange)
);

/**
 * Returns type of range for specified position
 * @param {Number} position - position to check
 */
export const getRangeTypeByPosition = (position, state) => {
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
export const getContentRange = (content, range) => {
    if (typeof content !== 'string') {
        throw new Error('Invalid content');
    }
    if (!range) {
        throw new Error('Invalid range');
    }

    return content.substring(range.start, range.end);
};

export const fixCursorPos = (pos, state) => {
    if (getRangeTypeByPosition(pos, state)) {
        return pos;
    }

    const [validPos] = [state.dayRange, state.monthRange, state.yearRange]
        .flatMap((range) => ([range.start, range.end]))
        .map((value) => ({ value, diff: Math.abs(value - pos) }))
        .sort((a, b) => a.diff - b.diff);

    return validPos.value;
};

export const escapeRegExp = (str) => (
    str.replaceAll(/\./g, '\\.')
);

export const removeSeparators = (str, state) => {
    const chars = state.separator.split('');
    const escaped = chars.map((char) => escapeRegExp(char)).join('');
    const expr = new RegExp(`[${escaped}]+`, 'g');

    return str.replaceAll(expr, '');
};

export const isEmptyState = (state) => (
    state.day === state.emptyState.day
    && state.month === state.emptyState.month
    && state.year === state.emptyState.year
);

export const renderValue = (state) => (
    isEmptyState(state) ? '' : formatDateString(state)
);

/** Move cursor beyond the groups separator */
export const moveCursor = (state, group) => (
    (
        state.cursorPos === state[group].end
        && state.cursorPos < state.maxLength
    )
        ? { ...state, cursorPos: state.cursorPos + state.separator.length }
        : state
);

/**
 * Move cursor one position to the right
 */
export const stepCursor = (prev) => ({
    ...prev,
    cursorPos: prev.cursorPos + 1,
    selectionEnd: prev.cursorPos + 1,
});

/** Set specified cursor position */
export const setCursor = (prev, cursorPos) => ({
    ...prev,
    cursorPos,
    selectionEnd: cursorPos,
});

/**
 * Extract day, month and year from specified string, update cursor position if needed
 *  and returns resulting state object
 *
 * @param {string} content - input string
 * @param {Objecet} state - current state object
 * @param {boolean} updateCursor - update cursor position in the returned state
 * @returns {object}
 */
export const handleExpectedContent = (content, state, updateCursor = false) => {
    if (content === '' || content === state.emptyStateValue) {
        return {
            ...state,
            ...state.emptyState,
        };
    }

    let expectedDay = getContentRange(content, state.dayRange);
    let expectedMonth = getContentRange(content, state.monthRange);
    const expectedYear = getContentRange(content, state.yearRange);

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
        && (!isNumber(yearStr) || (state.yearRange.length === 4 && yearVal < 1))
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
        if (updateCursor) {
            newState = moveCursor(newState, 'dayRange');
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
        if (updateCursor) {
            newState = moveCursor(newState, 'monthRange');
        }
    }
    // input year
    if (expectedYear !== state.year && updateCursor) {
        newState = moveCursor(newState, 'yearRange');
    }

    return {
        ...newState,
        day: expectedDay,
        month: expectedMonth,
        year: expectedYear,
    };
};

export const getInitialState = (props) => {
    const dateFormat = getDateFormat(props);
    const emptyState = {
        day: ''.padStart(dateFormat.dayRange.length, props.guideChar),
        month: ''.padStart(dateFormat.monthRange.length, props.guideChar),
        year: ''.padStart(dateFormat.yearRange.length, props.guideChar),
    };

    const res = {
        ...props,
        ...dateFormat,
        emptyState,
        cursorPos: 0,
    };
    res.emptyStateValue = formatDateString({ ...res, ...emptyState });

    return handleExpectedContent(props.value, res);
};
