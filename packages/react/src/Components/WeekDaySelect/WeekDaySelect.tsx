import { getWeekDays, getWeekdayShort } from '@jezvejs/datetime';
import classNames from 'classnames';

import { Menu } from '../Menu/Menu.tsx';
import { MenuProps } from '../Menu/types.ts';
import './WeekDaySelect.scss';

export interface WeekDaySelectProps extends MenuProps {
    locales?: string | string[],
    firstDay?: number,
}

interface WeekDayParams {
    locales?: string | string[],
    options?: {
        firstDay?: number,
    },
}

const defaultProps = {
    defaultItemType: 'link',
    locales: [],
};

export const WeekDaySelect = (p: WeekDaySelectProps) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const menuProps = {
        ...props,
        className: classNames('weekday-select', props.className),
    };

    const weekDayParams: WeekDayParams = {
        locales: menuProps.locales,
        options: {},
    };
    if (typeof props.firstDay === 'number') {
        weekDayParams.options = {
            firstDay: props.firstDay,
        };
    }

    const weekDays = getWeekDays(new Date(), weekDayParams);
    menuProps.items = weekDays.map((weekday: Date) => ({
        id: weekday.getDay().toString(),
        title: getWeekdayShort(weekday, props.locales),
        selectable: true,
    }));

    return (
        <Menu {...menuProps} />
    );
};
