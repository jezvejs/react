import { BaseChartGridProps } from '../../types.ts';
import { BaseChartXAxisGrid } from './BaseChartXAxisGrid.tsx';
import { BaseChartYAxisGrid } from './BaseChartYAxisGrid.tsx';
import './BaseChartGrid.scss';

/**
 * BaseChartGrid component
 */
export const BaseChartGrid = (props: BaseChartGridProps) => {
    const defaultProps = {
        yAxisGrid: true,
        xAxisGrid: false,
    };

    const gridProps = {
        ...defaultProps,
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
