import PropTypes from 'prop-types';
import { getWeekDays, getWeekdayShort } from '@jezvejs/datetime';
import './WeekDaysHeader.scss';

const DatePickerWeekDaysHeaderItem = (props) => {
    const {
        weekday,
        locales = [],
    } = props;

    const itemProps = {
        className: 'dp__cell dp__month-view_cell dp__weekday-cell',
    };

    const content = getWeekdayShort(weekday, locales);
    return (
        <div {...itemProps}>
            {content}
        </div>
    );
};

DatePickerWeekDaysHeaderItem.propTypes = {
    weekday: PropTypes.instanceOf(Date),
    locales: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
};

export const DatePickerWeekDaysHeader = (props) => {
    const {
        locales = [],
        firstDay = null,
    } = props;

    const params = {
        locales,
    };
    if (typeof firstDay === 'number') {
        params.options = {
            firstDay,
        };
    }

    const week = getWeekDays(new Date(), params);

    return (
        <div className="dp__weekdays-header">
            {week.map((weekday) => (
                <DatePickerWeekDaysHeaderItem
                    key={`dp_whrd_${weekday.getTime()}`}
                    weekday={weekday}
                    locales={locales}
                />
            ))}
        </div>
    );
};

DatePickerWeekDaysHeader.propTypes = {
    locales: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
    firstDay: PropTypes.number,
};
