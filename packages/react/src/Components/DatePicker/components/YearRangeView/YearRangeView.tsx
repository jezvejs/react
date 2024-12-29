import { shiftDate } from '@jezvejs/datetime';
import { forwardRef } from 'react';
import classNames from 'classnames';

import { YEARRANGE_VIEW, YEAR_RANGE_LENGTH } from '../../constants.ts';
import { getHeaderTitle } from '../../helpers.ts';
import { DatePickerHeaderProps, DatePickerYearRangeItemProps, DatePickerYearRangeViewProps } from '../../types.ts';
import './YearRangeView.scss';

const DatePickerYearRangeItem = (props: DatePickerYearRangeItemProps) => {
    const {
        date,
        focusable,
        isOther,
    } = props;

    const content = date.getFullYear();

    const itemProps = {
        className: classNames(
            'dp__cell dp__year-range-view__cell',
            {
                'dp__other-month-cell': isOther,
            },
        ),
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

type DatePickerYearRangeViewRef = HTMLDivElement | null;

export const DatePickerYearRangeView = forwardRef<
    DatePickerYearRangeViewRef,
    DatePickerYearRangeViewProps
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
    const { Header } = (props.components ?? {});

    const title = getHeaderTitle({
        viewType: YEARRANGE_VIEW,
        date,
        locales,
    });

    // year range header
    const headerProps: DatePickerHeaderProps = {
        ...(props.header ?? {}),
        title,
        focusable,
    };

    const header = props.renderHeader && Header && (
        <Header {...headerProps} />
    );

    /*
    <Header
        {...(props.header ?? {})}
        title={title}
        focusable={focusable}
    />
    */

    const rYear = date.getFullYear();
    const startYear = rYear - (rYear % 10) - 1;
    const items: DatePickerYearRangeItemProps[] = [];

    // years of current range
    for (let i = 0; i < YEAR_RANGE_LENGTH + 2; i += 1) {
        const item = {
            date: new Date(startYear + i, 0, 1),
            isOther: (i === 0 || i === YEAR_RANGE_LENGTH + 1),
            focusable,
        };

        items.push(item);
    }

    const viewProps = {
        className: 'dp__view-container dp__year-range-view',
        'data-date': `${startYear}-${startYear + YEAR_RANGE_LENGTH}`,
    };

    return (
        <div {...viewProps} ref={ref}>
            {header}
            {items.map((item) => (
                <DatePickerYearRangeItem key={`dp_yr_${item.date}`} {...item} />
            ))}
        </div>
    );
});

DatePickerYearRangeView.displayName = 'DatePickerYearRangeView';
