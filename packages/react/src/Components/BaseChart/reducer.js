import { createSlice } from '../../utils/createSlice.js';

import {
    isSameTarget,
    updateChartWidth,
    updateColumnWidth,
    getDataState,
} from './helpers.js';

/** Updates state of component based on layout changes(scroll or resize) */
const refreshView = (state, layout) => {
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
    update: (state, stateUpdate) => ({ ...state, ...stateUpdate }),

    setScroll: (state, scrollLeft) => (
        (state.scrollLeft === scrollLeft)
            ? state
            : { ...state, scrollLeft }
    ),

    setColumnWidth: (state, value) => {
        const width = parseFloat(value, 10);
        if (Number.isNaN(width) || width < 1 || state.columnWidth === width) {
            return state;
        }

        return updateChartWidth({
            ...state,
            columnWidth: Math.min(width, state.maxColumnWidth),
            lastHLabelOffset: 0,
        });
    },

    setGroupsGap: (state, value) => {
        const groupsGap = parseFloat(value, 10);
        if (Number.isNaN(groupsGap) || state.groupsGap === groupsGap) {
            return state;
        }

        return updateChartWidth({
            ...state,
            groupsGap,
            lastHLabelOffset: 0,
        });
    },

    setActiveCategory: (state, activeCategory) => (
        (state.activeCategory === activeCategory)
            ? state
            : { ...state, activeCategory }
    ),

    activateTarget: (state, target) => {
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

    deactivateTarget: (state) => (
        (state.activeTarget)
            ? { ...state, activeTarget: null }
            : state
    ),

    requestScroll: (state) => (
        (!state.scrollRequested)
            ? { ...state, scrollRequested: true }
            : state
    ),

    finishScroll: (state) => (
        (state.scrollRequested)
            ? { ...state, scrollRequested: false }
            : state
    ),

    scrollToRight: (state) => {
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

    ignoreTouch: (state) => (
        (state.ignoreTouch)
            ? state
            : { ...state, ignoreTouch: true }
    ),

    itemClicked: (state) => ({
        ...state,
        popupTarget: (
            (state.showPopupOnClick && !state.pinPopupOnClick)
                ? state.activeTarget
                : null
        ),
        pinnedTarget: (state.pinPopupOnClick) ? state.activeTarget : null,
    }),

    itemOver: (state) => (
        (state.showPopupOnHover)
            ? { ...state, popupTarget: state.activeTarget }
            : state
    ),

    hidePopup: (state) => (
        (state.popupTarget)
            ? { ...state, popupTarget: null }
            : state
    ),

    startAnimation: (state) => (
        (!state.animateNow)
            ? { ...state, animateNow: true }
            : state
    ),

    animationDone: (state) => (
        (state.animateNow)
            ? { ...state, animateNow: false }
            : state
    ),

    scroll: refreshView,

    resize: refreshView,

    setData: (state, { data, layout }) => {
        if (state.data === data) {
            return state;
        }

        let newState = {
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

    scaleVisible: (state, values) => (
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
