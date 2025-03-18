import { isFunction, isObject } from '@jezvejs/types';
import { minmax } from '../../utils/common.ts';
import {
    BaseChartBaseItem,
    BaseChartDataCategory,
    BaseChartDataGroup,
    BaseChartDataItemsGroup,
    BaseChartDataProp,
    BaseChartDataSerie,
    BaseChartDataSet,
    BaseChartItemSearchResult,
    BaseChartProps,
    BaseChartState,
    BaseChartTarget,
} from './types.ts';

const SVG_VALUE_PRECISION = 3;

/**
 * Returns true if objects target to the same data items
 *
 * @param {BaseChartBaseItem | BaseChartTarget} a
 * @param {BaseChartBaseItem | BaseChartTarget} b
 * @returns {boolean}
 */
export const isSameTarget = (
    a: BaseChartBaseItem | BaseChartTarget | null,
    b: BaseChartBaseItem | BaseChartTarget | null,
): boolean => (
    (a === b) || (
        !!a
        && !!b
        && a.groupIndex === b.groupIndex
        && a.categoryIndex === b.categoryIndex
        && a.columnIndex === b.columnIndex
    )
);

/** Returns array of data sets */
export const getDataValues = (data: BaseChartDataProp): BaseChartDataSet[] => {
    if (Array.isArray(data)) {
        const dataSet: BaseChartDataSet = {
            data,
        };
        return [dataSet];
    }

    const values = data?.values ?? [];
    if (values.length === 0) {
        return [];
    }

    const [firstItem] = values;
    if (!isObject(firstItem)) {
        const dataSet: BaseChartDataSet = {
            data: values as number[],
        };
        return [dataSet];
    }

    return values as BaseChartDataSet[];
};

/** Returns array of series data */
export const getDataSeries = (data: BaseChartDataProp): BaseChartDataSerie[] => {
    if (Array.isArray(data) || data === null) {
        return [];
    }

    return data.series ?? [];
};

/** Returns true if chart data is stacked */
export const isStackedData = (data: BaseChartDataProp): boolean => (
    !Array.isArray(data)
    && data !== null
    && ('stacked' in data)
    && !!data.stacked
);

/** Returns array of data sets */
export const getDataSets = (state: BaseChartState): BaseChartDataSet[] => (
    getDataValues(state.data)
);

/** Returns longest data set */
export const getLongestDataSet = (state: BaseChartState): number[] => {
    const resIndex = state.dataSets.reduce((res, item, index) => (
        (state.dataSets[res].data.length < item.data.length) ? index : res
    ), 0);

    return state.dataSets[resIndex]?.data ?? [];
};

/** Returns true if current chart data is stacked */
export const isStacked = (state: BaseChartState): boolean => (
    isStackedData(state.data)
);

/** Returns array of groups for stacked chart data */
export const getStackedGroups = (state: BaseChartState): BaseChartDataGroup[] => {
    if (!isStacked(state)) {
        return [];
    }

    return state.dataSets.reduce((res: BaseChartDataGroup[], item: BaseChartDataSet) => {
        const group = item.group ?? null;
        return res.includes(group) ? res : [...res, group];
    }, []);
};

/** Returns categories for stacked chart data */
export const getStackedCategories = (state: BaseChartState): BaseChartDataCategory[] => {
    if (!isStacked(state)) {
        return [];
    }

    return state.dataSets.reduce((res: BaseChartDataCategory[], item: BaseChartDataSet) => {
        let category = item.category ?? null;
        if (res.includes(category)) {
            return res;
        }

        const categoryIndex = res.length;
        if (category === null && !res.includes(categoryIndex)) {
            category = categoryIndex;
        }

        return [...res, category];
    }, []);
};

/** Returns index of first visible item for specified state */
export const getFirstVisibleGroupIndex = (state: BaseChartState): number => {
    const groupWidth = state.getGroupOuterWidth(state);
    const offs = state.visibilityOffset ?? 0;

    const left = state.scrollLeft - offs;
    const firstItem = Math.floor(left / groupWidth);
    return Math.max(0, firstItem);
};

/** Returns count of visible items from specified index */
export const getVisibleGroupsCount = (firstItemIndex: number, state: BaseChartState): number => {
    const groupWidth = state.getGroupOuterWidth(state);
    const longestSet = getLongestDataSet(state);
    const offs = state.visibilityOffset ?? 0;
    const first = Math.max(0, firstItemIndex);

    const width = state.containerWidth + 2 * offs;
    const itemsOnWidth = Math.round(width / groupWidth);
    return Math.min(longestSet.length - first, itemsOnWidth);
};

/** Returns group index for specified position on x-axis */
export const getGroupIndexByX = (x: number, state: BaseChartState): number => {
    const groupOuterWidth = state.getGroupOuterWidth(state);
    return Math.floor(x / groupOuterWidth);
};

/** Returns series value for specified items group */
export const getSeriesByIndex = (
    index: number,
    state: BaseChartState,
): BaseChartDataSerie | null => {
    if (index === -1 || !('series' in state.data)) {
        return null;
    }

    const { series } = state.data;
    const ind = minmax(0, series.length - 1, index);
    return series[ind];
};

/** Return array of values */
export const mapValues = (
    items: BaseChartBaseItem[] | BaseChartDataItemsGroup[],
): number[] | null => {
    if (!items || !Array.isArray(items)) {
        return null;
    }

    return items.flat().map((item: BaseChartBaseItem | null) => (
        (item)
            ? (item.value + item.valueOffset)
            : 0
    ));
};

