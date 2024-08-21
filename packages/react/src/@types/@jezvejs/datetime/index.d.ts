declare module '@jezvejs/datetime' {
    declare const DAYS_IN_WEEK = 7;
    declare const DEFAULT_FIRST_DAY_OF_WEEK = 7;
    declare const MONTHS_COUNT = 12;

    declare type LocalesType = string | string[];

    declare interface FormatDateParam {
        locales?: LocalesType;
        options?: object;
    }

    /** Returns fixed date locale string without RTL characters */
    declare const formatDate: (date, params: FormatDateParam = {}) => string;

    declare interface DateFormatPartType {
        type: string;
        start: number;
        end: number;
        length: number;
        value?: string;
        order?: number;
    }

    declare interface DateFormatType {
        dayIndex: number,
        monthIndex: number,
        yearIndex: number,
        yearLength: number,
        separator: string | null;
        formatParts: DateFormatPartType[];
        dayRange?: DateFormatPartType;
        monthRange?: DateFormatPartType;
        yearRange?: DateFormatPartType;
        formatMask: string | null;
    }

    declare type GetLocaleDateFormatParam = FormatDateParam;

    /** Returns object with positions of date parts and separator */
    declare const getLocaleDateFormat: (params: GetLocaleDateFormatParam = {}) => DateFormatType;

    declare interface ParseDateStringParam extends GetLocaleDateFormatParam {
        fixShortYear?: boolean;
    }

    /** Returns date parsed from string accodring to specified locale */
    declare const parseDateString: (str: string, params: ParseDateStringParam = {}) => Date | NaN;

    /** Returns true if specified argument is valid date string for current locale */
    declare const isValidDateString: (str: string, params: ParseDateStringParam = {}) => boolean;

    /** Returns a new date shifted by the specified number of years */
    declare const shiftYear: (date: Data, shift: number) => Data;

    /** Returns a new date shifted by the specified number of months */
    declare const shiftMonth: (date: Data, shift: number) => Data;

    /** Returns a new date shifted by the specified number of days */
    declare const shiftDate: (date: Date, shift: number) => Data;

    /**
     * Returns the ISO week of the date
     *
     * @param {number} timestamp
     * @returns {number}
     */
    declare const getWeek: (timestamp: number) => number;

    /**
     * Returns last day in month of the specified date
     *
     * @param {Date} date
     * @returns {Date}
     */
    declare const getLastDayOfMonth: (date: Date) => Date;

    /**
     * Return count of days in month of the specified date
     */
    declare const getDaysInMonth: (date: Date) => number;

    /**
     * Return monday based(0 - monday, 6 - sunday) day of week of specified date
     */
    declare const getMondayBasedDayOfWeek: (date: Date) => number;

    declare const getLocaleFirstDayOfWeek: (locales: LocalesType) => number | null;

    /**
     * getFirstDayOfWeek() and getWeekDays() function parameters
     */
    declare interface GetWeekDaysParam {
        options?: {
            firstDay?: number;
        };
        locales?: LocalesType;
    }

    /**
     * Return monday on week of the specified date
     */
    declare const getFirstDayOfWeek: (date: Date, params: GetWeekDaysParam = {}) => number;

    /**
     * Returns array of days for week of the specified date
     */
    declare const getWeekDays: (date: Date, params: GetWeekDaysParam = {}) => Date[];

    /**
     * Check two dates has the same year and month
     */
    declare const isSameYearMonth: (dateA, dateB) => boolean;

    /**
     * Check two dates has the same year, month and day
     */
    declare const isSameDate: (dateA, dateB) => boolean;

    /**
     * Returns long weekday name for specified date
     */
    declare const getWeekdayLong: (date, locales: LocalesType = []) => string;

    /**
     * Returns short weekday name for specified date
     */
    declare const getWeekdayShort: (date, locales: LocalesType = []) => string;

    /**
     * Returns long month name for specified date
     */
    declare const getLongMonthName: (date, locales: LocalesType = []) => string;

    /**
     * Returns short month name for specified date
     */
    declare const getShortMonthName: (date, locales: LocalesType = []) => string;

    /**
     * Returns formatted time string for specified value
     * @param {number} time
     * @param {LocalesType} locales
     * @returns {string}
     */
    declare const formatTime: (time: number, locales: LocalesType = []) => string;
}
