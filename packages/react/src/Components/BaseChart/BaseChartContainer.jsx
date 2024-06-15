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
import { getComponent } from './helpers.js';
import { BaseChartPopupContainer } from './BaseChartPopupContainer.jsx';
import { usePopupPosition } from '../../hooks/usePopupPosition/usePopupPosition.js';

/**
 * BaseChartContainer component
 */
// eslint-disable-next-line react/display-name
export const BaseChartContainer = forwardRef((props, ref) => {
    const {
        state,
        getState,
        setState,
        dispatch,
    } = useStore();

    const innerRef = useRef(null);
    useImperativeHandle(ref, () => innerRef.current);

    const scrollerRef = useRef(null);
    const xAxisLabelsRef = useRef(null);
    const popupRef = useRef(null);
    const pinnedPopupRef = useRef(null);

    /** Returns object with main dimensions of component */
    const measureLayout = () => {
        if (!scrollerRef.current || !innerRef.current) {
            return {};
        }

        const res = {
            contentOffset: getOffset(scrollerRef.current),
            scrollerWidth: scrollerRef.current?.offsetWidth,
            scrollLeft: scrollerRef.current?.scrollLeft,
            scrollWidth: scrollerRef.current?.scrollWidth,
            containerWidth: innerRef.current?.offsetWidth,
        };

        res.xAxisLabelsHeight = xAxisLabelsRef.current?.offsetHeight ?? 0;
console.log('measureLayout()  xAxisLabelsHeight: ', res.xAxisLabelsHeight);

        if (!props.height) {
            const { clientHeight } = scrollerRef.current;

            res.containerHeight = innerRef.current?.offsetHeight;



            res.height = clientHeight - res.xAxisLabelsHeight;
            res.chartHeight = clientHeight - res.xAxisLabelsHeight - props.marginTop;


        console.log(' measureLayout() res.height: ', res.height, ' res.chartHeight: ', res.chartHeight);
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

    /**
     * 'scroll' event handler
     */
    const onScroll = () => {
        dispatch(actions.scroll(measureLayout()));

        /*
        if (this.scaleFunc) {
            this.scaleFunc();
        }

        if (this.scrollFunc) {
            this.scrollFunc();
        }
        */

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
    };

    // Process chart data on update
    useEffect(() => {
        dispatch(actions.setData({ data: state.data, layout: measureLayout() }));
    }, [state.data]);

    // Process chart data on update
    useEffect(() => {
        dispatch(actions.setColumnWidth(props.columnWidth));
    }, [props.columnWidth]);

    useEffect(() => {
        dispatch(actions.setGroupsGap(props.groupsGap));
    }, [props.groupsGap]);

    // Resize observer
    useEffect(() => {
        const handler = debounce(() => onResize(), state.resizeTimeout);
        const observer = new ResizeObserver(handler);
        observer.observe(scrollerRef.current);

        return () => {
            observer.disconnect();
        };
    }, [scrollerRef.current]);

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

    const chartContentProps = {
        className: 'chart__content',
        onClick,
    };
    if (state.chartWidth) {
        chartContentProps.width = state.chartWidth;
    }
    if (state.height) {
        chartContentProps.height = state.height - 24;

//const xAxisLabelsHeight = xAxisLabelsRef.current?.offsetHeight ?? 0;

console.log(' chartContentProps.height: ',chartContentProps.height,' state.height: ', state.height, ' xAxisLabelsHeight: ', state.xAxisLabelsHeight);
    }


    if (
        props.activateOnHover
        || props.showPopupOnHover
        || isFunction(props.onItemOver)
        || isFunction(props.onItemOut)
    ) {
        chartProps.onTouchStart = onTouchStart;
        chartProps.onMouseMove = onMouseMove;
        chartProps.onMouseLeave = onMouseLeave;
    }

    // Grid
    const Grid = getComponent('Grid', state);
    const chartGrid = <Grid {...state} />;

    // x axis labels
    const XAxisLabels = getComponent('XAxisLabels', state);
    const xAxisLabels = <XAxisLabels {...state} />;

    // y axis labels
    const YAxisLabels = getComponent('YAxisLabels', state);
    const yAxisLabels = <YAxisLabels {...state} />;

    // Legend
    const Legend = getComponent('Legend', state);
    const legend = props.showLegend && <Legend {...state} />;

    // Active group
    const ActiveGroup = getComponent('ActiveGroup', state);
    const activeGroup = (
        state.showActiveGroup
        && state.activeTarget
        && <ActiveGroup {...state} />
    );

    // Popup
    const PopupContainer = BaseChartPopupContainer;

    const popupPositionProps = {
        position: state.popupPosition,
        margin: 5,
        screenPadding: 5,
        useRefWidth: false,
        minRefHeight: 5,
        scrollOnOverflow: false,
        allowResize: true,
        allowFlip: true,
        allowChangeAxis: true,
    };

    const popupPosition = usePopupPosition({
        open: !!state.popupTarget,
        ...popupPositionProps,
    });

    const chartPopup = (
        state.popupTarget
        && (
            <PopupContainer
                {...state}
                target={state.popupTarget}
                ref={popupPosition.elementRef}
            />
        )
    );

    // Pinned popup
    const pinnedPopupPosition = usePopupPosition({
        open: !!state.pinnedTarget,
        ...popupPositionProps,
    });
    const pinnedPopup = (
        state.pinnedTarget
        && (
            <PopupContainer
                {...state}
                target={state.pinnedTarget}
                ref={pinnedPopupPosition.elementRef}
            />
        )
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

    return (
        <div {...chartProps} ref={innerRef}>
            <div className="chart__horizontal">
                <div className="chart__container">
                    <div className="chart__scroller" onScroll={onScroll} ref={scrollerRef}>
                        <div className="chart">
                            <svg {...chartContentProps}>
                                {chartGrid}
                                {activeGroup}
                                {series}
                            </svg>
                            {xAxisLabels}
                        </div>
                    </div>
                </div>
                {yAxisLabels}
            </div>
            {legend}
            {chartPopup}
            {pinnedPopup}
        </div>
    );
});

BaseChartContainer.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    height: PropTypes.number,
    marginTop: PropTypes.number,
    activateOnHover: PropTypes.bool,
    showPopupOnHover: PropTypes.bool,
    showLegend: PropTypes.bool,
    onItemClick: PropTypes.func,
    onItemOver: PropTypes.func,
    onItemOut: PropTypes.func,
    onScroll: PropTypes.func,
};
