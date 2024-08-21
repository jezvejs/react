import { getWeekDays, getWeekdayShort, LocalesType } from '@jezvejs/datetime';
import classNames from 'classnames';

import { Menu } from '../Menu/Menu.tsx';
import { MenuItemType, MenuProps } from '../Menu/types.ts';
import './WeekDaySelect.scss';

export interface WeekDaySelectProps extends MenuProps {
    locales?: string | string[],
    firstDay?: number,
}

interface WeekDayParams {
    locales?: LocalesType,
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

    const { locales, firstDay } = props;

    const menuProps: MenuProps = {
        ...props,
        className: classNames('weekday-select', props.className),
    };

    const weekDayParams: WeekDayParams = {
        locales,
        options: {},
    };
    if (typeof firstDay === 'number') {
        weekDayParams.options = {
            firstDay,
        };
    }

    const weekDays = getWeekDays(new Date(), weekDayParams);
    menuProps.items = weekDays.map((weekday: Date) => ({
        id: weekday.getDay().toString(),
        title: getWeekdayShort(weekday, locales),
        selectable: true,
        type: props.defaultItemType as MenuItemType,
    }));

    return (
        <Menu {...menuProps} />
    );
};
