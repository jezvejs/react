import { isFunction } from '@jezvejs/types';
import { getOffset } from '@jezvejs/dom';
import {
    forwardRef,
    useRef,
    useImperativeHandle,
    useEffect,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { debounce } from '../../utils/common.js';
import { useStore } from '../../utils/Store/StoreProvider.jsx';

import { actions } from './reducer.js';
import { getComponent, mapValues } from './helpers.js';
import { BaseChartPopupContainer } from './BaseChartPopupContainer.jsx';
import { usePopupPosition } from '../../hooks/usePopupPosition/usePopupPosition.js';

/**
 * BaseChartContainer component
 */
// eslint-disable-next-line react/display-name
export const BaseChartContainer = forwardRef((props, ref) => {
    const store = useStore();
    const {
        getState,
        setState,
        dispatch,
    } = store;

    useEffect(() => {
        props?.onStoreReady?.(store);
    }, [store]);

    const innerRef = useRef(null);
    useImperativeHandle(ref, () => innerRef.current);

    const scrollerRef = useRef(null);
    const chartContentRef = useRef(null);
    const xAxisLabelsRef = useRef(null);
    const popupRef = useRef(null);
    const pinnedPopupRef = useRef(null);

    const scaleFunc = useRef(null);
    const cancelScaleFunc = useRef(null);
    const scrollFunc = useRef(null);
    const cancelScrollFunc = useRef(null);

    const animationFrameRef = useRef(null);
    const removeTransitionHandlerRef = useRef(null);

    /** Returns object with main dimensions of component */
    const measureLayout = () => {
        if (!scrollerRef.current || !innerRef.current) {
            return {};
        }

        const { clientHeight, scrollWidth, scrollLeft } = scrollerRef.current;

        const res = {
            contentOffset: getOffset(scrollerRef.current),
            scrollerWidth: scrollerRef.current?.offsetWidth,
            scrollLeft,
            scrollWidth,
            containerWidth: innerRef.current?.offsetWidth,
            containerHeight: innerRef.current?.offsetHeight,
        };

        // Auto height
        if (!props.height) {
            res.xAxisLabelsHeight = xAxisLabelsRef.current?.offsetHeight ?? 0;
            res.height = clientHeight - res.xAxisLabelsHeight;
            res.chartHeight = res.height - props.marginTop;
        }

        return res;
    };

    const hidePopup = () => {
        dispatch(actions.hidePopup());
    };

    /** Activates specified target */
    const activateTarget = (target) => {
        dispatch(actions.activateTarget(target));
    };

    /** Deactivates specified target */
    const deactivateTarget = () => {
        dispatch(actions.deactivateTarget());
    };

    const scrollToRight = () => {
        dispatch(actions.scrollToRight());

        props.scrollDone?.();
    };

    /** Scale visible items of chart */
    const scaleVisible = () => {
        const state = getState();
        if (!state?.autoScale) {
            return;
        }

        dispatch(actions.startAnimation());

        requestAnimationFrame(() => {
            const vItems = state.getVisibleItems(getState());
            const values = mapValues(vItems);

            dispatch(actions.scaleVisible(values));
        });
    };

    const handleTransitionEnd = () => {
        removeTransitionHandlerRef.current = null;

        dispatch(actions.animationDone());
    };

    /**
     * 'scroll' event handler
     */
    const onScroll = () => {
        const state = getState();
        if (state.scrollRequested) {
            dispatch(actions.finishScroll());
        }

        dispatch(actions.scroll(measureLayout()));

        if (scaleFunc.current) {
            scaleFunc.current();
        }

        if (scrollFunc.current) {
            scrollFunc.current();
        }

        if (state.showPopupOnClick || state.showPopupOnHover) {
            hidePopup();
        }

        props.onScroll?.();
    };

    /**
     * 'click' event handler
     * @param {MouseEvent} e
     */
    const onClick = (e) => {
        const state = getState();

        const target = state.findItemByEvent(e, getState(), innerRef.current);
        if (!target.item) {
            deactivateTarget();
            return;
        }

        if (state.activateOnClick || state.showPopupOnClick) {
            activateTarget(target);
        }

        dispatch(actions.itemClicked());

        props.onItemClick?.({ ...target, event: e });
    };

    /**
     * 'touchstart' event handler
     * @param {TouchEvent} e
     */
    const onTouchStart = (e) => {
        if (e.touches) {
            dispatch(actions.ignoreTouch());
        }
    };

    /**
     * 'mousemove' event handler
     * @param {MouseEvent} e
     */
    const onMouseMove = (e) => {
        const state = getState();
        if (state.ignoreTouch) {
            return;
        }

        const target = state.findItemByEvent(e, getState(), innerRef.current);
        if (state.currentTarget?.item === target?.item) {
            return;
        }

        if (state.currentTarget?.item) {
            props.onItemOut?.({ ...state.currentTarget, event: e });
        }

        setState((prev) => ({
            ...prev,
            currentTarget: target,
        }));

        if (!innerRef.current.contains(e.target)) {
            if (state.activateOnHover) {
                deactivateTarget();
            }
            return;
        }

        if (state.activateOnHover) {
            activateTarget(target);
        }

        dispatch(actions.itemOver());

        props.onItemOver?.({ ...target, event: e });
    };

    /**
     * 'mouseleave' event handler
     * @param {MouseEvent} e
     */
    const onMouseLeave = (e) => {
        const state = getState();

        if (
            e.relatedTarget
            && (
                popupRef.current?.contains(e.relatedTarget)
                || pinnedPopupRef.current?.contains(e.relatedTarget)
            )
        ) {
            return;
        }

        if (state.activateOnHover) {
            deactivateTarget();
        }

        if (state.currentTarget?.item) {
            props.onItemOut?.({ ...state.currentTarget, event: e });
        }

        setState((prev) => ({
            ...prev,
            currentTarget: null,
        }));
    };

    /** Chart scroller resize observer handler */
    const onResize = (lastHLabelOffset = 0) => {
        dispatch(actions.resize({
            ...measureLayout(),
            lastHLabelOffset,
        }));

        if (scaleFunc.current) {
            scaleFunc.current();
        }

        if (scrollFunc.current) {
            scrollFunc.current();
        }
    };

    // Process chart data on update
    useEffect(() => {
        dispatch(actions.setData({ data: props.data, layout: measureLayout() }));
        dispatch(actions.requestScroll());
    }, [props.data]);

    // Process chart data on update
    useEffect(() => {
        dispatch(actions.setColumnWidth(props.columnWidth));
    }, [props.columnWidth]);

    useEffect(() => {
        dispatch(actions.setGroupsGap(props.groupsGap));
    }, [props.groupsGap]);

    useEffect(() => {
        const { alignColumns } = props;
        dispatch(actions.update({
            alignColumns,
        }));
    }, [props.alignColumns]);

    // Chart axes
    useEffect(() => {
        const {
            xAxis,
            yAxis,
            yAxisLabelsAlign,
        } = props;

        dispatch(actions.update({
            xAxis,
            yAxis,
            yAxisLabelsAlign,
        }));
    }, [props.xAxis, props.yAxis, props.yAxisLabelsAlign]);

    // Resize observer
    useEffect(() => {
        const state = getState();
        const handler = debounce(() => onResize(), state.resizeTimeout);
        const observer = new ResizeObserver(handler);
        observer.observe(scrollerRef.current);

        return () => {
            observer.disconnect();
        };
    }, [scrollerRef.current]);

    // Auto scale
    useEffect(() => {
        if (!props.autoScale) {
            scaleFunc.current = null;
            return;
        }

        if (props.autoScaleTimeout === false) {
            scaleFunc.current = () => scaleVisible();
        } else {
            const scaleHandler = debounce(
                () => scaleVisible(),
                props.autoScaleTimeout,
                { cancellable: true },
            );

            scaleFunc.current = scaleHandler.run;
            cancelScaleFunc.current = scaleHandler.cancel;
        }

        if (props.scrollToEnd) {
            const scrollHandler = debounce(
                () => scrollToRight(),
                100,
                { cancellable: true },
            );

            scrollFunc.current = scrollHandler.run;
            cancelScrollFunc.current = scrollHandler.cancel;
        } else {
            scrollFunc.current = null;
        }
    }, [props.autoScale, props.autoScaleTimeout]);

    // Animation
    const cancelAnimation = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = 0;
        }
    };

    const state = getState();

    useEffect(() => {
        cancelAnimation();

        animationFrameRef.current = requestAnimationFrame(() => {
            animationFrameRef.current = 0;

            dispatch(actions.startAnimation());
        });

        return () => cancelAnimation();
    }, [state?.animateNow]);

    // Scroll
    useEffect(() => {
        const scrollLeft = props.scrollLeft
            ? Math.round(parseFloat(props.scrollLeft))
            : null;

        if (
            scrollLeft === null
            || scrollLeft === state.scrollLeft
        ) {
            return;
        }

        dispatch(actions.requestScroll());
        dispatch(actions.setScroll(scrollLeft));
    }, [props.scrollLeft]);

    useEffect(() => {
        if (!scrollerRef.current) {
            return undefined;
        }

        if (!state.scrollRequested) {
            return undefined;
        }

        cancelAnimation();

        animationFrameRef.current = requestAnimationFrame(() => {
            animationFrameRef.current = 0;

            if (scrollerRef.current) {
                scrollerRef.current.scrollLeft = state.scrollLeft;
            }
        });

        return () => cancelAnimation();
    }, [state?.scrollLeft]);

    // Main chart element props
    const chartProps = {
        className: classNames(
            'chart',
            props.className,
            {
                'chart_x-axis-top': (props.xAxis === 'top'),
                'chart_y-axis-left': (props.yAxis === 'left'),
            },
        ),
    };

    // Chart container
    const chartContainerProps = {
        className: classNames(
            'chart__horizontal',
            {
                chart_animated: state?.autoScale && state?.animate && state?.animateNow,
                chart_stacked: !!props.data.stacked,
            },
        ),
    };

    const chartContentProps = {
        className: 'chart__content',
        onClick,
        onTransitionEndCapture: handleTransitionEnd,
    };
    if (state?.chartWidth) {
        chartContentProps.width = state.chartWidth;
    }
    if (state?.height) {
        chartContentProps.height = state.height;
    }

    if (
        props.activateOnHover
        || props.showPopupOnHover
        || isFunction(props.onItemOver)
        || isFunction(props.onItemOut)
    ) {
        chartContentProps.onTouchStart = onTouchStart;
        chartContentProps.onMouseMove = onMouseMove;
        chartContentProps.onMouseLeave = onMouseLeave;
    }

    // Popup position
    const popupPositionProps = {
        position: state?.popupPosition,
        margin: 5,
        screenPadding: 5,
        useRefWidth: false,
        minRefHeight: 5,
        scrollOnOverflow: false,
        allowResize: true,
        allowFlip: true,
        allowChangeAxis: true,
    };

    // Popup
    const popupPosition = usePopupPosition({
        open: !!state?.popupTarget,
        ...popupPositionProps,
    });

    const PopupContainer = BaseChartPopupContainer;

    const chartPopup = (
        state?.popupTarget
        && (
            <PopupContainer
                {...state}
                target={state?.popupTarget}
                ref={popupPosition.elementRef}
            />
        )
    );

    // Pinned popup
    const pinnedPopupPosition = usePopupPosition({
        open: !!state?.pinnedTarget,
        ...popupPositionProps,
    });
    const pinnedPopup = (
        state?.pinnedTarget
        && (
            <PopupContainer
                {...state}
                target={state?.pinnedTarget}
                ref={pinnedPopupPosition.elementRef}
            />
        )
    );

    if (!state?.components) {
        return null;
    }

    // Grid
    const Grid = getComponent('Grid', state);
    const chartGrid = <Grid {...state} />;

    // x axis labels
    const XAxisLabels = getComponent('XAxisLabels', state);
    const xAxisLabels = <XAxisLabels {...state} ref={xAxisLabelsRef} />;

    // y axis labels
    const YAxisLabels = getComponent('YAxisLabels', state);
    const yAxisLabels = <YAxisLabels {...state} />;

    // Legend
    const Legend = getComponent('Legend', state);
    const legend = props.showLegend && <Legend {...state} />;

    // Active group
    const ActiveGroup = getComponent('ActiveGroup', state);
    const activeGroup = (
        state?.showActiveGroup
        && state?.activeTarget
        && <ActiveGroup {...state} />
    );

    // Data series
    const DataSeries = getComponent('DataSeries', state);
    const series = (
        <DataSeries
            {...state}
            popupTargetRef={popupPosition.referenceRef}
            pinnedPopupTargetRef={pinnedPopupPosition.referenceRef}
        />
    );

    // Custom scroller container content
    const {
        beforeScroller = null,
        afterScroller = null,
    } = props;

    return (
        <div {...chartProps} ref={innerRef}>
            <div {...chartContainerProps}>
                <div className="chart__container">
                    {beforeScroller}
                    <div className="chart__scroller" onScroll={onScroll} ref={scrollerRef}>
                        <div className="chart">
                            <svg {...chartContentProps} ref={chartContentRef}>
                                {chartGrid}
                                {activeGroup}
                                {series}
                            </svg>
                            {xAxisLabels}
                        </div>
                    </div>
                    {afterScroller}
                </div>
                {yAxisLabels}
            </div>
            {legend}
            {chartPopup}
            {pinnedPopup}
        </div>
    );
});

