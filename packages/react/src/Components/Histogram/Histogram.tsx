import classNames from 'classnames';

import { BaseChart, BaseChartHelpers } from '../BaseChart/BaseChart.tsx';
import { BaseChartItemSearchResult, BaseChartState } from '../BaseChart/types.ts';

import { HistogramDataItem } from './components/DataItem/HistogramDataItem.tsx';
import { HistogramDataSeries } from './components/DataSeries/HistogramDataSeries.tsx';

import {
    HistogramAlignedXOptions,
    HistogramComponents,
    HistogramDataItemType,
    HistogramItemProps,
    HistogramProps,
    HistogramState,
} from './types.ts';
import './Histogram.scss';

export * from './types.ts';

/**
 * Histogram component
 */
export const Histogram: React.FC<HistogramProps> = (props: HistogramProps) => {
    const defaultProps = {
        yAxisGrid: true,
        xAxisGrid: false,
    };

    const components: HistogramComponents = {
        ...props.components,
        DataItem: HistogramDataItem,
        DataSeries: HistogramDataSeries,
    };

    const chartProps: HistogramProps = {
        ...defaultProps,
        ...props,

        columnGap: 0,
        className: classNames('histogram', props.className),

        getColumnOuterWidth: (state: HistogramState): number => (
            state.columnWidth + (state.columnGap ?? 0)
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
            (state.getColumnOuterWidth?.(state) ?? 0) * state.columnsInGroup
            - (state.columnGap ?? 0)
        ),

        getGroupOuterWidth: (state: BaseChartState): number => {
            const chartState = state as HistogramState;
            return (chartState.getGroupWidth?.(chartState) ?? 0) + chartState.groupsGap;
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

            let x = state.getX?.(item, groupWidth, columnWidth) ?? 0;
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
            const result = BaseChartHelpers.findItemByEvent<HistogramDataItemType>(e, state, elem);
            if (!Array.isArray(result.item)) {
                return result;
            }

            let item: HistogramDataItemType | null = null;
            let index = -1;

            const chartState = state as HistogramState;
            const groupWidth = chartState.getGroupWidth?.(chartState) ?? 0;
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
                    bar
                    && x >= bar.x
                    && x < bar.x + bar.width
                    && y >= bar.y
                    && y < bar.y + bar.height
                ));
                // Find column closest to the mouse coordinates
                if (index === -1) {
                    const diffs = result.item.map((bar, ind) => ({
                        bar,
                        ind,
                        diff: (bar) ? Math.min(
                            Math.abs(y - bar.y),
                            Math.abs(y - bar.y - bar.height),
                        ) : 0,
                    })).filter(({ bar }) => (bar && x >= bar.x && x < bar.x + bar.width));

                    if (diffs.length > 0) {
                        diffs.sort((a, b) => a.diff - b.diff);
                        index = diffs[0].ind;
                    }
                }
            } else {
                index = result.item.findIndex((bar) => (
                    bar
                    && x >= bar.x
                    && x < bar.x + bar.width
                ));
            }

            if (index >= 0 && index < result.item.length) {
                item = result.item[index] as HistogramDataItemType;
            } else {
                index = -1;
            }

            const res: BaseChartItemSearchResult = {
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
            const columnWidth = state.getColumnOuterWidth?.(state) ?? 0;

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

            itemProps.x = state.getAlignedX?.({
                item: itemProps,
                groupWidth,
                columnWidth,
                alignColumns: state.alignColumns,
                groupsGap: state.groupsGap,
            }, state) ?? 0;

            return itemProps;
        },

        components,
    };

    return (
        <BaseChart {...chartProps} />
    );
};
