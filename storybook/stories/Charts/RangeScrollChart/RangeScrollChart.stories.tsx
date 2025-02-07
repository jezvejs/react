import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { RangeScrollChart } from '@jezvejs/react';
import { chartData, chartMultiData } from '../../../common/assets/data/index.ts';
import './RangeScrollChart.stories.scss';

type Story = StoryObj<typeof RangeScrollChart>;

const meta: Meta<typeof RangeScrollChart> = {
    title: 'Charts/RangeScrollChart',
    component: RangeScrollChart,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};
export default meta;

export const HistogramType: Story = {
    args: {
        type: 'histogram',
        mainChart: {
            data: chartData,
            maxColumnWidth: 40,
        },
    },
};

export const LineChartType: Story = {
    args: {
        type: 'linechart',
        mainChart: {
            data: chartData,
            maxColumnWidth: 40,
        },
    },
};

export const MultiColumn: Story = {
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
