import { getWeekDays, getWeekdayShort } from '@jezvejs/datetime';
import { DatePickerWeekDaysHeaderItemProps, DatePickerWeekDaysHeaderProps } from '../../types.ts';
import './WeekDaysHeader.scss';

const DatePickerWeekDaysHeaderItem = (props: DatePickerWeekDaysHeaderItemProps) => {
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

export interface DatePickerWeekDaysParams {
    locales?: string | string[],
    options?: {
        firstDay?: number,
    },
}

export const DatePickerWeekDaysHeader = (props: DatePickerWeekDaysHeaderProps) => {
    const {
        locales = [],
        firstDay,
    } = props;

    const params: DatePickerWeekDaysParams = {
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
            {week.map((weekday: Date) => (
                <DatePickerWeekDaysHeaderItem
                    key={`dp_whrd_${weekday.getTime()}`}
                    weekday={weekday}
                    locales={locales}
                />
            ))}
        </div>
    );
};
