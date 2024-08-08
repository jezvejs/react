import classNames from 'classnames';

import { BaseChart, BaseChartHelpers } from '../BaseChart/BaseChart.tsx';

import { HistogramDataItem } from './components/DataItem/HistogramDataItem.tsx';
import { HistogramDataSeries } from './components/DataSeries/HistogramDataSeries.tsx';

import './Histogram.scss';

/**
 * Histogram component
 */
export const Histogram = (props) => {
    const chartProps = {
        yAxisGrid: true,
        xAxisGrid: false,

        ...props,

        columnGap: 0,
        className: classNames('histogram', props.className),

        getColumnOuterWidth: (state) => (
            state.columnWidth + state.columnGap
        ),

        /** Returns current count of columns in group */
        getColumnsInGroupCount: (state) => {
            const stackedGroups = state.getStackedGroups(state);
            return (state.data.stacked)
                ? Math.max(stackedGroups.length, 1)
                : state.dataSets.length;
        },

        getGroupWidth: (state) => (
            state.getColumnOuterWidth(state) * state.columnsInGroup - state.columnGap
        ),

        getGroupOuterWidth: (state) => (
            state.getGroupWidth(state) + state.groupsGap
        ),

        getX: (item, groupWidth, columnWidth) => (
            item.groupIndex * groupWidth + item.columnIndex * columnWidth
        ),

        getAlignedX: (options, state) => {
            const {
                item = null,
                groupWidth = 0,
                columnWidth = 0,
                alignColumns = 'left',
                groupsGap = 0,
            } = (options ?? {});

            let x = state.getX(item, groupWidth, columnWidth);
            if (alignColumns === 'right') {
                x += groupsGap;
            } else if (alignColumns === 'center') {
                x += groupsGap / 2;
            }

            return x;
        },

        isVisibleValue: (value) => (value < 0 || value > 0),

        isHorizontalScaleNeeded: (state, prevState = {}) => (
            BaseChartHelpers.isHorizontalScaleNeeded(state, prevState)
            || state.columnGap !== prevState?.columnGap
        ),

        /** Find item by event object */
        findItemByEvent: (e, state, elem) => {
            const result = BaseChartHelpers.findItemByEvent(e, state, elem);
            if (!Array.isArray(result.item)) {
                return result;
            }

            let item = null;
            let index = -1;

            const groupWidth = state.getGroupWidth(state);
            const groupOuterWidth = state.getGroupOuterWidth(state);
            const groupX = groupOuterWidth * result.index;
            let { x } = result;

            if (state.data.stacked) {
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

        createItem: (data, state) => {
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

            const itemProps = {
                ...data,
                value,
                valueOffset,
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

Histogram.propTypes = {
    ...BaseChart.propTypes,
};
