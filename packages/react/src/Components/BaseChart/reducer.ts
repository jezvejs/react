import { createSlice } from '../../utils/createSlice.ts';

import {
    isSameTarget,
    updateChartWidth,
    updateColumnWidth,
    getDataState,
} from './helpers.ts';
import {
    BaseChartDataCategory,
    BaseChartSetDataParam,
    BaseChartState,
    BaseChartTarget,
} from './types.ts';

/** Updates state of component based on layout changes(scroll or resize) */
const refreshView = (state: BaseChartState, layout: Partial<BaseChartState>) => {
    let newState = {
        ...state,
        ...layout,
    };

    newState = updateColumnWidth(newState);

    // Update width of x axis labels
    newState.lastHLabelOffset = (!newState.fitToWidth)
        ? Math.ceil(newState.lastHLabelOffset)
        : 0;

    if (!state.autoScale) {
        newState.grid = newState.calculateGrid(newState.data.values, newState);
    }

    return updateChartWidth({
        ...newState,
        animateNow: false,
    });
};

// Reducers
const slice = createSlice({
    update: (state: BaseChartState, stateUpdate: Partial<BaseChartState>) => ({
        ...state,
        ...stateUpdate,
    }),

    setScroll: (state: BaseChartState, scrollLeft: number) => (
        (state.scrollLeft === scrollLeft)
            ? state
            : { ...state, scrollLeft }
    ),

    setColumnWidth: (state: BaseChartState, value: number) => {
        const width = value;
        if (Number.isNaN(width) || width < 1 || state.columnWidth === width) {
            return state;
        }

        return updateChartWidth({
            ...state,
            columnWidth: Math.min(width, state.maxColumnWidth),
            lastHLabelOffset: 0,
        });
    },

    setGroupsGap: (state: BaseChartState, value: number) => {
        const groupsGap = value;
        if (Number.isNaN(groupsGap) || state.groupsGap === groupsGap) {
            return state;
        }

        return updateChartWidth({
            ...state,
            groupsGap,
            lastHLabelOffset: 0,
        });
    },

    setActiveCategory: (state: BaseChartState, activeCategory: BaseChartDataCategory) => (
        (state.activeCategory === activeCategory)
            ? state
            : { ...state, activeCategory }
    ),

    activateTarget: (state: BaseChartState, target: BaseChartTarget) => {
        if (
            !target?.item
            || isSameTarget(state.activeTarget, target)
        ) {
            return state;
        }

        return {
            ...state,
            activeTarget: { ...target },
        };
    },

    deactivateTarget: (state: BaseChartState) => (
        (state.activeTarget)
            ? { ...state, activeTarget: null }
            : state
    ),

    requestScroll: (state: BaseChartState) => (
        (!state.scrollRequested)
            ? { ...state, scrollRequested: true }
            : state
    ),

    finishScroll: (state: BaseChartState) => (
        (state.scrollRequested)
            ? { ...state, scrollRequested: false }
            : state
    ),

    scrollToRight: (state: BaseChartState) => {
        if (!state.scrollRequested) {
            return state;
        }

        const width = Math.max(state.chartWidth, state.scrollWidth);
        if (state.scrollLeft + state.scrollerWidth >= width) {
            return {
                ...state,
                scrollRequested: false,
            };
        }

        return {
            ...state,
            scrollLeft: width,
        };
    },

    ignoreTouch: (state: BaseChartState) => (
        (state.ignoreTouch)
            ? state
            : { ...state, ignoreTouch: true }
    ),

    itemClicked: (state: BaseChartState) => ({
        ...state,
        popupTarget: (
            (state.showPopupOnClick && !state.pinPopupOnClick)
                ? state.activeTarget
                : null
        ),
        pinnedTarget: (state.pinPopupOnClick) ? state.activeTarget : null,
    }),

    itemOver: (state: BaseChartState) => (
        (state.showPopupOnHover)
            ? { ...state, popupTarget: state.activeTarget }
            : state
    ),

    hidePopup: (state: BaseChartState) => (
        (state.popupTarget)
            ? { ...state, popupTarget: null }
            : state
    ),

    startAnimation: (state: BaseChartState) => (
        (!state.animateNow)
            ? { ...state, animateNow: true }
            : state
    ),

    animationDone: (state: BaseChartState) => (
        (state.animateNow)
            ? { ...state, animateNow: false }
            : state
    ),

    scroll: refreshView,

    resize: refreshView,

    setData: (state: BaseChartState, params: BaseChartSetDataParam) => {
        const { data, layout } = params;
        if (state.data === data) {
            return state;
        }

        let newState: BaseChartState = {
            ...getDataState(data, state),
            ...layout,
            activeTarget: null,
            popupTarget: null,
            pinnedTarget: null,
            activeCategory: null,
            animateNow: false,
        };

        newState = updateColumnWidth(newState);
        return updateChartWidth(newState);
    },

    scaleVisible: (state: BaseChartState, values: number[]) => (
        (state.autoScale && values?.length > 0)
            ? {
                ...state,
                grid: state.calculateGrid(values, state),
                animateNow: state.animate,
            }
            : state
    ),
});

export const { actions, reducer } = slice;
