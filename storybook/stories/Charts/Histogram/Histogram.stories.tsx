import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { useState } from 'react';
import {
    BaseChartDataProp,
    BaseChartHorizontalAlign,
    BaseChartPopupComponent,
    BaseChartXAxisLabelsPosition,
    BaseChartYAxisLabelsPosition,
    Histogram,
    HistogramProps,
    px,
} from '@jezvejs/react';

import {
    chartData,
    chartData2,
    chartData3,
    chartMultiData,
    chartNegMultiData,
    chartShortMultiData,
    chartStackedData,
    emptyData,
    negData,
    negPosData,
    posData,
    singleNegData,
} from 'common/assets/data/index.ts';
import { largeData } from 'common/assets/data/largeData.ts';

// Global components
import { ActionButton } from 'common/Components/ActionButton/ActionButton.tsx';
import { ChartCategoriesPopup } from 'common/Components/ChartCategoriesPopup/ChartCategoriesPopup.tsx';
import { ChartCustomLegend } from 'common/Components/ChartCustomLegend/ChartCustomLegend.tsx';
import { ChartMultiColumnPopup } from 'common/Components/ChartMultiColumnPopup/ChartMultiColumnPopup.tsx';
import { RadioFieldset } from 'common/Components/RadioFieldset/RadioFieldset.tsx';
import { RangeInputField } from 'common/Components/RangeInputField/RangeInputField.tsx';
import { SectionControls } from 'common/Components/SectionControls/SectionControls.tsx';

// Local components
import { CustomActiveGroup } from './components/CustomActiveGroup/CustomActiveGroup.tsx';

import {
    chartGroupedCategoriesData,
    chartGroupedData,
    gapData,
    legendCategoriesData,
    maxColumnWidthData,
} from './data.ts';
import { formatAsUSD, formatDecimalValue } from './helpers.ts';
import './Histogram.stories.scss';

type Story = StoryObj<typeof Histogram>;

const meta: Meta<typeof Histogram> = {
    title: 'Charts/Histogram',
    component: Histogram,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};
export default meta;

const chartContainerDecorator = (StoryComponent: StoryFn) => (
    <div className="chart-container">
        <StoryComponent />
    </div>
);

export const Default: Story = {
    args: {
        data: chartData,
    },
    decorators: [chartContainerDecorator],
    render: function Render(args) {
        const [state, setState] = useState({
            ...args,
            columnWidth: 38,
            groupsGap: 10,
        });

        const colWidthProps = {
            title: 'columnWidth:',
            min: 1,
            max: 50,
            value: state.columnWidth,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                const columnWidth = parseInt(e.target.value, 10);
                setState((prev) => ({ ...prev, columnWidth }));
            },
        };

        const grGapProps = {
            title: 'groupsGap:',
            min: 1,
            max: 50,
            value: state.groupsGap,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                const groupsGap = parseInt(e.target.value, 10);
                setState((prev) => ({ ...prev, groupsGap }));
            },
        };

        const chartProps = {
            ...args,
            ...state,
        };

        return (
            <>
                <Histogram {...chartProps} />
                <SectionControls>
                    <RangeInputField {...colWidthProps} />
                    <RangeInputField {...grGapProps} />
                </SectionControls>
            </>
        );
    },
};

/**
 * 'fitToWidth' option
 */
export const FitToWidth: Story = {
    args: {
        data: chartData,
        fitToWidth: true,
    },
    decorators: [chartContainerDecorator],
};

/**
 * x-axis label for the second column should be hidded.
 */
export const HorizontalLabels: Story = {
    args: {
        maxColumnWidth: 38,
        groupsGap: 3,
        data: maxColumnWidthData,
    },
    decorators: [chartContainerDecorator],
};

/**
 * Height update on resize. Set height to null to enable auto height.
 */
