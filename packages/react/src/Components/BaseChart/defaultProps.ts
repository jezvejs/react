import { ChartGrid } from '../ChartGrid/ChartGrid.ts';

import { BaseChartActiveGroup } from './components/ActiveGroup/BaseChartActiveGroup.tsx';
import { BaseChartPopup } from './components/ChartPopup/BaseChartPopup.tsx';
import { BaseChartGrid } from './components/Grid/BaseChartGrid.tsx';
import { BaseChartLegend } from './components/Legend/BaseChartLegend.tsx';
import { BaseChartXAxisLabels } from './components/XAxisLabels/BaseChartXAxisLabels.tsx';
import { BaseChartYAxisLabels } from './components/YAxisLabels/BaseChartYAxisLabels.tsx';

import {
    findItemByEvent,
    getDataSets,
    getFirstVisibleGroupIndex,
    getGroupIndexByX,
    getLongestDataSet,
    getSeriesByIndex,
    getStackedCategories,
    getStackedGroups,
    getVisibleGroupsCount,
    isHorizontalScaleNeeded,
    isSameTarget,
    isVerticalScaleNeeded,
} from './helpers.ts';
import {
    BaseChartBaseItem,
    BaseChartDataCategory,
    BaseChartDataItemsGroup,
    BaseChartDataSet,
    BaseChartProps,
    BaseChartState,
    BaseChartTarget,
} from './types.ts';

