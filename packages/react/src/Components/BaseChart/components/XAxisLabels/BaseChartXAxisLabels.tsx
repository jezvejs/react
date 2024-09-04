import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';

import { px } from '../../../../utils/common.ts';
import { StoreUpdater } from '../../../../utils/Store/Store.ts';
import { useStore } from '../../../../utils/Store/StoreProvider.tsx';

import { BaseChartState, BaseChartXAxisLabelProps } from '../../types.ts';
import './BaseChartXAxisLabels.scss';

type BaseChartXAxisLabelsRef = HTMLDivElement | null;

/**
 * BaseChartXAxisLabels component
 */
// eslint-disable-next-line react/display-name
export const BaseChartXAxisLabels = forwardRef<
    BaseChartXAxisLabelsRef,
    BaseChartState
>((props, ref) => {
    const defaultLabelRenderer = (value: number | string) => (value?.toString() ?? '');

    const {
        xAxis = 'bottom',
        allowLastXAxisLabelOverflow = true,
    } = props;
    const disabled = xAxis === 'none';

    const store = useStore();

    const getState = (): BaseChartState | null => (store?.getState() as BaseChartState) ?? null;
    const setState = (update: StoreUpdater) => store?.setState(update);

    const [prevState, setPrevState] = useState({
        scrollLeft: 0,
    });

    const innerRef = useRef<HTMLDivElement>(null);
    useImperativeHandle<BaseChartXAxisLabelsRef, BaseChartXAxisLabelsRef>(ref, () => (
        innerRef?.current
    ));

    const animationFrameRef = useRef<number>(0);

    const initLabels = () => {
        const groupOuterWidth = props.getGroupOuterWidth(props);
        const firstGroupIndex = props.getFirstVisibleGroupIndex(props);
        const visibleGroups = props.getVisibleGroupsCount(firstGroupIndex, props);
        const formatFunction = props.renderXAxisLabel ?? defaultLabelRenderer;

        const isAlreadyHidden = (label: BaseChartXAxisLabelProps) => {
            const state = getState();
            const groupIndex = parseInt(label.id, 10);

            const xAxisLabels = state?.xAxisLabels ?? null;
            if (
                !xAxisLabels
                || !(groupIndex >= xAxisLabels.firstGroupIndex)
                || !(groupIndex <= xAxisLabels.lastGroupIndex)
            ) {
                return false;
            }

            const prevItem = xAxisLabels.items.find((item) => item.id === groupIndex.toString());
            return !!prevItem?.hidden;
        };

        const items: BaseChartXAxisLabelProps[] = [];
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

            const item: BaseChartXAxisLabelProps = {
                id: groupIndex.toString(),
                value: formatFunction(value),
                className: 'chart__text chart-x-axis__label',
                style: {
                    left: px(groupIndex * groupOuterWidth),
                },
                'data-id': groupIndex.toString(),
                hidden: false,
            };

            item.hidden = isAlreadyHidden(item);

            items.push(item);
        }

        setState((prev: BaseChartState) => ({
            ...prev,
            xAxisLabels: {
                firstGroupIndex,
                lastGroupIndex: firstGroupIndex + visibleGroups,
                visibleGroups,
                items,
            },
        }));
    };

    const getItems = (): BaseChartXAxisLabelProps[] => {
        const state = getState();
        return (state?.xAxisLabels?.items ?? []) as BaseChartXAxisLabelProps[];
    };

    const getFilteredItems = () => {
        const items = getItems();
        return items?.filter((item: BaseChartXAxisLabelProps) => !item.hidden);
    };

    const cancelLabelsUpdate = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = 0;
        }
    };

    const requestLabelsUpdate = () => {
        cancelLabelsUpdate();
        animationFrameRef.current = requestAnimationFrame(() => updateLabels());
    };

    function updateLabels() {
        let lastOffset: number | null = null;
        const lblMarginLeft = 10;
        const labelsToRemove: string[] = [];
        let resizeRequested = false;
        let resizeOffset = 0;
        const toLeft = (
            prevState.scrollLeft > 0
            && props.scrollLeft < prevState.scrollLeft
        );

        const labels = innerRef.current?.children;
        if (!labels) {
            return;
        }
        const filteredItems = getFilteredItems();

        if (
            (labels.length < filteredItems.length)
            || (props.scrollerWidth === 0)
        ) {
            requestLabelsUpdate();
            return;
        }

        const items = getItems();

        for (let ind = 0; ind < labels.length; ind += 1) {
            const index = (toLeft) ? (labels.length - ind - 1) : ind;
            const label = labels[index] as HTMLElement;
            const labelLeft = label.offsetLeft;
            const labelRight = labelLeft + label.offsetWidth;

            const labelId = label.dataset?.id ?? null;
            const groupIndex = (labelId) ? parseInt(labelId, 10) : -1;
            const item = items.find(({ id }) => id === groupIndex.toString());
            if (!item) {
                continue;
            }

            const overflow = (toLeft)
                ? (lastOffset !== null && labelRight + lblMarginLeft > lastOffset)
                : (lastOffset !== null && labelLeft < lastOffset + lblMarginLeft);

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

        setState((prev: BaseChartState) => ({
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
    }

    useEffect(() => {
        if (disabled || !innerRef.current) {
            return undefined;
        }

        initLabels();
        requestLabelsUpdate();

        return () => cancelLabelsUpdate();
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

    const labels = getItems();
    const filteredItems = labels.filter((item) => !item.hidden);

    return (
        <div className="chart-x-axis-labels" ref={innerRef}>
            {filteredItems.map(({ id, value, ...item }) => (
                <span {...item} key={id}>{value}</span>
            ))}
        </div>
    );
});
