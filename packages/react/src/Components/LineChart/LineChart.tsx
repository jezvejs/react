import PropTypes from 'prop-types';
import classNames from 'classnames';

import { BaseChart, BaseChartHelpers } from '../BaseChart/BaseChart.tsx';

import { LineChartDataItem } from './components/DataItem/LineChartDataItem.tsx';
import { LineChartDataPath } from './components/DataPath/LineChartDataPath.tsx';
import { LineChartDataSeries } from './components/DataSeries/LineChartDataSeries.tsx';

import './LineChart.scss';

/**
 * LineChart component
 */
export const LineChart = (props) => {
    const chartProps = {
        yAxisGrid: true,
        xAxisGrid: false,
        drawNodeCircles: false,
        nodeCircleRadius: 4,
        scaleAroundAxis: false,

        ...props,

        columnGap: 0,
        className: classNames(
            'linechart',
            { linechart__nodes: !!props.drawNodeCircles },
            props.className,
        ),

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

        getX: (item, groupWidth) => (
            item.groupIndex * groupWidth
        ),

        getAlignedX: (options, state) => {
            const {
                groupIndex = 0,
                groupWidth = 0,
                alignColumns = 'left',
            } = options;

            let x = state.getX({ groupIndex }, groupWidth);
            if (alignColumns === 'right') {
                x += groupWidth;
            } else if (alignColumns === 'center') {
                x += groupWidth / 2;
            }

            return x;
        },

        getGroupIndexByX: (value, state) => {
            const { alignColumns } = state;
            const groupWidth = state.getGroupOuterWidth(state);

            let x = parseFloat(value);
            if (alignColumns === 'left') {
                x += groupWidth / 2;
            } else if (alignColumns === 'right') {
                x -= groupWidth / 2;
            }

            return Math.floor(x / groupWidth);
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

            const y = e.nativeEvent.offsetY;
            const diffs = result.item.map((item, ind) => ({ ind, diff: Math.abs(y - item.cy) }));
            diffs.sort((a, b) => a.diff - b.diff);

            let item = null;
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
                columnIndex: item?.columnIndex,
                value: item?.value,
                valueOffset: item?.valueOffset,
            };

            return res;
        },

        createItem: (data, state) => {
            const { grid, alignColumns } = state;
            if (!grid) {
                return null;
            }

            const value = data?.value ?? 0;
            const valueOffset = data?.valueOffset ?? 0;
            const groupWidth = state.getGroupOuterWidth(state);

            const itemProps = {
                ...data,
                value,
                valueOffset,
                cx: state.getAlignedX({
                    groupIndex: data.groupIndex,
                    groupWidth,
                    alignColumns,
                }, state),
                cy: grid.getY(value + valueOffset),
                r: state.nodeCircleRadius,
            };

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

LineChart.propTypes = {
    ...BaseChart.propTypes,
    drawNodeCircles: PropTypes.bool,
    components: PropTypes.shape({
        ...BaseChart.childComponents,
        DataPath: PropTypes.func,
    }),
};
