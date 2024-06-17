import PropTypes from 'prop-types';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';

import { px } from '../../../../utils/common.js';
import { useStore } from '../../../../utils/Store/StoreProvider.jsx';

import './BaseChartXAxisLabels.scss';

/**
 * BaseChartXAxisLabels component
 */
// eslint-disable-next-line react/display-name
export const BaseChartXAxisLabels = forwardRef((props, ref) => {
    const defaultLabelRenderer = (value) => value?.toString();

    const {
        xAxis = 'bottom',
        allowLastXAxisLabelOverflow = true,
    } = props;
    const disabled = xAxis === 'none';

    const { getState, setState } = useStore();

    const [prevState, setPrevState] = useState({
        scrollLeft: 0,
    });

    const innerRef = useRef(null);
    useImperativeHandle(ref, () => innerRef.current);
    const animationFrameRef = useRef(0);

    const initLabels = () => {
        const groupOuterWidth = props.getGroupOuterWidth(props);
        const firstGroupIndex = props.getFirstVisibleGroupIndex(props);
        const visibleGroups = props.getVisibleGroupsCount(firstGroupIndex, props);
        const formatFunction = props.renderXAxisLabel ?? defaultLabelRenderer;

        const isAlreadyHidden = (label) => {
            const { xAxisLabels } = getState();
            const groupIndex = label.id;

            if (
                !xAxisLabels
                || !(groupIndex >= xAxisLabels.firstGroupIndex)
                || !(groupIndex <= xAxisLabels.lastGroupIndex)
            ) {
                return false;
            }

            const prevItem = xAxisLabels.items.find((item) => item.id === groupIndex);
            return !!prevItem?.hidden;
        };

        const items = [];
        for (let i = 0; i < visibleGroups; i += 1) {
            const groupIndex = firstGroupIndex + i;
            const value = props.data.series[groupIndex];
            if (typeof value === 'undefined') {
                break;
            }

            const prevValue = props.data.series[groupIndex - 1] ?? null;
            if (value === prevValue) {
                continue;
            }

            const item = {
                id: groupIndex,
                value: formatFunction(value),
                className: 'chart__text chart-x-axis__label',
                style: {
                    left: px(groupIndex * groupOuterWidth),
                },
                'data-id': groupIndex,
            };

            item.hidden = isAlreadyHidden(item);

            items.push(item);
        }

        setState((prev) => ({
            ...prev,
            xAxisLabels: {
                firstGroupIndex,
                lastGroupIndex: firstGroupIndex + visibleGroups,
                visibleGroups,
                items,
            },
        }));
    };

    const getFilteredItems = () => {
        const { items } = getState().xAxisLabels;
        return items?.filter((item) => !item.hidden);
    };

    const updateLabels = () => {
        let lastOffset = null;
        const lblMarginLeft = 10;
        const labelsToRemove = [];
        let resizeRequested = false;
        let resizeOffset = 0;
        const toLeft = (
            prevState.scrollLeft > 0
            && props.scrollLeft < prevState.scrollLeft
        );

        const labels = innerRef.current.children;
        const filteredItems = getFilteredItems();

        if (labels.length < filteredItems.length) {
            animationFrameRef.current = requestAnimationFrame(() => updateLabels());
            return;
        }

        const { items } = getState().xAxisLabels;

        for (let ind = 0; ind < labels.length; ind += 1) {
            const index = (toLeft) ? (labels.length - ind - 1) : ind;
            const label = labels[index];
            const labelLeft = label.offsetLeft;
            const labelRight = labelLeft + label.offsetWidth;

            const groupIndex = parseInt(label.dataset?.id ?? -1, 10);
            const item = items.find(({ id }) => id === groupIndex);
            if (!item) {
                continue;
            }

            const overflow = (toLeft)
                ? (labelRight + lblMarginLeft > lastOffset)
                : (labelLeft < lastOffset + lblMarginLeft);

            // Check current label not intersects previous one
            if (lastOffset !== null && overflow) {
                labelsToRemove.push(item.id);
                continue;
            }

            // Check last label not overflow chart to prevent
            // horizontal scroll in fitToWidth mode
            if (
                (labelRight - props.chartContentWidth > 1)
                && (labelRight - props.scrollerWidth > 1)
            ) {
                resizeRequested = !props.fitToWidth;
                resizeOffset = labelRight;
                if (props.fitToWidth || !allowLastXAxisLabelOverflow) {
                    labelsToRemove.push(item.id);
                    continue;
                }
            }

            lastOffset = (toLeft) ? labelLeft : labelRight;
        }

        if (resizeRequested) {
            setTimeout(() => props.onResize?.(resizeOffset));
        }

        animationFrameRef.current = 0;

        setState((prev) => ({
            ...prev,
            xAxisLabels: {
                ...prev.xAxisLabels,
                items: items.map((item) => ({
                    ...item,
                    hidden: item.hidden || labelsToRemove.includes(item.id),
                })),
            },
        }));

        setPrevState((prev) => ({
            ...prev,
            scrollLeft: props.scrollLeft,
        }));
    };

    const cancelUpdate = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = 0;
        }
    };

    useEffect(() => {
        if (disabled || !innerRef.current) {
            return undefined;
        }

        initLabels();

        cancelUpdate();
        animationFrameRef.current = requestAnimationFrame(() => updateLabels());

        return () => cancelUpdate();
    }, [
        innerRef.current,
        props.chartContentWidth,
        props.scrollerWidth,
        props.fitToWidth,
        props.scrollLeft,
    ]);

    if (disabled) {
        return null;
    }

    const state = getState();
    const labels = state.xAxisLabels?.items ?? [];
    const filteredItems = labels.filter((item) => !item.hidden);

    return (
        <div className="chart-x-axis-labels" ref={innerRef}>
            {filteredItems.map(({ id, value, ...item }) => (
                <span {...item} key={id}>{value}</span>
            ))}
        </div>
    );
});

BaseChartXAxisLabels.propTypes = {
    data: PropTypes.object,
    xAxis: PropTypes.oneOf(['bottom', 'top', 'none']),
    scrollerWidth: PropTypes.number,
    chartContentWidth: PropTypes.number,
    scrollLeft: PropTypes.number,
    hLabelsHeight: PropTypes.number,
    fitToWidth: PropTypes.bool,
    allowLastXAxisLabelOverflow: PropTypes.bool,
    renderXAxisLabel: PropTypes.func,
    isHorizontalScaleNeeded: PropTypes.func,
    getGroupOuterWidth: PropTypes.func,
    getFirstVisibleGroupIndex: PropTypes.func,
    getVisibleGroupsCount: PropTypes.func,
    onResize: PropTypes.func,
};
