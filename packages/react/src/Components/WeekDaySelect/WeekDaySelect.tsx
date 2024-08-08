import { getWeekDays, getWeekdayShort } from '@jezvejs/datetime';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Menu } from '../Menu/Menu.tsx';
import './WeekDaySelect.scss';

const defaultProps = {
    defaultItemType: 'link',
    locales: [],
};

export const WeekDaySelect = (p) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const menuProps = {
        ...props,
        className: classNames('weekday-select', props.className),
    };

    const weekDayParams = {
        locales: menuProps.locales,
        options: {},
    };
    if (typeof props.firstDay === 'number') {
        weekDayParams.options.firstDay = props.firstDay;
    }

    const weekDays = getWeekDays(new Date(), weekDayParams);
    menuProps.items = weekDays.map((weekday) => ({
        id: weekday.getDay().toString(),
        title: getWeekdayShort(weekday, props.locales),
        selectable: true,
    }));

    return (
        <Menu {...menuProps} />
    );
};

WeekDaySelect.propTypes = {
    ...Menu.propTypes,
    locales: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
};
