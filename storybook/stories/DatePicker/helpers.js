import { asArray } from '@jezvejs/types';
import { ge } from '@jezvejs/dom';
import {
    formatDate,
    parseDateString,
} from '@jezvejs/datetime';

export const formatDates = (dates) => (
    asArray(dates).map((date) => formatDate(date)).join(' ')
);

export const formatMonthToInput = (date, inputId) => {
    const input = ge(inputId);
    if (input) {
        input.value = formatDate(date, {
            locales: ['en'],
            options: { month: 'long', year: 'numeric' },
        });
    }
};

export const formatYearToInput = (date, inputId) => {
    const input = ge(inputId);
    if (input) {
        input.value = formatDate(date, {
            locales: ['en'],
            options: { year: 'numeric' },
        });
    }
};

export const parseDateFromInput = (inputId) => {
    const input = ge(inputId);
    return parseDateString(input?.value);
};

export const formatDateRange = (range) => {
    const startFmt = formatDate(range.start);
    const endFmt = formatDate(range.end);
    return `${startFmt} - ${endFmt}`;
};

export const inDateRange = (date, { start = null, end = null }) => (
    ((start === null) || (date - start >= 0))
    && ((end === null) || (date - end <= 0))
);

const enabledRange = {
    start: new Date(Date.UTC(2010, 1, 8)),
    end: new Date(Date.UTC(2010, 1, 12)),
};

export const disabledOutsideRange = (date) => !inDateRange(date, enabledRange);
