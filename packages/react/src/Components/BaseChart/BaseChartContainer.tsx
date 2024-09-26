import { isFunction } from '@jezvejs/types';
import { getOffset } from '@jezvejs/dom';
import React, {
    forwardRef,
    useRef,
    useImperativeHandle,
    useEffect,
} from 'react';
import classNames from 'classnames';

// Utils
import { debounce, DebounceCancelFunction, DebounceCancellableReturnResult } from '../../utils/common.ts';
import { useStore } from '../../utils/Store/StoreProvider.tsx';
import { usePopupPosition } from '../../hooks/usePopupPosition/usePopupPosition.ts';

import { actions } from './reducer.ts';
import { mapValues } from './helpers.ts';
import { BaseChartPopupContainer } from './BaseChartPopupContainer.tsx';
import {
    BaseChartContainerRef,
    BaseChartDataSeriesComponent,
    BaseChartItemSearchResult,
    BaseChartMeasuredLayout,
    BaseChartScaleFunction,
    BaseChartScrollFunction,
    BaseChartSizeFunction,
    BaseChartState,
    BaseChartXAxisLabelsRef,
} from './types.ts';

/**
 * BaseChartContainer component
 */
// eslint-disable-next-line react/display-name
export const BaseChartContainer = forwardRef<
    BaseChartContainerRef,
    BaseChartState
