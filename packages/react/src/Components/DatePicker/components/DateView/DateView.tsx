import { DatePickerMonthView } from '../MonthView/MonthView.tsx';
import { DatePickerYearRangeView } from '../YearRangeView/YearRangeView.tsx';
import { DatePickerYearView } from '../YearView/YearView.tsx';

import { DatePickerDateViewProps, DatePickerTitleClickParams } from '../../types.ts';
import { MONTH_VIEW, YEAR_VIEW, YEARRANGE_VIEW } from '../../constants.ts';

export const DatePickerDateView = (props: DatePickerDateViewProps) => {
    const {
        date,
        viewType,
        locales,
        focusable,
        components,
        dateViewRef,
        doubleView = false,
        vertical = false,
        onClickPrev,
        onClickNext,
        zoomOut,
    } = props;

    const refProps = (dateViewRef)
        ? { ref: dateViewRef }
        : {};

    const commonProps = {
        date,
        locales,
        doubleView,
        focusable,
        renderHeader: doubleView && vertical,
        header: {
            onClickPrev,
            onClickNext,
            focusable,
            onClickTitle: (options: DatePickerTitleClickParams) => zoomOut({
                ...options,
                secondViewTransition: true,
            }),
        },
        components: {
            Header: components.Header,
            WeekDaysHeader: components.WeekDaysHeader,
        },
        ...refProps,
    };

    if (viewType === MONTH_VIEW) {
        return (
            <DatePickerMonthView
                {...commonProps}
                firstDay={props.firstDay}
                actDate={props.actDate}
                multiple={props.multiple}
                range={props.range}
                curRange={props.curRange}
                disabledDateFilter={props.disabledDateFilter}
                rangePart={props.rangePart}
                renderWeekdays={!props.vertical}
                showOtherMonthDays={props.showOtherMonthDays}
                fixedHeight={props.fixedHeight}
            />
        );
    }

    if (viewType === YEAR_VIEW) {
        return <DatePickerYearView {...commonProps} />;
    }

    if (viewType === YEARRANGE_VIEW) {
        return <DatePickerYearRangeView {...commonProps} />;
    }

    return null;
};
