// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { RangeScrollChart } from '@jezvejs/react';
import { chartData, chartMultiData } from '../../assets/data/index.js';
import './RangeScrollChart.stories.scss';

export default {
    title: 'Charts/RangeScrollChart',
    component: RangeScrollChart,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export const HistogramType = {
    args: {
        type: 'histogram',
        mainChart: {
            data: chartData,
            maxColumnWidth: 40,
        },
    },
};

export const LineChartType = {
    args: {
        type: 'linechart',
        mainChart: {
            data: chartData,
            maxColumnWidth: 40,
        },
    },
};

export const MultiColumn = {
    args: {
        type: 'histogram',
        mainChart: {
            data: chartMultiData,
            maxColumnWidth: 40,
            showPopupOnClick: true,
        },
        navigationChart: {
            showLegend: true,
        },
    },
};