/** Default properties */
export const defaultProps: BaseChartProps = {
    id: '',
    className: '',

    // Layout
    height: 300,
    columnWidth: 38,
    maxColumnWidth: 38,
    groupsGap: 10,
    marginTop: 10,
    alignColumns: 'left', // available values: 'left', 'right' and 'center'
    scrollLeft: 0,
    // Grid behavior
    visibilityOffset: 100,
    scaleAroundAxis: true,
    gridValuesMargin: 0.1,
    minGridStep: 30,
    maxGridStep: 60,
    xAxisGrid: false,
    yAxisGrid: true,
    // Render properties
    fitToWidth: false,
    allowLastXAxisLabelOverflow: true,
    scrollToEnd: false,
    autoScale: false,
    animate: false,
    animationEndTimeout: 500,
    autoScaleTimeout: 200,
    resizeTimeout: 200,
    activateOnClick: false,
    activateOnHover: false,
    xAxis: 'bottom', // available values: 'bottom', 'top' and 'none'
    yAxis: 'right', // available values: 'right', 'left' and 'none'
    yAxisLabelsAlign: 'left', // available values: 'left', 'right' and 'center'
    renderXAxisLabel: null,
    renderYAxisLabel: null,
    showLegend: false,
    renderLegend: null,
    onlyVisibleCategoriesLegend: false,
    // Active group
    showActiveGroup: false,
    // Popup
    showPopupOnClick: false,
    pinPopupOnClick: false,
    showPopupOnHover: false,
    animatePopup: false,
    renderPopup: null,
    popupPosition: 'right',
    // Callbacks
    onScroll: null,
    onResize: null,
    onItemClick: null,
    onItemOver: null,
    onItemOut: null,
    scrollDone: null,
    // Data
    data: {
        values: [],
        series: [],
        stacked: false,
    },
    reducers: null,

    // Data methods
    getGroupOuterWidth: (state: BaseChartState) => (
        (state.columnWidth ?? 0) + (state.groupsGap ?? 0)
    ),

    /** Returns count of data categories */
    getCategoriesCount: (state: BaseChartState) => state.dataSets.length,

    /** Returns current count of columns in group */
    getColumnsInGroupCount: () => 1,

    /** Returns count of data columns */
    getGroupsCount: (state: BaseChartState): number => {
        const valuesLength = state?.dataSets?.map((item) => item.data.length) ?? [];
        return Math.max(0, ...valuesLength);
    },

    /** Returns array of data sets */
    getDataSets: (state: BaseChartState) => getDataSets(state),

    /** Returns longest data set */
    getLongestDataSet: (state: BaseChartState) => getLongestDataSet(state),

    getStackedGroups: (state: BaseChartState) => getStackedGroups(state),

    getStackedCategories: (state: BaseChartState) => getStackedCategories(state),

    /** Returns index of first visible item */
    getFirstVisibleGroupIndex: (state: BaseChartState) => getFirstVisibleGroupIndex(state),

    /** Returns count of visible items from specified index */
    getVisibleGroupsCount: (firstItemIndex: number, state: BaseChartState) => (
        getVisibleGroupsCount(firstItemIndex, state)
    ),

    /** Returns series value for specified items group */
    getSeriesByIndex: (index: number, state: BaseChartState) => getSeriesByIndex(index, state),

    /** Returns group index for specified position on x-axis */
    getGroupIndexByX: (x: number, state: BaseChartState) => getGroupIndexByX(x, state),

    isHorizontalScaleNeeded: (state: BaseChartState, prevState?: BaseChartState) => (
        isHorizontalScaleNeeded(state, prevState)
    ),

    isVerticalScaleNeeded: (state: BaseChartState, prevState?: BaseChartState) => (
        isVerticalScaleNeeded(state, prevState)
    ),

    getVisibleCategories(state: BaseChartState) {
        const { dataSets } = state;
        if (dataSets.length === 0) {
            return [];
        }

        const categories: BaseChartDataCategory[] = [];
        const stackedGroups = state.getStackedGroups(state);
        const stackedCategories = state.getStackedCategories(state);
        const firstGroupIndex = state.getFirstVisibleGroupIndex(state);
        const visibleGroups = state.getVisibleGroupsCount(firstGroupIndex, state);

        for (let i = 0; i < visibleGroups; i += 1) {
            const groupIndex = firstGroupIndex + i;

            dataSets.forEach((dataSet: BaseChartDataSet, dataSetIndex: number) => {
                const value = dataSet.data[groupIndex] ?? 0;
                if (!state.isVisibleValue(value)) {
                    return;
                }

                const category = dataSet.category ?? null;
                const categoryIndex = (category && stackedCategories.includes(category))
                    ? stackedCategories.indexOf(category)
                    : dataSetIndex;
                const groupName = dataSet.group ?? null;
                const columnIndex = (state.data.stacked)
                    ? stackedGroups.indexOf(groupName)
                    : categoryIndex;

                const itemCategory = (state.data.stacked)
                    ? (category ?? null)
                    : (categoryIndex ?? columnIndex ?? null);

                if (!categories.includes(itemCategory)) {
                    categories.push(itemCategory);
                }
            });
        }

        return categories;
    },

    getAllCategories: (state: BaseChartState): BaseChartDataCategory[] => {
        const categories: BaseChartDataCategory[] = [];

        state.dataSets.forEach((dataSet, index) => {
            let category = (state.data.stacked)
                ? (dataSet.category ?? null)
                : index;

            const categoryIndex = categories.length;
            if (category === null && !categories.includes(categoryIndex)) {
                category = categoryIndex;
            }

            if (!categories.includes(category)) {
                categories.push(category);
            }
        });

        return categories;
    },

    isVisibleValue: () => true,

    getVisibleItems: (state: BaseChartState) => {
        const firstItem = state.getFirstVisibleGroupIndex(state);
        const itemsOnWidth = state.getVisibleGroupsCount(firstItem, state);
        const lastItem = firstItem + itemsOnWidth - 1;

        return state.dataSeries.items.filter((item: BaseChartDataItemsGroup) => (
            (item?.length > 0)
            && (!!item[0] && item[0].groupIndex >= firstItem)
            && (!!item[0] && item[0].groupIndex <= lastItem)
        ));
    },

    findItemByEvent: (
        e: React.MouseEvent,
        state: BaseChartState,
        elem: Element,
    ) => findItemByEvent(e, state, elem),

    findItemByTarget: (
        target: BaseChartTarget,
        state: BaseChartState,
    ): BaseChartBaseItem | null => {
        if (!target) {
            return null;
        }

        const items = state.dataSeries.items ?? [];

        return items.flat().find((item) => isSameTarget(item, target)) ?? null;
    },

    /**
     * Calculate grid for specified set of values
     * @param {number[]} values
     */
    calculateGrid: (
        values: number[] | BaseChartDataSet[],
        state: BaseChartState,
    ): ChartGrid | null => {
        if (!state?.dataSets?.length) {
            return null;
        }

        const grid = new ChartGrid({
            scaleAroundAxis: state.scaleAroundAxis,
            height: state.chartHeight,
            margin: state.marginTop,
            minStep: state.minGridStep,
            maxStep: state.maxGridStep,
            valuesMargin: state.gridValuesMargin,
            stacked: state.data.stacked,
        });
        grid.calculate(values);

        return (grid.steps === 0) ? state.grid : grid;
    },

    // Components
    components: {
        Grid: BaseChartGrid,
        XAxisLabels: BaseChartXAxisLabels,
        YAxisLabels: BaseChartYAxisLabels,
        Legend: BaseChartLegend,
        ChartPopup: BaseChartPopup,
        ActiveGroup: BaseChartActiveGroup,
    },
};
