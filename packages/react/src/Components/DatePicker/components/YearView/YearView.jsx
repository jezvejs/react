import { getShortMonthName, shiftDate, MONTHS_COUNT } from '@jezvejs/datetime';
import { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { YEAR_VIEW } from '../../constants.js';
import { getHeaderTitle } from '../../helpers.js';
import './YearView.scss';

const DatePickerYearItem = (props) => {
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

DatePickerYearItem.propTypes = {
    date: PropTypes.oneOfType([
        PropTypes.instanceOf(Date),
        PropTypes.number,
    ]),
    locales: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
    disabled: PropTypes.bool,
    focusable: PropTypes.bool,
};

// eslint-disable-next-line react/display-name
export const DatePickerYearView = forwardRef((props, ref) => {
    const {
        date,
        locales,
        focusable,
    } = props;
    const { Header } = props.components;

    const title = getHeaderTitle({
        viewType: YEAR_VIEW,
        date,
        locales,
    });

    // year range header
    const header = props.renderHeader && (
        <Header
            locales={locales}
            title={title}
            focusable={focusable}
        />
    );

    // months of current year
    const rYear = date.getFullYear();
    const items = [];

    for (let i = 0; i < MONTHS_COUNT; i += 1) {
        const item = {
            date: new Date(rYear, i, 1),
            focusable,
            locales,
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
                <DatePickerYearItem key={`dp_yr_${item.date}`} {...item} />
            ))}
        </div>
    );
});

DatePickerYearView.propTypes = {
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

DatePickerYearView.defaultProps = {
    renderHeader: false,
    header: null,
    focusable: false,
    components: {
        Header: null,
    },
};
