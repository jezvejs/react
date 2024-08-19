import { useRef, useState } from 'react';
import classNames from 'classnames';

import { minmax } from '../../utils/common.ts';

import { BaseChartProps, BaseChartState } from '../BaseChart/types.ts';
import { Histogram } from '../Histogram/Histogram.tsx';
import { LineChart } from '../LineChart/LineChart.tsx';
import { RangeSlider } from '../RangeSlider/RangeSlider.tsx';
import { RangeSliderProps } from '../RangeSlider/types.ts';

import {
    getSliderChangeType,
    getSliderEnd,
    getSliderStart,
} from './helpers.ts';
import './RangeScrollChart.scss';
import { Store } from '../../utils/Store/Store.ts';

export type RangeScrollChartData = BaseChartProps;

export interface RangeScrollChartProps {
    className: string,
    type: 'histogram' | 'linechart',
    hideScrollBar: boolean,
    mainChart: RangeScrollChartData,
    navigationChart: RangeScrollChartData,
    navigationSlider: RangeSliderProps,
}

const chartTypesMap = {
    histogram: Histogram,
    linechart: LineChart,
};
const chartTypes = Object.keys(chartTypesMap);

/**
 * RangeScrollChart component
 */
export const RangeScrollChart = (props) => {
    const {
        type = chartTypes[0],
        mainChart,
        navigationChart,
        navigationSlider,
    } = props;

    const mainStoreRef = useRef<Store | null>(null);
    const navStoreRef = useRef<Store | null>(null);

    const [state, setState] = useState({
        ...props,
        start: 0,
        end: 1,
        scrollLeft: 0,
        columnWidth: 0,
        groupsGap: 0,
        scrollBarSize: 0,
        chartScrollRequested: false,
    });

    const getMainState = (): BaseChartState => (
        (mainStoreRef.current?.getState() as BaseChartState) ?? null
    );

    const onBeforeSliderChange = (value, changeType) => {
        const mainState = getMainState();
        if (!mainState) {
            return value;
        }

        const { start, end } = value;
        if (state.start === start && state.end === end) {
            return value;
        }

        const {
            scrollerWidth,
            groupsCount,
            groupsGap,
            maxColumnWidth,
            columnsInGroup,
        } = mainState;

        const maxGroupWidth = maxColumnWidth * columnsInGroup;
        const maxContentWidth = (maxGroupWidth + groupsGap) * groupsCount;
        const minDelta = (scrollerWidth / maxContentWidth);
        const currentDelta = Math.abs(start - end);

        if (currentDelta < minDelta) {
            return (changeType === 'start')
                ? { start: end - minDelta, end }
                : { start, end: start + minDelta };
        }

        return value;
    };

    const onChartResize = () => {
        const mainState = getMainState();
        if (!mainState) {
            return;
        }

        if (state.chartScrollRequested) {
            return;
        }

        /*
        const { chartScroller } = this.mainChart;
        const scrollBarSize = chartScroller.offsetHeight - chartScroller.clientHeight;
        */
        const scrollBarSize = 15;

        let { start, end } = state;
        const {
            groupsCount,
            maxColumnWidth,
            scrollerWidth,
            columnsInGroup,
        } = mainState;
        let { groupsGap } = mainState;
        const contentWidth = scrollerWidth / Math.abs(start - end);
        const groupOuterWidth = contentWidth / groupsCount;
        groupsGap = groupOuterWidth / 5;
        const groupWidth = groupOuterWidth - groupsGap;
        let columnWidth = groupWidth / columnsInGroup;

        // Check new column width not exceeds value of 'maxColumnWidth' property
        if (columnWidth > maxColumnWidth) {
            ({ start, end } = onBeforeSliderChange({ start, end }, 'resize'));
            columnWidth = maxColumnWidth;
            groupsGap = columnWidth / 4;
        }

        setState((prev) => ({
            ...prev,
            columnWidth,
            groupsGap,
            scrollBarSize,
        }));
    };

    const onChartScroll = () => {
        const mainState = getMainState();
        if (!mainState) {
            return;
        }

        if (state.chartScrollRequested) {
            setState((prev) => ({
                ...prev,
                chartScrollRequested: false,
            }));
            return;
        }

        const {
            scrollLeft,
            scrollWidth,
            scrollerWidth,
        } = mainState;
        if (state.scrollLeft === scrollLeft) {
            return;
        }

        const delta = Math.abs(state.end - state.start);
        const maxScroll = Math.max(0, scrollWidth - scrollerWidth);

        let start = 0;
        let end = 1;
        if (scrollLeft < 0) {
            end = delta;
        } else if (scrollLeft > maxScroll) {
            start = 1 - delta;
        } else {
            start = getSliderStart({ scrollLeft, scrollWidth });
            end = getSliderEnd({ scrollLeft, scrollWidth, scrollerWidth });
        }

        setState((prev) => ({
            ...prev,
            scrollLeft,
            start,
            end,
        }));
    };

    const onSliderChange = (value) => {
        const mainState = getMainState();
        if (!mainState) {
            return;
        }

        const changeType = getSliderChangeType(value, state);
        if (changeType === null) {
            return;
        }

        let { start, end } = value;
        const {
            scrollerWidth,
            groupsCount,
            maxColumnWidth,
            columnsInGroup,
        } = mainState;
        let { groupsGap } = mainState;
        const contentWidth = scrollerWidth / Math.abs(start - end);
        const groupOuterWidth = contentWidth / groupsCount;
        const groupWidth = groupOuterWidth - groupsGap;
        let columnWidth = groupWidth / columnsInGroup;

        // Check new column width not exceeds value of 'maxColumnWidth' property
        if (columnWidth > maxColumnWidth) {
            ({ start, end } = onBeforeSliderChange(value, changeType));
            columnWidth = maxColumnWidth;
            groupsGap = columnWidth / 4;
        }

        if (state.start === start && state.end === end) {
            return;
        }

        const maxScroll = Math.max(0, contentWidth - scrollerWidth);
        const scrollLeft = minmax(0, maxScroll, start * contentWidth);

        setState((prev) => ({
            ...prev,
            start,
            end,
            scrollLeft,
            columnWidth,
            groupsGap,
            chartScrollRequested: prev.scrollLeft !== scrollLeft,
        }));
    };

    const onSliderScroll = (value) => {
        const mainState = getMainState();
        if (!mainState) {
            return;
        }

        let { start, end } = value;
        if (state.start === start && state.end === end) {
            return;
        }

        const delta = Math.abs(end - start);

        if (start < 0) {
            start = 0;
            end = delta;
        } else if (end > 1) {
            start = 1 - delta;
            end = 1;
        }

        const { chartContentWidth, scrollerWidth } = mainState;
        const maxScroll = Math.max(0, chartContentWidth - scrollerWidth);
        const scrollLeft = Math.min(maxScroll, start * chartContentWidth);

        setState((prev) => ({
            ...prev,
            start,
            end,
            scrollLeft,
            chartScrollRequested: true,
        }));
    };

    const onMainStoreReady = (store) => {
        mainStoreRef.current = store;
    };

    const onNavStoreReady = (store) => {
        navStoreRef.current = store;
    };

    const ChartComponent = chartTypesMap[type];

    // Main chart
    const mainChartProps = {
        height: 300,
        resizeTimeout: 0,
        ...mainChart,

        allowLastXAxisLabelOverflow: false,

        columnWidth: state.columnWidth,
        groupsGap: state.groupsGap,
        scrollLeft: state.scrollLeft,

        onResize: onChartResize,
        onScroll: onChartScroll,
        onStoreReady: onMainStoreReady,
    };

    const main = <ChartComponent {...mainChartProps} />;

    // Range slider
    const rangeSliderProps = {
        ...navigationSlider,
        range: true,
        className: 'range-scroll-chart__range-slider',
        min: 0,
        max: 1,
        step: null,
        beforeArea: true,
        afterArea: true,
        onBeforeChange: (value, changeType) => onBeforeSliderChange(value, changeType),
        onChange: (value) => onSliderChange(value),
        onScroll: (value) => onSliderScroll(value),
    };
    const rangeSlider = <RangeSlider {...rangeSliderProps} />;

    // Navigation chart
    const navChartProps = {
        height: 100,
        marginTop: 0,
        resizeTimeout: 0,
        ...navigationChart,
        className: 'range-scroll-chart__nav-chart',
        fitToWidth: true,
        data: navigationChart?.data ?? mainChart?.data,
        onStoreReady: onNavStoreReady,
        beforeScroller: rangeSlider,
    };
    const navigation = <ChartComponent {...navChartProps} />;

    return (
        <div className={classNames('range-scroll-chart', props.className)}>
            <div className="range-scroll-chart__slider-container">
                {main}
                {navigation}
            </div>
        </div>
    );
};
