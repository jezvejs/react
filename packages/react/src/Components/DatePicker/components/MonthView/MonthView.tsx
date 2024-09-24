import {
    DAYS_IN_WEEK,
    shiftDate,
    getWeekDays,
    isSameYearMonth,
    isSameDate,
    getDaysInMonth,
} from '@jezvejs/datetime';
import { forwardRef } from 'react';
import classNames from 'classnames';

import { useStore } from '../../../../utils/Store/StoreProvider.tsx';

import { MONTH_VIEW } from '../../constants.ts';
import { getHeaderTitle, inRange, includesDate } from '../../helpers.ts';
import {
    DatePickerHeaderProps,
    DatePickerMonthViewItemProps,
    DatePickerMonthViewProps,
    DatePickerState,
} from '../../types.ts';

import { DatePickerWeekDaysParams } from '../WeekDaysHeader/WeekDaysHeader.tsx';
import './MonthView.scss';

export interface DatePickerMonthViewItemAttrs {
    className?: string;
    disabled?: boolean;
    'data-date'?: string;
    'data-value'?: string;
}

const DatePickerMonthViewItem = (props: DatePickerMonthViewItemProps) => {
    const {
        date,
        isOtherMonth,
        isActive,
        highlight,
        isRangeStart,
        isRangeEnd,
        isToday,
        disabled,
        focusable,
        showOtherMonthDays,
    } = props;

    const itemDate = date.getDate();

    const itemProps: DatePickerMonthViewItemAttrs = {
        className: classNames(
            'dp__cell dp__month-view_cell dp__day-cell',
            {
                'dp__today-cell': !!isToday,
                'dp__other-month-cell': !!isOtherMonth,
                dp__cell_act: !!isActive,
                dp__cell_hl: !!highlight,
                'dp__cell_hl-range-start': !!isRangeStart,
                'dp__cell_hl-range-end': !!isRangeEnd,
            },
        ),
        disabled,
    };

    if (showOtherMonthDays || !isOtherMonth) {
        itemProps['data-date'] = shiftDate(date, 0).getTime().toString();
        itemProps['data-value'] = itemDate.toString();
    }

    const content = (showOtherMonthDays || !isOtherMonth) && itemDate;

    if (focusable) {
        return (
            <button {...itemProps} type="button">
                {content}
            </button>
        );
    }

    return (
        <div {...itemProps}>
            {content}
        </div>
    );
};

const defaultProps = {
    date: null,
    title: null,
    nav: null,
    locales: [],
    firstDay: null,
    doubleView: false,
    renderWeekdays: true,
    renderHeader: false,
    showOtherMonthDays: true,
    fixedHeight: false,
    header: null,
    focusable: false,
    disabledDateFilter: null,
    components: {
        Header: null,
        WeekDaysHeader: null,
    },
};

type DatePickerMonthViewRef = HTMLDivElement | null;

// eslint-disable-next-line react/display-name
export const DatePickerMonthView = forwardRef<
    DatePickerMonthViewRef,
    DatePickerMonthViewProps
>((p, ref) => {
    const props = {
        ...defaultProps,
        ...p,
        components: {
            ...defaultProps.components,
            ...(p?.components ?? {}),
        },
    };

    const {
        date,
        locales,
        firstDay,
        doubleView,
        focusable,
    } = props;
    const { Header, WeekDaysHeader } = props.components;
    const today = new Date();
    const rMonth = date.getMonth();
    const rYear = date.getFullYear();

    const store = useStore();
    if (!store) {
        return null;
    }

    const state = store.getState() as DatePickerState;

    // month header
    const title = getHeaderTitle({
        viewType: MONTH_VIEW,
        date,
        locales,
    });

    const headerProps: DatePickerHeaderProps = {
        ...(props.header ?? {}),
        focusable,
        title,
    };

    const header = props.renderHeader && Header && (
        <Header {...headerProps} />
    );

    // week days header
    const firstMonthDay = new Date(rYear, rMonth, 1);

    const weekDayParams: DatePickerWeekDaysParams = {
        locales,
    };
    if (typeof firstDay === 'number') {
        weekDayParams.options = {
            firstDay,
        };
    }

    let weekdays: JSX.Element | null = null;
    if (props.renderWeekdays && WeekDaysHeader) {
        weekdays = <WeekDaysHeader
            locales={locales}
            firstDay={firstDay}
        />;
    }

    // days
    const { showOtherMonthDays, fixedHeight } = props;
    let week: Date[] | null = getWeekDays(firstMonthDay, weekDayParams);
    let weeks = 1;
    const items: DatePickerMonthViewItemProps[] = [];

    // Start from previous week if 'fixedHeight' option is enabled
    // and current month is exacly 4 weeks:
    // February of the leap year, starting on first day of week
    if (fixedHeight) {
        const daysInMonth = getDaysInMonth(firstMonthDay);
        if (
            (daysInMonth === DAYS_IN_WEEK * 4)
            && isSameDate(week[0], firstMonthDay)
        ) {
            const prevWeekDay = shiftDate(week[0], -DAYS_IN_WEEK);
            week = getWeekDays(prevWeekDay, weekDayParams);
        }
    }

    do {
        week.forEach((weekday: Date) => {
            const isOtherMonth = !isSameYearMonth(date, weekday);
            const isToday = isSameDate(weekday, today) && (!doubleView || !isOtherMonth);

            const isActive = (
                !!state.actDate
                && includesDate(state.actDate, weekday)
                && !isOtherMonth
            );

            const highlight = (
                state.range
                && !isOtherMonth
                && inRange(weekday, state.curRange)
            );

            const startDate = state.curRange?.start ?? null;
            const isRangeStart = (
                !!startDate
                && !isOtherMonth
                && isSameDate(weekday, startDate)
            );

            const endDate = state.curRange?.end ?? null;
            const isRangeEnd = (
                !!endDate
                && !isOtherMonth
                && isSameDate(weekday, endDate)
            );

            const disabled = (
                (!showOtherMonthDays && isOtherMonth)
                || (
                    typeof props.disabledDateFilter === 'function'
                    && props.disabledDateFilter(weekday)
                )
            );

            const item = {
                date: weekday,
                isOtherMonth,
                isActive,
                highlight,
                isRangeStart,
                isRangeEnd,
                isToday,
                disabled,
                focusable,
                showOtherMonthDays,
            };

            items.push(item);
        });

        const nextWeekDay = shiftDate(week[0], DAYS_IN_WEEK);
        const addNextWeek = (
            isSameYearMonth(date, nextWeekDay)
            || (fixedHeight && weeks < 6)
        );

        week = (addNextWeek)
            ? getWeekDays(nextWeekDay, weekDayParams)
            : null;
        weeks += 1;
    } while (week);

    return (
        <div
            className={classNames(
                'dp__view-container dp__month-view',
                props.className,
            )}
            ref={ref}
        >
            {header}
            {weekdays}
            {items.map((item) => (
                <DatePickerMonthViewItem key={`dp_month_${item.date}`} {...item} />
            ))}
        </div>
    );
});