const isComponent = PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
]);

BaseChartContainer.childComponents = {
    ActiveGroup: isComponent,
    ChartPopup: isComponent,
    DataItem: isComponent,
    DataSeries: isComponent,
    Grid: isComponent,
    Legend: isComponent,
    XAxisLabels: isComponent,
    YAxisLabels: isComponent,
};

BaseChartContainer.propTypes = {
    id: PropTypes.string,
    data: PropTypes.object,
    className: PropTypes.string,

    // Layout
    columnWidth: PropTypes.number,
    groupsGap: PropTypes.number,
    height: PropTypes.number,
    marginTop: PropTypes.number,
    autoScale: PropTypes.bool,
    autoScaleTimeout: PropTypes.number,
    scrollToEnd: PropTypes.bool,

    scrollLeft: PropTypes.number,

    beforeScroller: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
    afterScroller: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),

    // Grid
    xAxisGrid: PropTypes.bool,
    yAxisGrid: PropTypes.bool,

    // Labels
    xAxis: PropTypes.oneOf(['bottom', 'top', 'none']),
    yAxis: PropTypes.oneOf(['left', 'right', 'none']),
    yAxisLabelsAlign: PropTypes.oneOf(['left', 'center', 'right']),

    alignColumns: PropTypes.oneOf(['left', 'center', 'right']),
    activateOnHover: PropTypes.bool,
    showLegend: PropTypes.bool,
    animationEndTimeout: PropTypes.number,

    // Popup
    showPopupOnHover: PropTypes.bool,

    // Callbacks
    onStoreReady: PropTypes.func,
    onItemClick: PropTypes.func,
    onItemOver: PropTypes.func,
    onItemOut: PropTypes.func,
    onScroll: PropTypes.func,
    scrollDone: PropTypes.func,

    // Chart data functions
    getGroupOuterWidth: PropTypes.func,
    getFirstVisibleGroupIndex: PropTypes.func,
    getVisibleGroupsCount: PropTypes.func,

    // Child components
    components: PropTypes.shape({
        ...BaseChartContainer.childComponents,
    }),
};
