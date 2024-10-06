import { DatePickerHeader } from './components/Header/Header.tsx';
import { DatePickerWeekDaysHeader } from './components/WeekDaysHeader/WeekDaysHeader.tsx';
import { DatePickerSelectMode } from './types.ts';

export const defaultProps = {
    reducers: [],
    className: '',
    startDate: null,
    endDate: null,
    fixed: false,
    mode: 'date' as DatePickerSelectMode, // possible values: 'date', 'month', 'year'
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

    container: null,
    children: null,

    position: {
        margin: 5,
        screenPadding: 5,
        scrollOnOverflow: true,
        allowResize: false,
        allowFlip: false,
        updateProps: () => ({
            scrollOnOverflow: false,
        }),
    },
    components: {
        Footer: null,
        Header: DatePickerHeader,
        WeekDaysHeader: DatePickerWeekDaysHeader,
    },
};
