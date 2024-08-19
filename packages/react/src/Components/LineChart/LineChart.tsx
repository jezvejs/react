import classNames from 'classnames';

// Global components
import { BaseChart, BaseChartHelpers } from '../BaseChart/BaseChart.tsx';
import { BaseChartItemSearchResult, BaseChartState } from '../BaseChart/types.ts';

// Local components
import { LineChartDataItem } from './components/DataItem/LineChartDataItem.tsx';
import { LineChartDataPath } from './components/DataPath/LineChartDataPath.tsx';
import { LineChartDataSeries } from './components/DataSeries/LineChartDataSeries.tsx';

import {
    LineChartAlignedXOptions,
    LineChartDataItemType,
    LineChartItemProps,
    LineChartProps,
    LineChartState,
} from './types.ts';
import './LineChart.scss';

/**
 * LineChart component
 */
export const LineChart = (props: LineChartProps) => {
    const defaultProps = {
        yAxisGrid: true,
        xAxisGrid: false,
        drawNodeCircles: false,
        nodeCircleRadius: 4,
        scaleAroundAxis: false,
    };

    const chartProps: LineChartProps = {
        ...defaultProps,
        ...props,

        columnGap: 0,
        className: classNames(
            'linechart',
            { linechart__nodes: !!props.drawNodeCircles },
            props.className,
        ),

        getColumnOuterWidth: (state: LineChartState): number => (
            state.columnWidth + state.columnGap
        ),

        /** Returns current count of columns in group */
        getColumnsInGroupCount: (state: BaseChartState): number => {
            const chartState = state as LineChartState;
            const stackedGroups = chartState.getStackedGroups(chartState);
            return (chartState.data.stacked)
                ? Math.max(stackedGroups.length, 1)
                : chartState.dataSets.length;
        },

        getGroupWidth: (state: LineChartState): number => (
            state.getColumnOuterWidth(state) * state.columnsInGroup - state.columnGap
        ),

        getGroupOuterWidth: (state: BaseChartState): number => {
            const chartState = state as LineChartState;
            return chartState.getGroupWidth(chartState) + chartState.groupsGap;
        },

        getX: (item: LineChartAlignedXOptions, groupWidth: number): number => (
            item.groupIndex * groupWidth
        ),

        getAlignedX: (
            options: LineChartAlignedXOptions,
            state: LineChartState,
        ) => {
            const {
                groupWidth = 0,
                alignColumns = 'left',
            } = options;

            let x = state.getX(options, groupWidth);
            if (alignColumns === 'right') {
                x += groupWidth;
            } else if (alignColumns === 'center') {
                x += groupWidth / 2;
            }

            return x;
        },

        getGroupIndexByX: (value: number, state: BaseChartState) => {
            const chartState = state as LineChartState;
            const { alignColumns } = chartState;
            const groupWidth = chartState.getGroupOuterWidth(chartState);

            let x = value;
            if (alignColumns === 'left') {
                x += groupWidth / 2;
            } else if (alignColumns === 'right') {
                x -= groupWidth / 2;
            }

            return Math.floor(x / groupWidth);
        },

        isVisibleValue: (value: number) => (value < 0 || value > 0),

        isHorizontalScaleNeeded: (state: BaseChartState, prevState?: BaseChartState): boolean => {
            const chartState = state as LineChartState;
            const prevChartState = prevState as LineChartState;

            return (
                BaseChartHelpers.isHorizontalScaleNeeded(chartState, prevChartState)
                || chartState.columnGap !== prevChartState?.columnGap
            );
        },

        /** Find item by event object */
        findItemByEvent: (
            e: React.MouseEvent,
            state: BaseChartState,
            elem: Element,
        ): BaseChartItemSearchResult | null => {
            const result = BaseChartHelpers.findItemByEvent(e, state, elem);
            if (!Array.isArray(result.item)) {
                return result;
            }

            const y = e.nativeEvent.offsetY;
            const diffs = result.item.map((item, ind) => ({ ind, diff: Math.abs(y - item.cy) }));
            diffs.sort((a, b) => a.diff - b.diff);

            let item: LineChartDataItemType | null = null;
            let index = diffs[0].ind;
            if (index >= 0 && index < result.item.length) {
                item = result.item[index];
            } else {
                index = -1;
            }

            const res = {
                item,
                index,
                series: result.series,
                group: result.item,
                groupIndex: item?.groupIndex,
                category: item?.category,
                categoryIndex: item?.categoryIndex,
                columnIndex: 0,
                value: item?.value,
                valueOffset: item?.valueOffset,
            };

            return res;
        },

        createItem: (
            data: LineChartItemProps,
            state: LineChartState,
        ): LineChartDataItemType | null => {
            const { grid, alignColumns } = state;
            if (!grid) {
                return null;
            }

            const value = data?.value ?? 0;
            const valueOffset = data?.valueOffset ?? 0;
            const groupWidth = state.getGroupOuterWidth(state);

            const itemProps: LineChartDataItemType = {
                ...data,
                value,
                valueOffset,
                cx: 0,
                cy: grid.getY(value + valueOffset),
                r: state.nodeCircleRadius,
            };

            itemProps.cx = state.getAlignedX({
                groupIndex: itemProps.groupIndex,
                groupWidth,
                alignColumns,
            }, state);

            return itemProps;
        },

        components: {
            ...props.components,
            DataItem: LineChartDataItem,
            DataPath: LineChartDataPath,
            DataSeries: LineChartDataSeries,
        },
    };

    return (
        <BaseChart {...chartProps} />
    );
};
