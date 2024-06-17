import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { formatCoord } from '../../../BaseChart/helpers.js';

import './HistogramDataItem.scss';

/**
 * HistogramDataItem component
 */
// eslint-disable-next-line react/display-name
export const HistogramDataItem = forwardRef((props, ref) => {
    const {
        x,
        y,
        width,
        height,
    } = props;

    const attrs = {
        x,
        y,
        width,
        height,
    };

    const isValid = Object.values(attrs).every((value) => value >= 0);
    if (!isValid) {
        return null;
    }

    Object.entries(attrs).forEach(([key, value]) => {
        attrs[key] = formatCoord(value);
    });

    const categoryIndexClass = props.stacked
        ? `histogram_category-ind-${props.categoryIndex + 1}`
        : null;

    const categoryClass = props.stacked && props.category !== null
        ? `histogram_category-${props.category}`
        : null;

    const itemProps = {
        className: classNames(
            'histogram__bar',
            `histogram_column-${props.columnIndex + 1}`,
            categoryIndexClass,
            categoryClass,
            {
                chart__item_active: !!props.active,
            },
        ),
        ...attrs,
    };

    return (
        <rect {...itemProps} ref={ref} />
    );
});

HistogramDataItem.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    columnIndex: PropTypes.number,
    categoryIndex: PropTypes.number,
    category: PropTypes.string,
    stacked: PropTypes.bool,
    active: PropTypes.bool,
};
