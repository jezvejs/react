import {
    ComponentType,
    CSSProperties,
    ForwardRefExoticComponent,
    ReactNode,
} from 'react';
import { ChartGrid } from '../ChartGrid/ChartGrid.ts';
import { StoreProviderContext } from '../../utils/Store/StoreProvider.tsx';

export type BaseChartDataSerie = string | number;
export type BaseChartDataCategory = string | number | null;
export type BaseChartDataGroup = string | null;

export interface BaseChartDataSet {
    data: Array<number>,
    group?: BaseChartDataGroup,
    category?: BaseChartDataCategory,
}

/**
 *  values: [1, 2, 3, 4, ...]
 *  OR
 *  values: [
 *      {
 *          data: [1, 2, 3, 4, ...]
 *          group: 'group_name_1',
 *          category: 'category_1'
 *      },
 *      {
 *          data: [100, 200, 300, 400, ...]
 *          group: 'group_name_1',
 *          category: 'category_2'
 *      },
 *  ]
 */
export interface BaseChartData {
    values: Array<number> | Array<BaseChartDataSet>,
    series: BaseChartDataSerie[],
    stacked?: boolean,
}

export type BaseChartDataProp = BaseChartData | number[] | null;

/** Base data item type */
export interface BaseChartBaseItem {
    value: number,
    valueOffset: number,
    groupIndex: number,
    category: BaseChartDataCategory,
    categoryIndex: number,
    columnIndex: number,
    active: boolean,
}

/** Target item */
export interface BaseChartTarget extends BaseChartBaseItem {
    item: BaseChartBaseItem | null,
}

/** Group of data items */
export type BaseChartDataItemsGroup = (BaseChartBaseItem | null)[];

/** 'XAxisLabels' component types */
export type BaseChartXAxisLabelsPosition = 'bottom' | 'top' | 'none';
export type BaseChartXAxisLabelsRenderer = (value: number | string) => string;

/** 'YAxisLabels' component types */
export type BaseChartYAxisLabelsPosition = 'left' | 'right' | 'none';
export type BaseChartYAxisLabelsRenderer = (value: number | string) => string;

export type BaseChartHorizontalAlign = 'left' | 'right' | 'center';

export type JSXComponent = (props: BaseChartState) => React.JSX.Element | null;

/** BaseChart child components */
export interface BaseChartComponents {
    ActiveGroup?: ComponentType | JSXComponent | ForwardRefExoticComponent<BaseChartState> | null,
    ChartPopup?: ComponentType | JSXComponent | ForwardRefExoticComponent<BaseChartState> | null,
    DataItem?: unknown; // ComponentType | JSXComponent | null,
    DataSeries?: unknown; // ComponentType<BaseChartState> | null,
    Grid?: ComponentType | JSXComponent | null,
    Legend?: ComponentType | JSXComponent | ForwardRefExoticComponent<BaseChartState> | null,
    XAxisLabels?: ComponentType | JSXComponent | ForwardRefExoticComponent<BaseChartState> | null,
    YAxisLabels?: ComponentType | JSXComponent | ForwardRefExoticComponent<BaseChartState> | null,
}

/**
 * BaseChart component props
 */
export interface BaseChartProps {
    id: string,
    className: string,

    // Layout
    height: number,
    columnWidth: number,
    maxColumnWidth: number,
    groupsGap: number,
    marginTop: number,
    alignColumns: BaseChartHorizontalAlign,
    visibilityOffset: number,
    scaleAroundAxis: boolean,
    gridValuesMargin: number,
    minGridStep: number,
    maxGridStep: number,

    // Grid
    xAxisGrid: boolean,
    yAxisGrid: boolean,

    // Render properties
    fitToWidth: boolean,
    allowLastXAxisLabelOverflow: boolean,

    // Auto scale
    autoScale: boolean,
    autoScaleTimeout: number | false,

    // Scroller
    scrollToEnd: boolean,
    beforeScroller?: ReactNode,
    afterScroller?: ReactNode,

    // Animate chart options
    animate: boolean,
    animationEndTimeout: number,

    resizeTimeout: number,
    activateOnClick: boolean,
    activateOnHover: boolean,

    // Labels
    xAxis: BaseChartXAxisLabelsPosition,
    yAxis: BaseChartYAxisLabelsPosition,
    yAxisLabelsAlign: BaseChartHorizontalAlign,
    renderXAxisLabel: BaseChartXAxisLabelsRenderer | null,
    renderYAxisLabel: BaseChartYAxisLabelsRenderer | null,

    // Legend
    showLegend: boolean,
    renderLegend: (() => ReactNode) | null,
    onlyVisibleCategoriesLegend: boolean,

