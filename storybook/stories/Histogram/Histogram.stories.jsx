// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { useState } from 'react';
import { Histogram, px } from '@jezvejs/react';

import { chartData, chartData2, chartMultiData } from '../../assets/data/index.js';

import { RadioFieldset } from '../../Components/RadioFieldset/RadioFieldset.jsx';
import { RangeInputField } from '../../Components/RangeInputField/RangeInputField.jsx';

import { CustomActiveGroup } from './components/CustomActiveGroup/CustomActiveGroup.jsx';

import { maxColumnWidthData } from './data.js';
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

export const Default = {
    args: {
        data: chartData,
    },
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
                <div {...wrapperProps}>
                    <Histogram {...chartProps} />
                </div>
                <div className="section-controls">
                    <RangeInputField {...heightProps} />
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
                        <RadioFieldset {...item} key={item.id} />
                    ))}
                </div>
            </div>
        );
    },
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
};