export const AutoHeight: Story = {
    args: {
        maxColumnWidth: 38,
        groupsGap: 3,
        data: chartData,
    },
    decorators: [chartContainerDecorator],
    render: function Render(args) {
        const [state, setState] = useState<HistogramProps>({
            ...args,
            maxColumnWidth: 38,
            groupsGap: 3,
            height: 0, // null,
        });

        const heightProps = {
            title: 'Height:',
            min: 50,
            max: 600,
            value: 300,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                const height = parseInt(e.target.value, 10);
                setState((prev) => ({ ...prev, height }));
            },
        };

        const chartProps = {
            ...args,
            ...state,
        };
        const wrapperProps = {
            style: {
                height: (state.height) ? px(state.height ?? 0) : '',
            },
        };

        return (
            <>
                <SectionControls>
                    <RangeInputField {...heightProps} />
                </SectionControls>
                <div {...wrapperProps}>
                    <Histogram {...chartProps} />
                </div>
            </>
        );
    },
};

/**
 * 'maxColumnWidth' option
 */
export const MaxColumnWidth: Story = {
    args: {
        data: maxColumnWidthData,
        maxColumnWidth: 75,
        fitToWidth: true,
    },
    decorators: [chartContainerDecorator],
};

const xAxisMap = {
    top: 'Top',
    bottom: 'Bottom',
    none: 'None',
};

const yAxisMap = {
    left: 'Left',
    right: 'Right',
    none: 'None',
};

const textAlignMap = {
    left: 'Left',
    right: 'Right',
    center: 'Center',
};

/**
 * 'xAxis', 'yAxis' and 'yAxisLabelsAlign' options
 */
export const ChartAxes: Story = {
    args: {
        data: maxColumnWidthData,
        maxColumnWidth: 75,
        fitToWidth: true,
    },
    decorators: [chartContainerDecorator],
    render: function Render(args) {
        const [state, setState] = useState({
            xAxis: 'bottom' as BaseChartXAxisLabelsPosition,
            yAxis: 'right' as BaseChartYAxisLabelsPosition,
            yAxisLabelsAlign: 'left' as BaseChartHorizontalAlign,
        });

        const items = [{
            title: 'X-Axis',
            radioName: 'xAxis',
            items: Object.entries(xAxisMap).map(([value, label]) => ({
                id: `xAxis_${value}`,
                value,
                label,
                checked: (state.xAxis === value),
            })),
            onChange: (xAxis: string) => {
                setState((prev) => ({
                    ...prev,
                    xAxis: xAxis as BaseChartXAxisLabelsPosition,
                }));
            },
        }, {
            title: 'Y-Axis',
            radioName: 'yAxis',
            items: Object.entries(yAxisMap).map(([value, label]) => ({
                id: `yAxis_${value}`,
                value,
                label,
                checked: (state.yAxis === value),
            })),
            onChange: (yAxis: string) => {
                setState((prev) => ({
                    ...prev,
                    yAxis: yAxis as BaseChartYAxisLabelsPosition,
                }));
            },
        }, {
            title: 'Y-Axis text align',
            radioName: 'yAxisLabelsAlign',
            items: Object.entries(textAlignMap).map(([value, label]) => ({
                id: `yAxisLabelsAlign_${value}`,
                value,
                label,
                checked: (state.yAxisLabelsAlign === value),
            })),
            onChange: (yAxisLabelsAlign: string) => {
                setState((prev) => ({
                    ...prev,
                    yAxisLabelsAlign: yAxisLabelsAlign as BaseChartHorizontalAlign,
                }));
            },
        }];

        const chartProps = {
            ...args,
            data: chartData2,
            ...state,
        };

        return (
            <div>
                <Histogram {...chartProps} />
                <SectionControls>
                    {items.map((item) => (
                        <RadioFieldset {...item} key={item.radioName} />
                    ))}
                </SectionControls>
            </div>
        );
    },
};

/**
 * 'xAxisGrid' option
 */
export const XAxisGrid: Story = {
    args: {
        data: chartData,
        xAxisGrid: true,
        className: 'x-axis-grid-chart',
    },
    decorators: [chartContainerDecorator],
};

/**
 * 'autoScale' option
 */
export const AutoScale: Story = {
    args: {
        data: chartData2,
        autoScale: true,
        className: 'histogram_autoscale',
    },
    decorators: [chartContainerDecorator],
};

/**
 * + 'animate', 'showPopupOnClick' and 'activateOnClick' options
 */
