import { BaseChartYAxisGridProps } from '../../types.ts';

export interface BaseChartYAxisGridItemProps {
    id: string,
    className: string,
    d: string,
}

/**
 * BaseChartYAxisGrid component
 */
export const BaseChartYAxisGrid = (props: BaseChartYAxisGridProps) => {
    const { grid, height } = props;
    if (!grid) {
        return null;
    }

    const items: BaseChartYAxisGridItemProps[] = [];
    const width = props.chartWidth ?? 0;
    if (!width) {
        return null;
    }

    let step = 0;
    let curY = grid.yFirst;

    while (step <= grid.steps) {
        let rY = Math.round(curY);
        if (rY > curY || rY >= height) {
            rY -= 0.5;
        } else {
            rY += 0.5;
        }

        const gridLine: BaseChartYAxisGridItemProps = {
            id: `ygrid_${step}`,
            className: 'chart__grid-line',
            d: `M0,${rY}L${width},${rY}`,
        };

        items.push(gridLine);

        curY += grid.yStep;
        step += 1;
    }

    return (
        <g>
            {items.map((item) => (
                <path {...item} key={item.id} />
            ))}
        </g>
    );
};
