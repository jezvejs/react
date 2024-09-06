import { BaseChartProps } from '../../../BaseChart/types.ts';
import { Histogram } from '../../../Histogram/Histogram.tsx';
import { LineChart } from '../../../LineChart/LineChart.tsx';

import { RangeScrollChartNavigationProps } from '../../types.ts';
import './RangeScrollChartNavigation.scss';

const chartTypesMap = {
    histogram: Histogram,
    linechart: LineChart,
};

/**
 * Range scroll chart: navigation chart component
 * @param {RangeScrollChartNavigationProps} p props
 */
export const RangeScrollChartNavigation = (p: RangeScrollChartNavigationProps) => {
    const defaultProps = {
        height: 100,
        marginTop: 0,
        resizeTimeout: 0,
    };

    const props = {
        ...defaultProps,
        ...p,
    };

    const { type, ...commonProps } = props;

    const navChartProps: BaseChartProps = {
        ...defaultProps,
        ...commonProps,
        className: 'range-scroll-chart__nav-chart',
        fitToWidth: true,
    };

    if (!(type in chartTypesMap)) {
        return null;
    }

    const ChartComponent = chartTypesMap[type];

    return (
        <ChartComponent {...navChartProps} />
    );
};