export const Callbacks: Story = {
    args: {
        data: chartData2,
        height: 320,
        marginTop: 35,
        scrollToEnd: true,
        autoScale: true,
        animate: true,
        showPopupOnClick: true,
        activateOnClick: true,
        renderPopup: (target) => formatAsUSD(target.value ?? 0),
        renderXAxisLabel: formatDecimalValue,
        renderYAxisLabel: formatDecimalValue,
    },
    decorators: [chartContainerDecorator],
};

/**
 * Multi column + Legend + 'showPopupOnHover' and 'activateOnHover' options
 */
export const MultiColumn: Story = {
    args: {
        data: chartMultiData,
        height: 320,
        marginTop: 35,
        autoScale: true,
        showPopupOnHover: true,
        activateOnHover: true,
        showLegend: true,
    },
    decorators: [chartContainerDecorator],
};

/**
 * 'alignColumns' option
 */
export const AlignColumns: Story = {
    args: {
        data: chartShortMultiData,
        maxColumnWidth: 40,
        fitToWidth: true,
        xAxisGrid: true,
        alignColumns: 'right',
        showPopupOnClick: true,
        activateOnClick: true,
        showPopupOnHover: true,
        activateOnHover: true,
    },
    decorators: [chartContainerDecorator],
    render: function Render(args) {
        const [state, setState] = useState({
            alignColumns: 'left' as BaseChartHorizontalAlign,
        });

        const alignMap = {
            left: 'Left',
            right: 'Right',
            center: 'Center',
        };

        const items = [{
            title: 'Align columns',
            radioName: 'align',
            items: Object.entries(alignMap).map(([value, label]) => ({
                id: `alignColumns_${value}`,
                value,
                label,
                checked: (state.alignColumns === value),
            })),
            onChange: (alignColumns: string) => (
                setState((chartState) => ({
                    ...chartState,
                    alignColumns: alignColumns as BaseChartHorizontalAlign,
                }))
            ),
        }];

        const chartProps: HistogramProps = {
            ...args,
            ...state,
        };

        return (
            <div>
                <Histogram {...chartProps} />
                <SectionControls>
                    {items.map((item) => (
                        <RadioFieldset {...item} key={item.radioName} />
                    ))}
                </SectionControls>
            </div>
        );
    },
};

/**
 * Multi column + Legend + 'showPopupOnHover' and 'activateOnHover' options
 */
export const ActiveGroup: Story = {
    args: {
        data: chartData2,
        height: 320,
        marginTop: 35,
        alignColumns: 'center',
        showActiveGroup: true,
        autoScale: true,
        activateOnClick: true,
        activateOnHover: true,
    },
    decorators: [chartContainerDecorator],
};

/**
 * Multi column + Legend + 'showPopupOnHover' and 'activateOnHover' options
 */
export const CustomActiveGroupComponent: Story = {
    args: {
        data: chartData2,
        height: 320,
        marginTop: 35,
        alignColumns: 'center',
        showActiveGroup: true,
        autoScale: true,
        activateOnClick: true,
        activateOnHover: true,
        components: {
            ActiveGroup: CustomActiveGroup,
        },
    },
    decorators: [chartContainerDecorator],
};

/**
 * Stacked + Custom legend. Data categories are activated by click on legend items.
 */
export const Stacked: Story = {
    args: {
        data: chartStackedData,
        height: 320,
        marginTop: 35,
        autoScale: true,
        showPopupOnClick: true,
        activateOnClick: true,
        activateOnHover: true,
        showLegend: true,
        components: {
            Legend: ChartCustomLegend,
            ChartPopup: ChartMultiColumnPopup,
        },
    },
    decorators: [chartContainerDecorator],
};

export const StackedNegative: Story = {
    args: {
        data: chartNegMultiData,
        height: 320,
        marginTop: 35,
        autoScale: true,
        showPopupOnClick: true,
        activateOnClick: true,
        activateOnHover: true,
        showLegend: true,
        components: {
            Legend: ChartCustomLegend,
            ChartPopup: ChartMultiColumnPopup,
        },
    },
    decorators: [chartContainerDecorator],
};

