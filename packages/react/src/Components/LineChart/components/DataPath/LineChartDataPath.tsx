import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './LineChartDataPath.scss';

/**
 * LineChartDataPath component
 */
// eslint-disable-next-line react/display-name
export const LineChartDataPath = forwardRef((props, ref) => {
    const {
        shape = null,
    } = props;
    if (!shape) {
        return null;
    }

    const categoryIndexClass = `linechart_category-ind-${props.categoryIndex + 1}`;
    const categoryClass = props.stacked && props.category !== null
        ? `linechart_category-${props.category}`
        : null;

    const itemProps = {
        className: classNames(
            'linechart__path',
            categoryIndexClass,
            categoryClass,
            {
                chart__item_active: !!props.active,
            },
        ),
        d: shape,
    };

    return (
        <path {...itemProps} ref={ref} />
    );
});

LineChartDataPath.propTypes = {
    shape: PropTypes.string,
    groupIndex: PropTypes.number,
    categoryIndex: PropTypes.number,
    category: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    stacked: PropTypes.bool,
    active: PropTypes.bool,
    autoScale: PropTypes.bool,
    animate: PropTypes.bool,
    animateNow: PropTypes.bool,
};
