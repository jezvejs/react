import { BaseChartXAxisGrid } from './BaseChartXAxisGrid.tsx';
import { BaseChartYAxisGrid } from './BaseChartYAxisGrid.tsx';

import './BaseChartGrid.scss';

export interface BaseChartGridProps {
    grid: object,
    yAxisGrid: boolean,
    xAxisGrid: boolean,
    chartWidth: number,
    height: number,
    getGroupOuterWidth: () => void,
    getFirstVisibleGroupIndex: () => void,
    getVisibleGroupsCount: () => void,
}

/**
 * BaseChartGrid component
 */
export const BaseChartGrid = (props) => {
    const gridProps = {
        grid: null,
        yAxisGrid: true,
        xAxisGrid: false,
        getGroupOuterWidth: null,
        getFirstVisibleGroupIndex: null,
        getVisibleGroupsCount: null,
        ...props,
    };

    const XAxisGrid = BaseChartXAxisGrid;
    const YAxisGrid = BaseChartYAxisGrid;

    return (
        <g>
            <XAxisGrid {...gridProps} />
            <YAxisGrid {...gridProps} />
        </g>
    );
};
