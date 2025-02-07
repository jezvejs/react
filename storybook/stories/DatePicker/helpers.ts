import { asArray, isDate } from '@jezvejs/types';
import { ge } from '@jezvejs/dom';
import {
    formatDate,
    parseDateString,
} from '@jezvejs/datetime';
import { DatePickerRange } from '@jezvejs/react';

export const formatDates = (dates: Date | Date[]) => (
    asArray(dates).map((date) => formatDate(date)).join(' ')
);

export const formatMonthToInput = (date: Date, inputId: string) => {
    const input = ge(inputId) as HTMLInputElement;
    if (input) {
        input.value = formatDate(date, {
            locales: ['en'],
            options: { month: 'long', year: 'numeric' },
        });
    }
};

export const formatYearToInput = (date: Date, inputId: string) => {
    const input = ge(inputId) as HTMLInputElement;
    if (input) {
        input.value = formatDate(date, {
            locales: ['en'],
            options: { year: 'numeric' },
        });
    }
};

export const parseDateFromInput = (inputId: string) => {
    const input = ge(inputId) as HTMLInputElement;
    return parseDateString(input?.value);
};

export const formatDateRange = (range: DatePickerRange) => {
    const startFmt = (range.start) ? formatDate(range.start) : '';
    const endFmt = (range.end) ? formatDate(range.end) : '';
    return `${startFmt} - ${endFmt}`;
};

export const inDateRange = (date: Date, { start = null, end = null }: DatePickerRange) => (
    ((start === null) || (isDate(start) && (date.getTime() >= start.getTime())))
    && ((end === null) || (isDate(end) && (date.getTime() <= end.getTime())))
);

const enabledRange = {
    start: new Date(Date.UTC(2010, 1, 8)),
    end: new Date(Date.UTC(2010, 1, 12)),
};

export const disabledOutsideRange = (date: Date) => !inDateRange(date, enabledRange);
