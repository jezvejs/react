import classNames from 'classnames';
import { useRef, useState } from 'react';

// Utils
import { minmax } from '../../utils/common.ts';
import { StoreProviderContext } from '../../utils/Store/StoreProvider.tsx';

// Global components
import { BaseChartProps, BaseChartState } from '../BaseChart/types.ts';
import { defaultProps as baseDefaultProps } from '../BaseChart/defaultProps.ts';

// Histogram
import { Histogram } from '../Histogram/Histogram.tsx';
import { HistogramComponents, HistogramProps } from '../Histogram/types.ts';
import { HistogramDataItem } from '../Histogram/components/DataItem/HistogramDataItem.tsx';
import { HistogramDataSeries } from '../Histogram/components/DataSeries/HistogramDataSeries.tsx';

// LineChart
import { LineChartDataItem } from '../LineChart/components/DataItem/LineChartDataItem.tsx';
import { LineChartDataPath } from '../LineChart/components/DataPath/LineChartDataPath.tsx';
import { LineChartDataSeries } from '../LineChart/components/DataSeries/LineChartDataSeries.tsx';
import { LineChart } from '../LineChart/LineChart.tsx';
import { LineChartComponents, LineChartProps } from '../LineChart/types.ts';

import { RangeSlider } from '../RangeSlider/RangeSlider.tsx';
import { RangeSliderBeforeChangeType, RangeSliderProps, RangeSliderValue } from '../RangeSlider/types.ts';

import {
    getInitialState,
    getSliderChangeType,
    getSliderEnd,
    getSliderStart,
} from './helpers.ts';
import { RangeScrollChartChangeType, RangeScrollChartProps, RangeScrollChartState } from './types.ts';
import './RangeScrollChart.scss';

const chartTypesMap = {
    histogram: Histogram,
    linechart: LineChart,
};

/**
 * RangeScrollChart component
 */
export const RangeScrollChart = (props: RangeScrollChartProps) => {
    const {
        type = 'histogram',
        mainChart,
        navigationChart,
        navigationSlider,
    } = props;

    const mainStoreRef = useRef<StoreProviderContext | null>(null);
    const navStoreRef = useRef<StoreProviderContext | null>(null);

    const initialState = getInitialState(props);
    const [state, setState] = useState<RangeScrollChartState>(initialState);

    const getMainState = (): BaseChartState => (
        (mainStoreRef.current?.getState() as BaseChartState) ?? null
    );

    const onBeforeSliderChange = (
        value: RangeSliderValue,
        changeType: RangeScrollChartChangeType,
    ): RangeSliderValue => {
        // Skip single value because we working only with range
        if (typeof value === 'number') {
            return value;
        }

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
            const changeResult = onBeforeSliderChange({ start, end }, 'resize');
            if (typeof changeResult === 'number') {
                return;
            }
            ({ start, end } = changeResult);
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
            start = getSliderStart(state);
            end = getSliderEnd(state);
        }

        setState((prev) => ({
            ...prev,
            scrollLeft,
            start,
            end,
        }));
    };

    const onSliderChange = (value: RangeSliderValue) => {
        // Skip single value because we working only with range
        if (typeof value === 'number') {
            return;
        }

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
            const changeResult = onBeforeSliderChange(value, changeType);
            if (typeof changeResult === 'number') {
                return;
            }
            ({ start, end } = changeResult);
            columnWidth = maxColumnWidth;
            groupsGap = columnWidth / 4;
        }

        if (state.start === start && state.end === end) {
            return;
        }

        const maxScroll = Math.max(0, contentWidth - scrollerWidth);
        const scrollLeft = minmax(0, maxScroll, start * contentWidth);

        setState((prev: RangeScrollChartState) => ({
            ...prev,
            start,
            end,
            scrollLeft,
            columnWidth,
            groupsGap,
            chartScrollRequested: prev.scrollLeft !== scrollLeft,
        }));
    };

    const onSliderScroll = (value: RangeSliderValue) => {
        // Skip single value because we working only with range
        if (typeof value === 'number') {
            return;
        }

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

    const onMainStoreReady = (store: StoreProviderContext) => {
        mainStoreRef.current = store;
    };

    const onNavStoreReady = (store: StoreProviderContext) => {
        navStoreRef.current = store;
    };

    if (!(type in chartTypesMap)) {
        return null;
    }

    const ChartComponent = chartTypesMap[type];

    // Main chart
    const mainDefaultProps = {
        height: 300,
        resizeTimeout: 0,
    };

    const mainChartProps: Partial<BaseChartProps> = {
        ...mainDefaultProps,
        ...mainChart,

        allowLastXAxisLabelOverflow: false,

        columnWidth: state.columnWidth,
        groupsGap: state.groupsGap,
        scrollLeft: state.scrollLeft,

        onResize: onChartResize,
        onScroll: onChartScroll,
        onStoreReady: onMainStoreReady,
    };

    let main = null;
    if (type === 'linechart') {
        const defaultProps = {
            drawNodeCircles: false,
            columnGap: 8,
            nodeCircleRadius: 3,
        };

        const components: LineChartComponents = {
            ...(baseDefaultProps.components ?? {}),
            ...(mainChartProps.components ?? {}),
            DataItem: LineChartDataItem,
            DataPath: LineChartDataPath,
            DataSeries: LineChartDataSeries,
        };
        const lineChartProps: LineChartProps = {
            ...baseDefaultProps,
            ...defaultProps,
            ...mainChartProps,
            components,
        };

        main = (
            <LineChart {...lineChartProps} />
        );
    } else {
        const components: HistogramComponents = {
            ...(baseDefaultProps.components ?? {}),
            ...(mainChartProps.components ?? {}),
            DataItem: HistogramDataItem,
            DataSeries: HistogramDataSeries,
        };
        const histogramProps: HistogramProps = {
            ...baseDefaultProps,
            ...mainChartProps,
            components,
        };

        main = (
            <Histogram {...histogramProps} />
        );
    }

    // Range slider
    const rangeSliderProps: RangeSliderProps = {
        ...navigationSlider,
        range: true,
        className: 'range-scroll-chart__range-slider',
        min: 0,
        max: 1,
        step: null,
        beforeArea: true,
        afterArea: true,
        onBeforeChange: (
            value: RangeSliderValue,
            changeType: RangeSliderBeforeChangeType,
        ): RangeSliderValue => (
            onBeforeSliderChange(value, changeType as RangeScrollChartChangeType)
        ),
        onChange: (value) => onSliderChange(value),
        onScroll: (value) => onSliderScroll(value),
    };
    const rangeSlider = <RangeSlider {...rangeSliderProps} />;

    // Navigation chart
    const navDefaultProps = {
        height: 100,
        marginTop: 0,
        resizeTimeout: 0,
    };

    const navChartProps: BaseChartProps = {
        ...navDefaultProps,
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
