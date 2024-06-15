import PropTypes from 'prop-types';
import { formatCoord } from '../../helpers.js';

/**
 * BaseChartXAxisGrid component
 */
export const BaseChartXAxisGrid = (props) => {
    const { grid, data } = props;
    if (!grid) {
        return null;
    }

    const items = [];
    const groupOuterWidth = props.getGroupOuterWidth(props);
    const firstGroupIndex = props.getFirstVisibleGroupIndex(props);
    const visibleGroups = props.getVisibleGroupsCount(firstGroupIndex, props);

    for (let i = 0; i < visibleGroups; i += 1) {
        const groupIndex = firstGroupIndex + i;
        const value = data.series[groupIndex];
        if (typeof value === 'undefined') {
            break;
        }

        const prevValue = data.series[groupIndex - 1] ?? null;
        if (value === prevValue) {
            continue;
        }

        const curX = groupIndex * groupOuterWidth;
        let rX = Math.round(curX);
        rX += (rX > curX) ? -0.5 : 0.5;
        rX = formatCoord(rX);

        const y0 = formatCoord(grid.yFirst);
        const y1 = formatCoord(grid.yLast);

        const gridLine = {
            id: `xgrid_${groupIndex}`,
            className: 'chart__grid-line',
            d: `M${rX},${y0}L${rX},${y1}`,
        };

        items.push(gridLine);
    }

    return (
        <g>
            {items.map(({ id, ...item }) => (
                <path {...item} key={id} />
            ))}
        </g>
    );
};

BaseChartXAxisGrid.propTypes = {
    grid: PropTypes.object,
    data: PropTypes.object,
    getGroupOuterWidth: PropTypes.func,
    getFirstVisibleGroupIndex: PropTypes.func,
    getVisibleGroupsCount: PropTypes.func,
};
