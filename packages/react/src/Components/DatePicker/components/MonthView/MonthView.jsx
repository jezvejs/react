import { isFunction } from '@jezvejs/types';
import {
    DAYS_IN_WEEK,
    shiftDate,
    getWeekDays,
    isSameYearMonth,
    isSameDate,
    getDaysInMonth,
} from '@jezvejs/datetime';
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { MONTH_VIEW } from '../../constants.js';
import { getHeaderTitle } from '../../helpers.js';
import './MonthView.scss';

const DatePickerMonthViewItem = (props) => {
    const {
        date,
        isOtherMonth,
        isToday,
        focusable,
        showOtherMonthDays,
    } = props;

    const itemDate = date.getDate();

    const itemProps = {
        className: classNames(
            'dp__cell dp__month-view_cell dp__day-cell',
            {
                'dp__today-cell': isToday,
                'dp__other-month-cell': isOtherMonth,
            },
        ),
    };

    if (showOtherMonthDays || !isOtherMonth) {
        itemProps['data-date'] = shiftDate(date, 0).getTime();
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

DatePickerMonthViewItem.propTypes = {
    date: PropTypes.oneOfType([
        PropTypes.instanceOf(Date),
        PropTypes.number,
    ]),
    isOtherMonth: PropTypes.bool,
    isToday: PropTypes.bool,
    disabled: PropTypes.bool,
    focusable: PropTypes.bool,
    showOtherMonthDays: PropTypes.bool,
};

// eslint-disable-next-line react/display-name
export const DatePickerMonthView = forwardRef((props, ref) => {
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

    // month header
    const title = getHeaderTitle({
        viewType: MONTH_VIEW,
        date,
        locales,
    });

    const header = props.renderHeader && (
        <Header
            locales={locales}
            title={title}
            focusable={focusable}
        />
    );

    // week days header
    const firstMonthDay = new Date(rYear, rMonth, 1);
    const weekDayParams = {
        locales,
    };
    if (typeof firstDay === 'number') {
        weekDayParams.options = {
            firstDay,
        };
    }

    let weekdays = null;
    if (props.renderWeekdays && WeekDaysHeader) {
        weekdays = <WeekDaysHeader
            locales={locales}
            firstDay={firstDay}
        />;
    }

    // days
    const { showOtherMonthDays, fixedHeight } = props;
    let week = getWeekDays(firstMonthDay, weekDayParams);
    let weeks = 1;
    const disabledFilter = isFunction(props.disabledDateFilter);
    const items = [];

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
        week.forEach((weekday) => {
            const isOtherMonth = !isSameYearMonth(date, weekday);
            const isToday = isSameDate(weekday, today) && (!doubleView || !isOtherMonth);

            const disabled = (
                (!showOtherMonthDays && isOtherMonth)
                || (!!disabledFilter && props.disabledDateFilter(weekday))
            );

            const item = {
                date: weekday,
                isOtherMonth,
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
            className='dp__view-container dp__month-view'
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

DatePickerMonthView.propTypes = {
    date: PropTypes.oneOfType([
        PropTypes.instanceOf(Date),
        PropTypes.number,
    ]),
    title: PropTypes.string,
    nav: PropTypes.object,
    locales: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
    firstDay: PropTypes.number,
    doubleView: PropTypes.bool,
    renderWeekdays: PropTypes.bool,
    renderHeader: PropTypes.bool,
    showOtherMonthDays: PropTypes.bool,
    fixedHeight: PropTypes.bool,
    header: PropTypes.object,
    focusable: PropTypes.bool,
    disabledDateFilter: PropTypes.func,
    components: PropTypes.shape({
        Header: PropTypes.func,
        WeekDaysHeader: PropTypes.func,
    }),
};

DatePickerMonthView.defaultProps = {
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
