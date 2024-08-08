import { DatePickerHeader } from './components/Header/Header.tsx';
import { DatePickerWeekDaysHeader } from './components/WeekDaysHeader/WeekDaysHeader.tsx';

export const defaultProps = {
    mode: 'date', // possible values: 'date', 'month', 'year'
    date: new Date(),
    visible: false,
    inline: false,
    hideOnSelect: false,
    multiple: false,
    range: false,
    columnGap: 8,
    rowGap: 8,
    doubleView: false,
    vertical: false,
    rangePart: null, // possible values: 'start', 'end' or null
    locales: [],
    firstDay: null,
    keyboardNavigation: true,
    showOtherMonthDays: true,
    fixedHeight: false,
    animated: false,
    disabledDateFilter: null,
    onRangeSelect: null,
    onDateSelect: null,
    onShow: null,
    onHide: null,
    footer: {},
    position: {
        margin: 5,
        screenPadding: 5,
    },
    components: {
        Footer: null,
        Header: DatePickerHeader,
        WeekDaysHeader: DatePickerWeekDaysHeader,
    },
};
