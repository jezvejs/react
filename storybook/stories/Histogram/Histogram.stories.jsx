// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { useState } from 'react';
import { Histogram, px } from '@jezvejs/react';

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
} from '../../assets/data/index.js';
import { largeData } from '../../assets/data/largeData.js';

// Global components
import { ActionButton } from '../../Components/ActionButton/ActionButton.jsx';
import { ChartCategoriesPopup } from '../../Components/ChartCategoriesPopup/ChartCategoriesPopup.jsx';
import { ChartCustomLegend } from '../../Components/ChartCustomLegend/ChartCustomLegend.jsx';
import { ChartMultiColumnPopup } from '../../Components/ChartMultiColumnPopup/ChartMultiColumnPopup.jsx';
import { RadioFieldset } from '../../Components/RadioFieldset/RadioFieldset.jsx';
import { RangeInputField } from '../../Components/RangeInputField/RangeInputField.jsx';

// Local components
import { CustomActiveGroup } from './components/CustomActiveGroup/CustomActiveGroup.jsx';

import {
    chartGroupedCategoriesData,
    chartGroupedData,
    gapData,
    legendCategoriesData,
    maxColumnWidthData,
} from './data.js';
import { formatAsUSD, formatDecimalValue } from './helpers.js';
import './Histogram.stories.scss';

export default {
    title: 'Charts/Histogram',
    component: Histogram,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

const chartContainerDecorator = (Story) => (
    <div className="chart-container">
        <Story />
    </div>
);

export const Default = {
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
            onChange: (e) => {
                const columnWidth = parseInt(e.target.value, 10);
                setState((prev) => ({ ...prev, columnWidth }));
            },
        };

        const grGapProps = {
            title: 'groupsGap:',
            min: 1,
            max: 50,
            value: state.groupsGap,
            onChange: (e) => {
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
                <div className="section-controls">
                    <RangeInputField {...colWidthProps} />
                    <RangeInputField {...grGapProps} />
                </div>
            </>
        );
    },
};

/**
 * 'fitToWidth' option
 */
export const FitToWidth = {
    args: {
        data: chartData,
        fitToWidth: true,
    },
    decorators: [chartContainerDecorator],
};

/**
 * x-axis label for the second column should be hidded.
 */
export const HorizontalLabels = {
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
export const AutoHeight = {
    args: {
        maxColumnWidth: 38,
        groupsGap: 3,
        data: chartData,
    },
    decorators: [chartContainerDecorator],
    render: function Render(args) {
        const [state, setState] = useState({
            ...args,
            maxColumnWidth: 38,
            groupsGap: 3,
            height: null,
        });

        const heightProps = {
            title: 'Height:',
            min: 50,
            max: 600,
            value: 300,
            onChange: (e) => {
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
                height: px(state.height),
            },
        };

        return (
            <>
                <div className="section-controls">
                    <RangeInputField {...heightProps} />
                </div>
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
export const MaxColumnWidth = {
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
export const ChartAxes = {
    args: {
        data: maxColumnWidthData,
        maxColumnWidth: 75,
        fitToWidth: true,
    },
    decorators: [chartContainerDecorator],
    render: function Render(args) {
        const [state, setState] = useState({
            xAxis: 'bottom',
            yAxis: 'right',
            yAxisLabelsAlign: 'left',
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
            onChange: (xAxis) => {
                setState((prev) => ({ ...prev, xAxis }));
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
            onChange: (yAxis) => {
                setState((prev) => ({ ...prev, yAxis }));
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
            onChange: (yAxisLabelsAlign) => {
                setState((prev) => ({ ...prev, yAxisLabelsAlign }));
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
                <div className="section-controls">
                    {items.map((item) => (
                        <RadioFieldset {...item} key={item.radioName} />
                    ))}
                </div>
            </div>
        );
    },
};

/**
 * 'xAxisGrid' option
 */
export const XAxisGrid = {
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
export const AutoScale = {
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
export const Callbacks = {
    args: {
        data: chartData2,
        height: 320,
        marginTop: 35,
        scrollToEnd: true,
        autoScale: true,
        animate: true,
        showPopupOnClick: true,
        activateOnClick: true,
        renderPopup: (target) => formatAsUSD(target.item.value),
        renderXAxisLabel: formatDecimalValue,
        renderYAxisLabel: formatDecimalValue,
    },
    decorators: [chartContainerDecorator],
};

/**
 * Multi column + Legend + 'showPopupOnHover' and 'activateOnHover' options
 */
export const MultiColumn = {
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
export const AlignColumns = {
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
            alignColumns: 'left',
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
            onChange: (alignColumns) => (
                setState((chartState) => ({
                    ...chartState,
                    alignColumns,
                }))
            ),
        }];

        const chartProps = {
            ...args,
            ...state,
        };

        return (
            <div>
                <Histogram {...chartProps} />
                <div className="section-controls">
                    {items.map((item) => (
                        <RadioFieldset {...item} key={item.radioName} />
                    ))}
                </div>
            </div>
        );
    },
};

/**
 * Multi column + Legend + 'showPopupOnHover' and 'activateOnHover' options
 */
export const ActiveGroup = {
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
export const CustomActiveGroupComponent = {
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
export const Stacked = {
    args: {
        data: chartStackedData,
        height: 320,
        marginTop: 35,
        autoScale: true,
        showPopupOnClick: true,
        activateOnClick: true,
        activateOnHover: true,
        showLegend: true,
        activateCategoryOnClick: true,
        components: {
            Legend: ChartCustomLegend,
            ChartPopup: ChartMultiColumnPopup,
        },
    },
    decorators: [chartContainerDecorator],
};

export const StackedNegative = {
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
export const StackedGrouped = {
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
export const StackedCategories = {
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
            ChartPopup: ChartCategoriesPopup,
        },
    },
    decorators: [chartContainerDecorator],
};

/**
 * 'onlyVisibleCategoriesLegend' option. Default value if false
 */
export const LegendCategories = {
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

export const SetData = {
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
        const [state, setState] = useState({
            data: negPosData,
        });

        const setData = (data) => {
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
                <div className="section-controls">
                    {items.map((item) => (
                        <ActionButton
                            {...item}
                            onClick={() => setData(item.data)}
                            key={item.id}
                        />
                    ))}
                </div>
            </div>
        );
    },
};