    // Active group
    showActiveGroup: boolean,

    // Popup
    showPopupOnClick: boolean,
    pinPopupOnClick: boolean,
    showPopupOnHover: boolean,
    animatePopup: boolean,
    renderPopup: ((target: BaseChartTarget, state: BaseChartState) => ReactNode) | null,
    popupPosition: 'right',

    // Callbacks
    onStoreReady?: (store: StoreProviderContext) => void,
    onItemClick: ((options: { e: React.MouseEvent; }) => void) | null,
    onItemOver: ((options: { e: React.MouseEvent; }) => void) | null,
    onItemOut: ((options: { e: React.MouseEvent; }) => void) | null,
    onResize: ((lastHLabelOffset?: number) => void) | null,
    onScroll: (() => void) | null,
    scrollDone: (() => void) | null,

    data: BaseChartDataProp,
    reducers: ((state: BaseChartState, action: object) => BaseChartState) | null,

    getGroupOuterWidth: (state: BaseChartState) => number,

    getCategoriesCount: (state: BaseChartState) => number,
    getColumnsInGroupCount: (state: BaseChartState) => number,
    getGroupsCount: (state: BaseChartState) => number,
    getDataSets: (state: BaseChartState) => BaseChartDataSet[],
    getLongestDataSet: (state: BaseChartState) => number[],

    // Stacked data
    getStackedGroups: (state: BaseChartState) => BaseChartDataGroup[],
    getStackedCategories: (state: BaseChartState) => BaseChartDataCategory[],

    // Visibility
    getFirstVisibleGroupIndex: (state: BaseChartState) => number,
    getVisibleGroupsCount: (firstItemIndex: number, state: BaseChartState) => number,
    getSeriesByIndex: (index: number, state: BaseChartState) => BaseChartDataSerie | null,
    getGroupIndexByX: (x: number, state: BaseChartState) => number,

    isVisibleValue: (value: number) => boolean,

    // Scale
    isHorizontalScaleNeeded: (state: BaseChartState, prevState?: BaseChartState) => boolean,
    isVerticalScaleNeeded: (state: BaseChartState, prevState?: BaseChartState) => boolean,

    getVisibleCategories: (state: BaseChartState) => BaseChartDataCategory[],
    getAllCategories: (state: BaseChartState) => BaseChartDataCategory[],
    getVisibleItems: (state: BaseChartState) => BaseChartBaseItem[] | BaseChartDataItemsGroup[],

    findItemByEvent: (
        e: React.MouseEvent,
        state: BaseChartState,
        elem: Element,
    ) => BaseChartItemSearchResult | null,

    findItemByTarget: (target: BaseChartTarget, state: BaseChartState) => BaseChartBaseItem | null,

    calculateGrid: (
        values: number[] | BaseChartDataSet[],
        state: BaseChartState,
    ) => ChartGrid | null,

    components: BaseChartComponents,
}

export interface BaseChartVisibleItems {
    firstGroupIndex: number,
    lastGroupIndex: number,
    visibleGroups: number,
    items: BaseChartDataItemsGroup[],
}

export interface BaseChartItemSearchResult {
    item: object | null,
    index: number,
    x?: number,
    series?: BaseChartDataSerie | null,
}

export interface BaseChartXAxisLabelProps {
    id: string,
    value: string,
    className: string,
    style: CSSProperties,
    'data-id': string,
    hidden: boolean,
}

/**
 * State of BaseChart component
 */
export interface BaseChartState extends BaseChartProps {
    // Current dimensions of layout
    scrollLeft: number,
    scrollerWidth: number,
    containerWidth: number,
    containerHeight: number,
    chartWidth: number,
    chartHeight: number,
    scrollWidth: number,
    chartContentWidth: number,
    lastHLabelOffset: number,
    hLabelsHeight: number,
    scrollRequested: boolean,

    data: BaseChartData,
    dataSets: BaseChartDataSet[],
    dataSeries: BaseChartVisibleItems,
    grid: ChartGrid | null,

    groupsCount: number,
    columnsInGroup: number,

    currentTarget: BaseChartTarget | null,
    activeTarget: BaseChartTarget | null,
    activeCategory: BaseChartDataCategory,
    contentOffset: { left: number, top: number; } | null,
    ignoreTouch: boolean,
    animateNow: boolean,

    xAxisLabels: {
        firstGroupIndex: number,
        lastGroupIndex: number,
        visibleGroups: BaseChartDataGroup,
        items: BaseChartXAxisLabelProps[],
    },

    showPopup: boolean,
    popupTarget: BaseChartTarget | null,
    pinnedTarget: BaseChartTarget | null,
}
