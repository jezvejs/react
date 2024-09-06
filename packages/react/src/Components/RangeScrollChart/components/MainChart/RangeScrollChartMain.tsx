// BaseChart
import { defaultProps as baseDefaultProps } from '../../../BaseChart/defaultProps.ts';

// Histogram
import { Histogram } from '../../../Histogram/Histogram.tsx';
import { HistogramComponents, HistogramProps } from '../../../Histogram/types.ts';
import { HistogramDataItem } from '../../../Histogram/components/DataItem/HistogramDataItem.tsx';
import { HistogramDataSeries } from '../../../Histogram/components/DataSeries/HistogramDataSeries.tsx';

// LineChart
import { LineChartDataItem } from '../../../LineChart/components/DataItem/LineChartDataItem.tsx';
import { LineChartDataPath } from '../../../LineChart/components/DataPath/LineChartDataPath.tsx';
import { LineChartDataSeries } from '../../../LineChart/components/DataSeries/LineChartDataSeries.tsx';
import { LineChart } from '../../../LineChart/LineChart.tsx';
import { LineChartComponents, LineChartProps } from '../../../LineChart/types.ts';

import { RangeScrollChartMainProps } from '../../types.ts';

/**
 * Range scroll chart: main chart component
 * @param {RangeScrollChartMainProps} p props
 */
export const RangeScrollChartMain = (p: RangeScrollChartMainProps) => {
    const defaultProps = {
        type: 'histogram',
        height: 300,
        resizeTimeout: 0,
    };

    const props: RangeScrollChartMainProps = {
        ...defaultProps,
        ...p,
    };

    const { type, ...commonProps } = props;

    if (type === 'linechart') {
        const lineChartDefaultProps = {
            drawNodeCircles: false,
            columnGap: 8,
            nodeCircleRadius: 3,
        };

        const components: LineChartComponents = {
            ...(baseDefaultProps.components ?? {}),
            ...(commonProps.components ?? {}),
            DataItem: LineChartDataItem,
            DataPath: LineChartDataPath,
            DataSeries: LineChartDataSeries,
        };
        const lineChartProps: LineChartProps = {
            ...baseDefaultProps,
            ...lineChartDefaultProps,
            ...commonProps,
            components,
        };

        return (
            <LineChart {...lineChartProps} />
        );
    }

    const components: HistogramComponents = {
        ...(baseDefaultProps.components ?? {}),
        ...(commonProps.components ?? {}),
        DataItem: HistogramDataItem,
        DataSeries: HistogramDataSeries,
    };
    const histogramProps: HistogramProps = {
        ...baseDefaultProps,
        ...commonProps,
        components,
    };

    return (
        <Histogram {...histogramProps} />
    );
};