/**
 * Stacked and grouped + 'animatePopup' and 'pinPopupOnClick' options
 */
export const StackedGrouped: Story = {
    args: {
        data: chartGroupedData,
        height: 320,
        marginTop: 35,
        columnWidth: 25,
        groupsGap: 15,
        columnGap: 2,
        autoScale: true,
        showPopupOnClick: true,
        activateOnClick: true,
        activateOnHover: true,
        animatePopup: true,
        pinPopupOnClick: true,
        showLegend: true,
        components: {
            Legend: ChartCustomLegend,
            ChartPopup: ChartMultiColumnPopup,
        },
    },
    decorators: [chartContainerDecorator],
};

/**
 * Stacked and grouped with custom categories.
 * 'showPopupOnHover', 'animatePopup' and 'pinPopupOnClick' options
 */
export const StackedCategories: Story = {
    args: {
        data: chartGroupedCategoriesData,
        height: 320,
        marginTop: 35,
        columnWidth: 25,
        groupsGap: 15,
        columnGap: 2,
        autoScale: true,
        showPopupOnClick: true,
        showPopupOnHover: true,
        animatePopup: true,
        pinPopupOnClick: true,
        activateOnClick: true,
        activateOnHover: true,
        showLegend: true,
        components: {
            Legend: ChartCustomLegend,
            ChartPopup: ChartCategoriesPopup as BaseChartPopupComponent,
        },
    },
    decorators: [chartContainerDecorator],
};

/**
 * 'onlyVisibleCategoriesLegend' option. Default value if false
 */
export const LegendCategories: Story = {
    args: {
        data: legendCategoriesData,
        height: 320,
        marginTop: 35,
        columnWidth: 25,
        groupsGap: 15,
        columnGap: 2,
        autoScale: true,
        showPopupOnClick: true,
        showPopupOnHover: true,
        animatePopup: true,
        pinPopupOnClick: true,
        activateOnClick: true,
        activateOnHover: true,
        showLegend: true,
        onlyVisibleCategoriesLegend: true,
        components: {
            Legend: ChartCustomLegend,
            ChartPopup: ChartMultiColumnPopup,
        },
    },
    decorators: [chartContainerDecorator],
};

export const SetData: Story = {
    args: {
        data: negPosData,
        autoScale: true,
        showLegend: true,
        scrollToEnd: true,
        animate: true,
        components: {
            Legend: ChartCustomLegend,
        },
    },
    decorators: [chartContainerDecorator],
    render: function Render(args) {
        const [state, setState] = useState<Partial<HistogramProps>>({
            data: negPosData,
        });

        const setData = (data: BaseChartDataProp) => {
            setState((prev) => ({ ...prev, data }));
        };

        const items = [{
            id: 'emptyDataBtn',
            title: 'No data',
            data: emptyData,
        }, {
            id: 'singleNegDataBtn',
            title: 'Single negative',
            data: singleNegData,
        }, {
            id: 'posDataBtn',
            title: 'Only positive',
            data: posData,
        }, {
            id: 'negDataBtn',
            title: 'Only negative',
            data: negData,
        }, {
            id: 'negPosDataBtn',
            title: 'Negative and positive',
            data: negPosData,
        }, {
            id: 'multiColumnDataBtn',
            title: 'Multi column',
            data: chartData3,
        }, {
            id: 'stackedDataBtn',
            title: 'Stacked',
            data: chartStackedData,
        }, {
            id: 'stackedGroupedDataBtn',
            title: 'Stacked and grouped',
            data: chartGroupedCategoriesData,
        }, {
            id: 'largeDataBtn',
            title: 'Large data set',
            data: largeData,
        }, {
            id: 'gapDataBtn',
            title: 'Data with gap',
            data: gapData,
        }];

        const chartProps = {
            ...args,
            ...state,
        };

        return (
            <div>
                <Histogram {...chartProps} />
                <SectionControls>
                    {items.map((item) => (
                        <ActionButton
                            {...item}
                            onClick={() => setData(item.data)}
                            key={item.id}
                        />
                    ))}
                </SectionControls>
            </div>
        );
    },
};
