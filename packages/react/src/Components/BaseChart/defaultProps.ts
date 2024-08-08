import { ComponentType, ReactNode } from 'react';
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

export interface BaseChartData {
    values: any[],
    series: any[],
    stacked: boolean,
};

export interface BaseChartProps {
    // Layout
    height?: number,
    columnWidth?: number,
    maxColumnWidth?: number,
    groupsGap?: number,
    marginTop?: number,
    alignColumns?: 'left' | 'right' | 'center',
    visibilityOffset?: number,
    scaleAroundAxis?: boolean,
    gridValuesMargin?: number,
    minGridStep?: number,
    maxGridStep?: number,
    xAxisGrid?: boolean,
    // Render properties
    fitToWidth?: boolean,
    allowLastXAxisLabelOverflow?: boolean,
    scrollToEnd?: boolean,
    autoScale?: boolean,
    animate?: boolean,
    animationEndTimeout?: number,
    autoScaleTimeout?: number,
    resizeTimeout?: number,
    activateOnClick?: boolean,
    activateOnHover?: boolean,
    xAxis?: 'bottom' | 'top' | 'none',
    yAxis?: 'right' | 'left' | 'none',
    yAxisLabelsAlign?: 'left' | 'right' | 'center',
    renderXAxisLabel?: (() => ReactNode) | null,
    renderYAxisLabel?: (() => ReactNode) | null,
    showLegend?: boolean,
    renderLegend?: (() => ReactNode) | null,
    onlyVisibleCategoriesLegend?: boolean,
    // Active group
    showActiveGroup?: boolean,
    // Popup
    showPopupOnClick?: boolean,
    pinPopupOnClick?: boolean,
    showPopupOnHover?: boolean,
    animatePopup?: boolean,
    renderPopup?: (() => ReactNode) | null,
    popupPosition?: 'right',
    // Callbacks
    onScroll?: ((e: Event) => void) | null,
    onResize?: ((e: Event) => void) | null,
    onItemClick?: ((e: Event) => void) | null,
    onItemOver?: ((e: Event) => void) | null,
    onItemOut?: ((e: Event) => void) | null,
    scrollDone?: (() => void) | null,
    data?: BaseChartData | any[] | null,
    reducers?: ((state: object, action: object) => object) | null,

    getGroupOuterWidth: (state: object) => number,

    getCategoriesCount: (state: object) => number,
    getColumnsInGroupCount: () => number,
    getGroupsCount: (state: object) => number,
    getDataSets: (state: object) => any[],
    getLongestDataSet: (state: object) => any[],

    getStackedGroups: (state: object) => any[],
    getStackedCategories: (state: object) => any[],
    getFirstVisibleGroupIndex: (state: object) => number,
    getVisibleGroupsCount: (firstItemIndex: number, state: object) => number,
    getSeriesByIndex: (index: number, state: object) => any[],
    getGroupIndexByX: (x: number, state: object) => any[],
    isHorizontalScaleNeeded: (state: object, prevState: object) => number,
    isVerticalScaleNeeded: (state: object, prevState: object) => number,
    getVisibleCategories: (state: object) => any[],
    getAllCategories: (state: object) => any[],
    getVisibleItems: (state: object) => any[],

    findItemByEvent: (...args: any[]) => object | null,
    findItemByTarget: (target: object, state: object) => object | null,
    calculateGrid: (values: object, state: object) => object | null,

    components?: {
        Grid?: ComponentType | null,
        DataSeries?: ComponentType | null,
        XAxisLabels?: ComponentType | null,
        YAxisLabels?: ComponentType | null,
        Legend?: ComponentType | null,
        ChartPopup?: ComponentType | null,
        ActiveGroup?: ComponentType | null,
    },
};

/** Default properties */
export const defaultProps: BaseChartProps = {
    // Layout
    height: 300,
    columnWidth: 38,
    maxColumnWidth: 38,
    groupsGap: 10,
    marginTop: 10,
    alignColumns: 'left', // available values: 'left', 'right' and 'center'
    // Grid behavior
    visibilityOffset: 100,
    scaleAroundAxis: true,
    gridValuesMargin: 0.1,
    minGridStep: 30,
    maxGridStep: 60,
    xAxisGrid: false,
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
    getGroupOuterWidth: (state) => (
        state.columnWidth + state.groupsGap
    ),

    /** Returns count of data categories */
    getCategoriesCount: (state) => state.dataSets.length,

    /** Returns current count of columns in group */
    getColumnsInGroupCount: () => 1,

    /** Returns count of data columns */
    getGroupsCount: (state) => {
        const valuesLength = state?.dataSets?.map((item) => item.data.length) ?? [];
        return Math.max(0, ...valuesLength);
    },

    /** Returns array of data sets */
    getDataSets: (state) => getDataSets(state),

    /** Returns longest data set */
    getLongestDataSet: (state) => getLongestDataSet(state),

    getStackedGroups: (state) => getStackedGroups(state),

    getStackedCategories: (state) => getStackedCategories(state),

    /** Returns index of first visible item */
    getFirstVisibleGroupIndex: (state) => getFirstVisibleGroupIndex(state),

    /** Returns count of visible items from specified index */
    getVisibleGroupsCount: (firstItemIndex, state) => (
        getVisibleGroupsCount(firstItemIndex, state)
    ),

    /** Returns series value for specified items group */
    getSeriesByIndex: (index, state) => getSeriesByIndex(index, state),

    /** Returns group index for specified position on x-axis */
    getGroupIndexByX: (x, state) => getGroupIndexByX(x, state),

    isHorizontalScaleNeeded: (state, prevState = {}) => isHorizontalScaleNeeded(state, prevState),

    isVerticalScaleNeeded: (state, prevState = {}) => isVerticalScaleNeeded(state, prevState),

    getVisibleCategories(state) {
        const { dataSets } = state;
        if (dataSets.length === 0) {
            return [];
        }

        const categories = [];
        const stackedGroups = state.getStackedGroups(state);
        const stackedCategories = state.getStackedCategories(state);
        const firstGroupIndex = state.getFirstVisibleGroupIndex(state);
        const visibleGroups = state.getVisibleGroupsCount(firstGroupIndex, state);

        for (let i = 0; i < visibleGroups; i += 1) {
            const groupIndex = firstGroupIndex + i;

            dataSets.forEach((dataSet, dataSetIndex) => {
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

    getAllCategories: (state) => {
        const categories = [];

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

    getVisibleItems: (state) => {
        const firstItem = state.getFirstVisibleGroupIndex(state);
        const itemsOnWidth = state.getVisibleGroupsCount(firstItem, state);
        const lastItem = firstItem + itemsOnWidth - 1;

        return state.dataSeries.items.filter((item) => (
            item?.length > 0
            && item[0].groupIndex >= firstItem
            && item[0].groupIndex <= lastItem
        ));
    },

    findItemByEvent: (...args) => findItemByEvent(...args),

    findItemByTarget: (target, state) => {
        if (!target) {
            return null;
        }

        const items = state.dataSeries.items ?? [];

        return items.flat().find((item) => isSameTarget(item, target));
    },

    /**
     * Calculate grid for specified set of values
     * @param {number[]} values
     */
    calculateGrid: (values, state) => {
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
        DataSeries: null,
        XAxisLabels: BaseChartXAxisLabels,
        YAxisLabels: BaseChartYAxisLabels,
        Legend: BaseChartLegend,
        ChartPopup: BaseChartPopup,
        ActiveGroup: BaseChartActiveGroup,
    },
};
