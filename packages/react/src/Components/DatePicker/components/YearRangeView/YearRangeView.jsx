import { shiftDate } from '@jezvejs/datetime';
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { YEARRANGE_VIEW, YEAR_RANGE_LENGTH } from '../../constants.js';
import { getHeaderTitle } from '../../helpers.js';
import './YearRangeView.scss';

const DatePickerYearRangeItem = (props) => {
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

DatePickerYearRangeItem.propTypes = {
    date: PropTypes.oneOfType([
        PropTypes.instanceOf(Date),
        PropTypes.number,
    ]),
    isOther: PropTypes.bool,
    disabled: PropTypes.bool,
    focusable: PropTypes.bool,
};

// eslint-disable-next-line react/display-name
export const DatePickerYearRangeView = forwardRef((props, ref) => {
    const {
        date,
        locales,
        focusable,
    } = props;
    const { Header } = props.components;

    const title = getHeaderTitle({
        viewType: YEARRANGE_VIEW,
        date,
        locales,
    });

    // year range header
    const header = props.renderHeader && (
        <Header
            {...(props.header ?? {})}
            locales={locales}
            title={title}
            focusable={focusable}
        />
    );

    const rYear = date.getFullYear();
    const startYear = rYear - (rYear % 10) - 1;
    const items = [];

    // years of current range
    for (let i = 0; i < YEAR_RANGE_LENGTH + 2; i += 1) {
        const item = {
            date: new Date(startYear + i, 0, 1),
            isOther: (i === 0 || i === YEAR_RANGE_LENGTH + 1),
            focusable,
        };

        items.push(item);
    }

    return (
        <div
            className='dp__view-container dp__year-range-view'
            ref={ref}
        >
            {header}
            {items.map((item) => (
                <DatePickerYearRangeItem key={`dp_yr_${item.date}`} {...item} />
            ))}
        </div>
    );
});

DatePickerYearRangeView.propTypes = {
    date: PropTypes.oneOfType([
        PropTypes.instanceOf(Date),
        PropTypes.number,
    ]),
    locales: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
    renderHeader: PropTypes.bool,
    header: PropTypes.object,
    focusable: PropTypes.bool,
    components: PropTypes.shape({
        Header: PropTypes.func,
    }),
};

DatePickerYearRangeView.defaultProps = {
    renderHeader: false,
    header: null,
    focusable: false,
    components: {
        Header: null,
    },
};
