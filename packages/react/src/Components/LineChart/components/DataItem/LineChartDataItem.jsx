import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { formatCoord } from '../../../BaseChart/helpers.js';
import { useStore } from '../../../../utils/Store/StoreProvider.jsx';

import './LineChartDataItem.scss';

const animateAttributes = ['cy'];

/**
 * LineChartDataItem component
 */
// eslint-disable-next-line react/display-name
export const LineChartDataItem = forwardRef((props, ref) => {
    const {
        cx = 0,
        cy = 0,
        r = 4,
    } = props;

    const attrs = {
        cx,
        cy,
        r,
    };

    const { getState } = useStore();
    const state = getState();

    const isValid = Object.values(attrs).every((value) => value >= 0);
    if (!isValid) {
        return null;
    }

    Object.entries(attrs).forEach(([key, value]) => {
        if (
            state.autoScale
            && state.animate
            && animateAttributes.includes(key)
        ) {
            if (!attrs.style) {
                attrs.style = {};
            }

            if (state.animateNow) {
                attrs.style[key] = formatCoord(value, true);
            } else {
                attrs.style[key] = '';
                attrs[key] = formatCoord(value);
            }
        } else {
            attrs[key] = formatCoord(value);
        }
    });

    const categoryIndexClass = `linechart_category-ind-${props.categoryIndex + 1}`;
    const categoryClass = props.stacked && props.category !== null
        ? `linechart_category-${props.category}`
        : null;

    const itemProps = {
        className: classNames(
            'linechart__item',
            categoryIndexClass,
            categoryClass,
            {
                chart__item_active: !!props.active,
            },
        ),
        ...attrs,
    };

    return (
        <circle {...itemProps} ref={ref} />
    );
});

LineChartDataItem.propTypes = {
    cx: PropTypes.number,
    cy: PropTypes.number,
    r: PropTypes.number,
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
