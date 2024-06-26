import PropTypes from 'prop-types';
import classNames from 'classnames';
import { BaseChartHelpers, minmax } from '@jezvejs/react';
import './CustomActiveGroup.scss';

/**
 * CustomActiveGroup component
 */
export const CustomActiveGroup = (props) => {
    const getColumnHeight = (state) => {
        const { dataSets } = state;
        if (dataSets.length === 0) {
            return 0;
        }

        const { groupIndex } = state.activeTarget;
        let value = 0;
        dataSets.forEach((dataSet) => {
            const itemValue = dataSet.data[groupIndex] ?? 0;
            value += itemValue;
        });

        const { grid } = state;
        const valueOffset = 0;
        const y0 = grid.getY(valueOffset);
        const y1 = grid.getY(value + valueOffset);
        const height = grid.roundToPrecision(Math.abs(y0 - y1), 1);

        return height;
    };

    if (!props.activeTarget) {
        return null;
    }

    const groupWidth = props.getGroupOuterWidth(props);
    const { groupIndex } = props.activeTarget;
    const { formatCoord } = BaseChartHelpers;
    const rectProps = {
        x: formatCoord(groupIndex * groupWidth),
        y: 0,
        width: formatCoord(groupWidth),
        height: formatCoord(props.height),
        className: 'chart__active-group-back',
    };

    // Line
    const columnHeight = getColumnHeight(props);
    const padding = 5;
    const rX = formatCoord((groupIndex + 0.5) * groupWidth);
    const y0 = padding;
    const y1 = formatCoord(
        minmax(
            padding,
            props.height - padding,
            props.height - columnHeight - padding,
        ),
    );

    const lineProps = {
        className: 'chart__active-group-line',
        d: `M${rX},${y0}L${rX},${y1}`,
    };

    return (
        <g className={classNames(
            'chart__active-group',
            props.className,
        )}>
            <rect {...rectProps} />
            <path {...lineProps} />
        </g>
    );
};

CustomActiveGroup.propTypes = {
    className: PropTypes.string,
    height: PropTypes.number,
    activeTarget: PropTypes.object,
    getGroupOuterWidth: PropTypes.func,
};
