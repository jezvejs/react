import classNames from 'classnames';

import { BaseChart, BaseChartHelpers } from '../BaseChart/BaseChart.tsx';
import { BaseChartItemSearchResult, BaseChartState } from '../BaseChart/types.ts';

import { HistogramDataItem } from './components/DataItem/HistogramDataItem.tsx';
import { HistogramDataSeries } from './components/DataSeries/HistogramDataSeries.tsx';

import {
    HistogramAlignedXOptions,
    HistogramDataItemType,
    HistogramItemProps,
    HistogramProps,
    HistogramState,
} from './types.ts';
import './Histogram.scss';

/**
 * Histogram component
 */
export const Histogram = (props: HistogramProps) => {
    const defaultProps = {
        yAxisGrid: true,
        xAxisGrid: false,
    };

    const chartProps = {
        ...defaultProps,
        ...props,

        columnGap: 0,
        className: classNames('histogram', props.className),

        getColumnOuterWidth: (state: HistogramState): number => (
            state.columnWidth + state.columnGap
        ),

        /** Returns current count of columns in group */
        getColumnsInGroupCount: (state: BaseChartState): number => {
            const chartState = state as HistogramState;
            const stackedGroups = chartState.getStackedGroups(chartState);
            return (chartState.data.stacked)
                ? Math.max(stackedGroups.length, 1)
                : chartState.dataSets.length;
        },

        getGroupWidth: (state: HistogramState): number => (
            state.getColumnOuterWidth(state) * state.columnsInGroup - state.columnGap
        ),

        getGroupOuterWidth: (state: BaseChartState): number => {
            const chartState = state as HistogramState;
            return chartState.getGroupWidth(chartState) + chartState.groupsGap;
        },

        getX: (item: HistogramDataItemType, groupWidth: number, columnWidth: number): number => (
            item.groupIndex * groupWidth + item.columnIndex * columnWidth
        ),

        getAlignedX: (options: HistogramAlignedXOptions, state: HistogramState): number => {
            const {
                item = null,
                groupWidth = 0,
                columnWidth = 0,
                alignColumns = 'left',
                groupsGap = 0,
            } = (options ?? {});

            if (!item) {
                return NaN;
            }

            let x = state.getX(item, groupWidth, columnWidth);
            if (alignColumns === 'right') {
                x += groupsGap;
            } else if (alignColumns === 'center') {
                x += groupsGap / 2;
            }

            return x;
        },

        isVisibleValue: (value: number) => (value < 0 || value > 0),

        isHorizontalScaleNeeded: (state: BaseChartState, prevState?: BaseChartState): boolean => {
            const chartState = state as HistogramState;
            const prevChartState = prevState as HistogramState;

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

            let item: HistogramDataItemType | null = null;
            let index = -1;

            const chartState = state as HistogramState;
            const groupWidth = chartState.getGroupWidth(chartState);
            const groupOuterWidth = chartState.getGroupOuterWidth(chartState);
            const groupX = groupOuterWidth * result.index;
            let x = result?.x ?? 0;

            if (chartState.data.stacked) {
                // Fix x coordinate if curson is between groups
                if (x >= groupX + groupWidth && x < groupX + groupOuterWidth) {
                    x = groupX + groupWidth - 1;
                }

                const y = e.nativeEvent.offsetY;
                index = result.item.findIndex((bar) => (
                    x >= bar.x
                    && x < bar.x + bar.width
                    && y >= bar.y
                    && y < bar.y + bar.height
                ));
                // Find column closest to the mouse coordinates
                if (index === -1) {
                    const diffs = result.item.map((bar, ind) => ({
                        bar,
                        ind,
                        diff: Math.min(
                            Math.abs(y - bar.y),
                            Math.abs(y - bar.y - bar.height),
                        ),
                    })).filter(({ bar }) => (x >= bar.x && x < bar.x + bar.width));

                    if (diffs.length > 0) {
                        diffs.sort((a, b) => a.diff - b.diff);
                        index = diffs[0].ind;
                    }
                }
            } else {
                index = result.item.findIndex((bar) => (
                    x >= bar.x
                    && x < bar.x + bar.width
                ));
            }

            if (index >= 0 && index < result.item.length) {
                item = result.item[index];
            } else {
                index = -1;
            }

            const res = {
                item,
                index,
                group: result.item,
                value: item?.value,
                valueOffset: item?.valueOffset,
                groupIndex: item?.groupIndex,
                columnIndex: item?.columnIndex,
                category: item?.category,
                categoryIndex: item?.categoryIndex,
                series: result.series,
            };

            return res;
        },

        createItem: (
            data: HistogramItemProps,
            state: HistogramState,
        ): HistogramDataItemType | null => {
            const value = data?.value ?? 0;
            if (!state.isVisibleValue(value)) {
                return null;
            }

            const { grid } = state;
            if (!grid) {
                return null;
            }

            const valueOffset = data?.valueOffset ?? 0;
            const y0 = grid.getY(valueOffset);
            const y1 = grid.getY(value + valueOffset);
            const height = grid.roundToPrecision(Math.abs(y0 - y1), 1);
            const groupWidth = state.getGroupOuterWidth(state);
            const columnWidth = state.getColumnOuterWidth(state);

            const itemProps: HistogramDataItemType = {
                ...data,
                value,
                valueOffset,
                x: 0,
                y: Math.min(y0, y1),
                width: state.columnWidth,
                height,
                autoScale: state.autoScale,
                animate: state.animate,
                animateNow: state.animateNow,
                stacked: state.data?.stacked ?? false,
            };

            itemProps.x = state.getAlignedX({
                item: itemProps,
                groupWidth,
                columnWidth,
                alignColumns: state.alignColumns,
                groupsGap: state.groupsGap,
            }, state);

            return itemProps;
        },

        components: {
            ...props.components,
            DataItem: HistogramDataItem,
            DataSeries: HistogramDataSeries,
        },
    };

    return (
        <BaseChart {...chartProps} />
    );
};
