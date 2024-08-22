import { ComponentType, ReactNode } from 'react';
import { PopupPositionProps } from '../../hooks/usePopupPosition/types.ts';
import { StoreReducersList } from '../../utils/Store/Store.ts';

export type DatePickerSelectMode = 'date' | 'month' | 'year';

export type DatePickerViewType = 'month' | 'year' | 'yearrange';

export type DatePickerRangePart = 'start' | 'end';

export interface DatePickerRange {
    start: Date | null;
    end: Date | null;
}

export type DatePickerDisabledDateFilter = (date: Date) => boolean;

export type DatePickerDateSelectCallback = (date: Date | null, state?: DatePickerState) => void;

export type DatePickerRangeSelectCallback = (
    range: DatePickerRange,
    state?: DatePickerState,
) => void;

/**
 * getHeaderTitle() function params
 */
export interface DatePickerHeaderTitleParam {
    date: Date;
    viewType: DatePickerViewType;
    locales: string | string[];
}

/**
 * Header component
 */
export type DatePickerHeaderComponent = React.FC<DatePickerHeaderProps>;

/**
 * Header props
 */
export interface DatePickerHeaderProps {
    title?: string | null;
    secondTitle?: string | null;
    doubleView?: boolean;
    focusable?: boolean;
    secondViewTransition?: boolean;

    onClickTitle?: (params: DatePickerTitleClickParams) => void;
    onClickPrev?: (params: object) => void;
    onClickNext?: (params: object) => void;
}

/**
 * Weekday header item props
 */
export interface DatePickerWeekDaysHeaderItemProps {
    weekday: Date;
    locales: string | string[];
}

/**
 * Weekday header component
 */
export type DatePickerWeekDaysHeaderComponent = React.FC<DatePickerWeekDaysHeaderProps>;

/**
 * Weekday header component props
 */
export interface DatePickerWeekDaysHeaderProps {
    locales: string | string[];
    firstDay: number | null;
}

/**
 * Month view item props
 */
export interface DatePickerMonthViewItemProps {
    date: Date;
    isOtherMonth: boolean;
    isActive: boolean;
    highlight: boolean;
    isToday: boolean;
    isRangeStart: boolean;
    isRangeEnd: boolean;
    disabled: boolean;
    focusable: boolean;
    showOtherMonthDays: boolean;
}

/**
 * Month view props
 */
export interface DatePickerMonthViewProps {
    date: Date;
    actDate: Date | Date[] | null;
    multiple: boolean;
    range: boolean;
    curRange: DatePickerRange;
    rangePart: DatePickerRangePart | null;
    /*
    title: string;
    nav: object;
    */
    locales: string | string[];
    firstDay: number | null;
    doubleView: boolean;
    renderWeekdays: boolean;
    renderHeader: boolean;
    showOtherMonthDays: boolean;
    fixedHeight: boolean;
    header: object;
    focusable: boolean;
    disabledDateFilter: DatePickerDisabledDateFilter | null;
    components: {
        Header?: DatePickerHeaderComponent | null;
        WeekDaysHeader?: DatePickerWeekDaysHeaderComponent | null;
    };
}

/**
 * Year view item props
 */
export interface DatePickerYearItemProps {
    date: Date;
    locales: string | string[];
    disabled?: boolean;
    focusable?: boolean;
}

/**
 * Year view props
 */
export interface DatePickerYearViewProps {
    date: Date;
    locales: string | string[];
    renderHeader?: boolean;
    header?: object;
    focusable?: boolean;
    components?: {
        Header?: DatePickerHeaderComponent | null;
    };
}

/**
 * Year range view item props
 */
export interface DatePickerYearRangeItemProps {
    date: Date,
    isOther?: boolean,
    disabled?: boolean,
    focusable?: boolean,
}

/**
 * Year range view props
 */
