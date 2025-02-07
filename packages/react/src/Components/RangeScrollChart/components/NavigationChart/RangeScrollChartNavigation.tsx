import { Histogram, HistogramProps } from '../../../Histogram/Histogram.tsx';
import { LineChart, LineChartProps } from '../../../LineChart/LineChart.tsx';

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

    const navChartProps = {
        ...defaultProps,
        ...commonProps,
        className: 'range-scroll-chart__nav-chart',
        fitToWidth: true,
    };

    if (typeof type !== 'string' || !(type in chartTypesMap)) {
        return null;
    }

    if (type === 'linechart') {
        const lineChartProps = navChartProps as LineChartProps;

        return (
            <LineChart {...lineChartProps} />
        );
    }

    const histogramProps = navChartProps as HistogramProps;

    return (
        <Histogram {...histogramProps} />
    );
};