>((props, ref) => {
    const store = useStore<BaseChartState>();
    const { getState, setState, dispatch } = store;

    useEffect(() => {
        if (store) {
            props?.onStoreReady?.(store);
        }
    }, [store]);

    const innerRef = useRef<HTMLDivElement | null>(null);
    useImperativeHandle<
        BaseChartContainerRef,
        BaseChartContainerRef
    >(ref, () => innerRef?.current);

    const scrollerRef = useRef<HTMLDivElement | null>(null);
    const chartContentRef = useRef<SVGSVGElement | null>(null);
    const xAxisLabelsRef = useRef<BaseChartXAxisLabelsRef>(null);
    const popupRef = useRef<HTMLElement | null>(null);
    const pinnedPopupRef = useRef<HTMLElement | null>(null);

    const sizeFunc = useRef<BaseChartSizeFunction | null>(null);
    const cancelSizeFunc = useRef<DebounceCancelFunction | null>(null);

    const scaleFunc = useRef<BaseChartScaleFunction | null>(null);
    const cancelScaleFunc = useRef<DebounceCancelFunction | null>(null);

    const scrollFunc = useRef<BaseChartScrollFunction | null>(null);
    const cancelScrollFunc = useRef<DebounceCancelFunction | null>(null);

    const resizeUpdateRef = useRef<number>(0);
    const animationFrameRef = useRef<number>(0);
    const removeTransitionHandlerRef = useRef(null);

    /** Returns object with main dimensions of component */
    const measureLayout = (): BaseChartMeasuredLayout | null => {
        if (!scrollerRef.current || !innerRef.current) {
            return null;
        }

        const { clientHeight, scrollWidth, scrollLeft } = scrollerRef.current;

        const res: BaseChartMeasuredLayout = {
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
            res.chartHeight = res.height - (props.marginTop ?? 0);
        }

        return res;
    };

    const hidePopup = () => {
        dispatch(actions.hidePopup());
    };

    /** Activates specified target */
    const activateTarget = (target: BaseChartItemSearchResult) => {
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
            return;
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
    const onClick = (e: React.MouseEvent) => {
        if (!innerRef.current) {
            return;
        }

        const state = getState();

        const target = state.findItemByEvent(e, getState(), innerRef.current);
        if (!target?.item) {
            deactivateTarget();
            return;
        }

        if (state.activateOnClick || state.showPopupOnClick) {
            activateTarget(target);
        }

        dispatch(actions.itemClicked());

        props.onItemClick?.({ e });
    };

    /**
     * 'touchstart' event handler
     * @param {React.TouchEvent} e
     */
    const onTouchStart = (e: React.TouchEvent) => {
        if (e.touches) {
            dispatch(actions.ignoreTouch());
        }
    };

    /**
     * 'mousemove' event handler
     * @param {React.MouseEvent} e
     */
    const onMouseMove = (e: React.MouseEvent) => {
        if (!innerRef.current) {
            return;
        }

        const state = getState();
        if (state.ignoreTouch) {
            return;
        }

        const target = state.findItemByEvent(e, getState(), innerRef.current);
        if (state.currentTarget?.item === target?.item) {
            return;
        }

        if (state.currentTarget?.item) {
            props.onItemOut?.({ ...state.currentTarget, e });
        }

        setState((prev: BaseChartState) => ({
            ...prev,
            currentTarget: target,
        }));

        if (!innerRef.current?.contains?.(e.target as Node)) {
            if (state.activateOnHover) {
                deactivateTarget();
            }
            return;
        }

        if (state.activateOnHover && target) {
            activateTarget(target);
        }

        dispatch(actions.itemOver());

        props.onItemOver?.({ ...target, e });
    };

    /**
     * 'mouseleave' event handler
     * @param {MouseEvent} e
     */
    const onMouseLeave = (e: React.MouseEvent) => {
        const state = getState();

        const relatedNode = e.relatedTarget as Node;
        if (
            relatedNode
            && (
                popupRef.current?.contains(relatedNode)
                || pinnedPopupRef.current?.contains(relatedNode)
            )
        ) {
            return;
        }

        if (state.activateOnHover) {
            deactivateTarget();
        }

        if (state.currentTarget?.item) {
            props.onItemOut?.({ ...state.currentTarget, e });
        }

        setState((prev) => ({
            ...prev,
            currentTarget: null,
        }));
    };

    const cancelResizeUpdate = () => {
        if (resizeUpdateRef.current) {
            cancelAnimationFrame(resizeUpdateRef.current);
            resizeUpdateRef.current = 0;
        }
    };

    const requestResizeUpdate = () => {
        cancelResizeUpdate();
        resizeUpdateRef.current = requestAnimationFrame(() => onResize());
    };

    /** Chart scroller resize observer handler */
    function onResize(lastHLabelOffset = 0) {
        dispatch(actions.resize({
            ...measureLayout(),
            lastHLabelOffset,
        }));

        const state = getState();
        if (state.scrollerWidth === 0) {
            requestResizeUpdate();
            return;
        }

        resizeUpdateRef.current = 0;

        if (scaleFunc.current) {
            scaleFunc.current();
        }

        if (scrollFunc.current) {
            scrollFunc.current();
        }

        props.onResize?.();
    }

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
        if (!scrollerRef.current) {
            return undefined;
        }

        const state = getState();

        const debouncedHandler = debounce(
            () => onResize(),
            state.resizeTimeout,
            { cancellable: true },
        ) as DebounceCancellableReturnResult;
        const handler = (typeof debouncedHandler === 'function')
            ? debouncedHandler
            : debouncedHandler.run;

        const observer = new ResizeObserver(handler);
        observer.observe(scrollerRef.current);

        if (typeof debouncedHandler === 'object') {
            sizeFunc.current = debouncedHandler.run ?? null;
            cancelSizeFunc.current = debouncedHandler.cancel;
        }

        return () => {
            observer.disconnect();
            if (
                typeof debouncedHandler === 'object'
                && typeof cancelSizeFunc.current === 'function'
            ) {
                cancelSizeFunc.current();
                cancelSizeFunc.current = null;
            }
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

            if (typeof scaleHandler === 'object') {
                scaleFunc.current = scaleHandler.run;
                cancelScaleFunc.current = scaleHandler.cancel;
            }
        }

        if (props.scrollToEnd) {
            const scrollHandler = debounce(
                () => scrollToRight(),
                100,
                { cancellable: true },
            );

            if (typeof scrollHandler === 'object') {
                scrollFunc.current = scrollHandler.run;
                cancelScrollFunc.current = scrollHandler.cancel;
            }
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
            ? Math.round(props.scrollLeft)
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

    const chartContentProps: React.SVGProps<SVGSVGElement> = {
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
    const {
        Grid,
        XAxisLabels,
        YAxisLabels,
        Legend,
        ActiveGroup,
    } = state.components;

    // Grid
    const chartGrid = Grid && <Grid {...state} />;

    // x axis labels
    const xAxisLabels = XAxisLabels && (
        <XAxisLabels {...state} onResize={onResize} ref={xAxisLabelsRef} />
    );

    // y axis labels
    const yAxisLabels = YAxisLabels && <YAxisLabels {...state} />;

    // Legend
    const legend = props.showLegend && Legend && <Legend {...state} />;

    // Active group
    const activeGroup = (
        state?.showActiveGroup
        && state?.activeTarget
        && ActiveGroup
        && <ActiveGroup {...state} />
    );

    // Data series
    const DataSeries = state.components.DataSeries as BaseChartDataSeriesComponent;
    const series = DataSeries && (
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