export interface DatePickerYearRangeViewProps {
    date: Date;
    locales: string | string[];
    renderHeader?: boolean;
    header?: object;
    focusable?: boolean;
    components?: {
        Header?: DatePickerHeaderComponent | null;
    };
}

export interface DatePickerItem {
    date: Date;
}

export interface DatePickerSearchResults {
    item: DatePickerItem | null,
    index: number,
    itemView?: null,
    secondViewTransition: boolean,
}

/**
 * DatePicker props
 */
export interface DatePickerProps {
    /* Additional reducers */
    reducers: StoreReducersList;
    /** Additional CSS classes */
    className: string;
    /** Date select mode. Possible values: 'date', 'month', 'year' */
    mode: DatePickerSelectMode;
    /** Initial date to render */
    date: Date;
    /** Show datepicker popup */
    visible: boolean;
    /** If enabled component will be rendered on place instead of wrapping it with popup */
    inline: boolean;
    /** If enabled popup will be hidden after select date */
    hideOnSelect: boolean;
    /** Enables multiple items select mode */
    multiple: boolean;
    /** Enables range select mode */
    range: boolean;
    /** Range selection start date */
    startDate: Date | null;
    /** Range selection end date */
    endDate: Date | null;
    /** Columns gap in pixels */
    columnGap?: number;
    /** Rows gap in pixels */
    rowGap?: number;
    /** If enabled two views of the same type will be rendered */
    doubleView?: boolean;
    /** If enabled slide axis is changed from horizontal to vertical */
    vertical?: boolean;
    /** Set current target for range select mode. Possible values: 'start', 'end', null */
    rangePart: DatePickerRangePart | null;
    /** List of locales */
    locales: string | string[];
    /** First day of week */
    firstDay: number | null;
    /** Enables keyboard navigation by child components */
    keyboardNavigation: boolean;
    /** If enabled child components will render days from other month */
    showOtherMonthDays: boolean;
    /** If enabled month view will always render 6 weeks */
    fixedHeight: boolean;
    /** Enables animation */
    animated: boolean;
    /** Callback to set disabled state of items */
    disabledDateFilter: DatePickerDisabledDateFilter | null;
    /** Range selected event handler */
    onRangeSelect: DatePickerRangeSelectCallback | null;
    /** Date selected event handler */
    onDateSelect: DatePickerDateSelectCallback | null;
    /** Component shown event handler */
    onShow: (() => void) | null;
    /** Component hidden event handler */
    onHide: (() => void) | null;
    /** Props for footer component */
    footer: object;
    /** If enabled popup will use fixed position */
    fixed: boolean;
    /** Popup position props */
    position: PopupPositionProps;
    container: Element | DocumentFragment | null;
    children: ReactNode | null;
    components: {
        Footer?: ComponentType | null;
        Header?: DatePickerHeaderComponent | null;
        WeekDaysHeader?: DatePickerWeekDaysHeaderComponent | null;
    };
}

/**
 * DatePicker state
 */
export interface DatePickerState extends DatePickerProps {
    viewType: DatePickerViewType;
    actDate: Date | Date[] | null;
    curRange: DatePickerRange;
    selRange: DatePickerRange;
    transition: string | null;
    secondViewTransition: boolean;
    waitingForAnimation: boolean;
}

/**
 * Common state of views
 */
export interface DatePickerViewState extends DatePickerState {
    focusable: boolean;
}

/**
 * setSelection() parameters
 */
export interface DatePickerSetSelectionParams {
    startDate: Date | null;
    endDate: Date | null;
    navigateToFirst: boolean;
}

/**
 * zoomIn() action parameters
 */
export interface DatePickerZoomInParams {
    date: Date;
    secondViewTransition: boolean;
}

/**
 * zoomOut() action parameters
 */
export interface DatePickerZoomOutParams {
    secondViewTransition: boolean;
}

/**
 * onClickTitle() callback parameters
 */
export interface DatePickerTitleClickParams {
    e: React.MouseEvent;
    secondViewTransition: boolean;
}