/**
 * Returns specified value rounded to default precision for SVG
 *
 * @param {number} value
 * @param {boolean} asPixels
 * @returns {string}
 */
export const formatCoord = (value: number, asPixels: boolean = false) => {
    const fmt = parseFloat(value.toFixed(SVG_VALUE_PRECISION)).toString();
    return (asPixels) ? `${fmt}px` : fmt;
};

/** Updates width of chart component */
export const updateChartWidth = (state: BaseChartState): BaseChartState => {
    const groupsWidth = (isFunction(state.getGroupOuterWidth))
        ? state.groupsCount * state.getGroupOuterWidth(state)
        : 0;
    const contentWidth = Math.max(groupsWidth, state.lastHLabelOffset);

    return {
        ...state,
        chartContentWidth: contentWidth,
        chartWidth: Math.max(state.scrollerWidth, contentWidth),
    };
};

/** Calculate width and margin of bar for fitToWidth option */
export const updateColumnWidth = (state: BaseChartState): BaseChartState => {
    if (!state.fitToWidth) {
        return state;
    }

    const groupOuterWidth = (state.groupsCount > 0)
        ? state.scrollerWidth / state.groupsCount
        : 0;
    const groupsGap = groupOuterWidth / 5;
    const groupWidth = groupOuterWidth - groupsGap;
    const columnWidth = (state.columnsInGroup > 0)
        ? Math.min(state.maxColumnWidth, groupWidth / state.columnsInGroup)
        : 0;

    return {
        ...state,
        columnWidth,
        groupsGap,
    };
};

/** Returns random identifier */
export const generateId = () => (
    Math.round(Date.now() * Math.random() * 100000).toString(30)
);

/** Calculates new state for specified chart data */
export const getDataState = (data: BaseChartDataProp, state: BaseChartState): BaseChartState => {
    const newState: BaseChartState = {
        ...state,
        data: {
            values: getDataValues(data),
            series: getDataSeries(data),
            stacked: isStackedData(data),
        },
        lastHLabelOffset: 0,
    };
    const { values } = newState.data;

    newState.dataSets = state.getDataSets(newState);
    newState.groupsCount = state.getGroupsCount(newState);
    newState.columnsInGroup = state.getColumnsInGroupCount(newState);
    newState.grid = state.calculateGrid(values, newState);

    return newState;
};

/** Returns initial state object for specified props */
export const getInitialState = (
    props: Partial<BaseChartProps>,
    defaultProps: BaseChartProps,
): BaseChartState => {
    const state = {
        ...(defaultProps ?? {}),
        scrollLeft: 0,
        scrollerWidth: 0,
        containerWidth: 0,
        containerHeight: 0,
        chartWidth: 0,
        chartHeight: 0,
        scrollWidth: 0,
        chartContentWidth: 0,
        lastHLabelOffset: 0,
        scrollRequested: false,
        ...props,
        data: {
            values: [],
            series: [],
            stacked: false,
        },
        dataSets: [],
        dataSeries: {
            firstGroupIndex: -1,
            lastGroupIndex: -1,
            visibleGroups: -1,
            items: [],
        },
        grid: null,
        groupsCount: 0,
        columnsInGroup: 0,
        currentTarget: null,
        activeTarget: null,
        activeCategory: null,
        hLabelsHeight: 25,
        contentOffset: null,
        ignoreTouch: false,
        animateNow: false,
        showPopup: false,
        popupTarget: null,
        pinnedTarget: null,
        xAxisLabels: {
            firstGroupIndex: -1,
            lastGroupIndex: -1,
            visibleGroups: null,
            items: [],
        },
        components: {
            ...defaultProps.components,
            ...(props?.components ?? {}),
        },
    };

    const { height, marginTop } = state;
    state.chartHeight = (height ?? 0) - (marginTop ?? 0);

    return getDataState(props.data ?? [], state as BaseChartState);
};

export const isHorizontalScaleNeeded = (
    state: BaseChartState,
    prevState?: BaseChartState,
): boolean => (
    state.columnWidth !== prevState?.columnWidth
    || state.groupsGap !== prevState?.groupsGap
    || state.fitToWidth !== prevState?.fitToWidth
    || state.alignColumns !== prevState?.alignColumns
);

export const isVerticalScaleNeeded = (
    state: BaseChartState,
    prevState?: BaseChartState,
): boolean => (
    !!state.autoScale
    && state.data === prevState?.data
    && state.grid !== prevState?.grid
);

/** Find item by event object */
export function findItemByEvent<ITEM extends BaseChartBaseItem = BaseChartBaseItem>(
    e: React.MouseEvent,
    state: BaseChartState,
    elem: Node,
): BaseChartItemSearchResult<ITEM> {
    if (
        !state?.contentOffset
        || !elem?.contains(e?.target as Node)
    ) {
        return { item: null, index: -1 };
    }

    const { contentOffset, dataSeries } = state;
    const items = dataSeries.items as BaseChartDataItemsGroup<ITEM>[];

    const firstGroupIndex = state.getFirstVisibleGroupIndex(state);

    const x = e.clientX - contentOffset.left + state.scrollLeft;
    const index = state.getGroupIndexByX(x, state);
    const relIndex = index - firstGroupIndex;
    if (relIndex < 0 || relIndex >= items.length) {
        return { x, item: null, index: -1 };
    }

    const item = items[relIndex];
    return {
        x,
        item,
        index,
        series: state.getSeriesByIndex(index, state),
    };
}
