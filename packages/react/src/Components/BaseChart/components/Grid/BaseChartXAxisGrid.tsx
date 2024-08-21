import { formatCoord } from '../../helpers.ts';
import { BaseChartXAxisGridProps } from '../../types.ts';

export interface BaseChartXAxisGridItemProps {
    id: string,
    className: string,
    d: string,
}

/**
 * BaseChartXAxisGrid component
 */
export const BaseChartXAxisGrid = (props: BaseChartXAxisGridProps) => {
    const { grid, data } = props;
    if (!grid?.steps || !props.xAxisGrid) {
        return null;
    }

    const items: BaseChartXAxisGridItemProps[] = [];
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
        const fmtX = formatCoord(rX);

        const y0 = formatCoord(grid.yFirst);
        const y1 = formatCoord(grid.yLast);

        const gridLine = {
            id: `xgrid_${groupIndex}`,
            className: 'chart__grid-line',
            d: `M${fmtX},${y0}L${fmtX},${y1}`,
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
