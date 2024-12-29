import { getShortMonthName, shiftDate, MONTHS_COUNT } from '@jezvejs/datetime';
import { forwardRef } from 'react';

import { YEAR_VIEW } from '../../constants.ts';
import { getHeaderTitle } from '../../helpers.ts';
import { DatePickerYearItemProps, DatePickerYearViewProps } from '../../types.ts';
import './YearView.scss';

const DatePickerYearItem = (props: DatePickerYearItemProps) => {
    const {
        date,
        focusable,
        locales,
    } = props;

    const content = getShortMonthName(date, locales);

    const itemProps = {
        className: 'dp__cell dp__year-view__cell',
        'data-date': shiftDate(date, 0).getTime(),
    };

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
    renderHeader: false,
    header: null,
    focusable: false,
    components: {
        Header: null,
    },
};

type DatePickerYearViewRef = HTMLDivElement | null;

export const DatePickerYearView = forwardRef<
    DatePickerYearViewRef,
    DatePickerYearViewProps
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
        focusable,
    } = props;
    const { Header } = props.components ?? {};

    const title = getHeaderTitle({
        viewType: YEAR_VIEW,
        date,
        locales,
    });

    // year range header
    const header = props.renderHeader && Header && (
        <Header
            {...(props.header ?? {})}
            title={title}
            focusable={focusable}
        />
    );

    // months of current year
    const rYear = date.getFullYear();
    const items: DatePickerYearItemProps[] = [];

    for (let i = 0; i < MONTHS_COUNT; i += 1) {
        const item = {
            date: new Date(rYear, i, 1),
            focusable,
            locales,
        };

        items.push(item);
    }

    const viewProps = {
        className: 'dp__view-container dp__year-range-view',
        'data-date': rYear,
    };

    return (
        <div {...viewProps} ref={ref}>
            {header}
            {items.map((item) => (
                <DatePickerYearItem key={`dp_yr_${item.date}`} {...item} />
            ))}
        </div>
    );
});

DatePickerYearView.displayName = 'DatePickerYearView';
