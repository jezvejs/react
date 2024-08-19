import { useEffect } from 'react';
import { useStore } from '../../../../utils/Store/StoreProvider.tsx';
import { isSameTarget } from '../../../BaseChart/helpers.ts';
import {
    HistogramComponents,
    HistogramDataGroup,
    HistogramDataItemType,
    HistogramDataSeriesComponent,
    HistogramDataSeriesProps,
    HistogramItemProps,
    HistogramState,
} from '../../types.ts';

/**
 * HistogramDataSeries component
 */
export const HistogramDataSeries: HistogramDataSeriesComponent = (
    props: HistogramDataSeriesProps,
) => {
    const store = useStore();

    const { dataSets, activeTarget, grid } = props;

    useEffect(() => {
        const stackedGroups = props.getStackedGroups(props);
        const stackedCategories = props.getStackedCategories(props);
        const firstGroupIndex = props.getFirstVisibleGroupIndex(props);
        const visibleGroups = props.getVisibleGroupsCount(firstGroupIndex, props);
        const activeCategory = props.activeCategory?.toString() ?? null;

        const items: HistogramDataGroup[] = [];
        for (let i = 0; i < visibleGroups; i += 1) {
            const groupIndex = firstGroupIndex + i;
            const group: HistogramDataGroup = [];
            const posValueOffset = Array(props.columnsInGroup).fill(0);
            const negValueOffset = Array(props.columnsInGroup).fill(0);

            dataSets.forEach((dataSet, dataSetIndex) => {
                const value = dataSet.data[groupIndex] ?? 0;
                if (!props.isVisibleValue(value)) {
                    return;
                }

                const category = dataSet.category ?? null;
                const categoryIndex = (category && stackedCategories.includes(category))
                    ? stackedCategories.indexOf(category)
                    : dataSetIndex;
                const groupName = dataSet.group ?? null;
                const columnIndex = (props.data.stacked)
                    ? stackedGroups.indexOf(groupName)
                    : categoryIndex;
                const valueOffset = (value >= 0)
                    ? posValueOffset[columnIndex]
                    : negValueOffset[columnIndex];

                const active = (
                    (!!category && category.toString() === activeCategory)
                    || (categoryIndex.toString() === activeCategory)
                    || (
                        !!activeTarget
                        && activeTarget.groupIndex === groupIndex
                        && activeTarget.categoryIndex === categoryIndex
                        && activeTarget.columnIndex === columnIndex
                    )
                );

                const itemProps: HistogramItemProps = {
                    value,
                    groupIndex,
                    columnIndex,
                    category,
                    categoryIndex,
                    active,
                    valueOffset,
                    groupName,
                    animateNow: props.animateNow,
                };

                const item = props.createItem(itemProps, props);

                group.push(item);

                if (!props.data.stacked) {
                    return;
                }
                if (value >= 0) {
                    posValueOffset[columnIndex] += value;
                } else {
                    negValueOffset[columnIndex] += value;
                }
            });

            items.push(group);
        }

        store?.setState((prev: HistogramState) => ({
            ...prev,
            dataSeries: {
                ...prev.dataSeries,
                firstGroupIndex,
                lastGroupIndex: firstGroupIndex + visibleGroups,
                visibleGroups,
                items,
            },
        }));
    }, [
        dataSets,
        props.data,
        props.grid,
        props.height,
        props.chartWidth,
        props.chartContentWidth,
        props.scrollerWidth,
        props.columnWidth,
        props.groupsGap,
        props.groupsCount,
        props.scrollLeft,
        props.activeTarget,
        props.activeCategory,
        props.popupTarget,
        props.pinnedTarget,
    ]);

    if (!store || dataSets.length === 0 || !grid) {
        return null;
    }

    const state = store.getState() as HistogramState;

    const components = state.components as HistogramComponents;
    const DataItem = components?.DataItem;
    if (!DataItem) {
        return null;
    }

    const items = state.dataSeries?.items ?? [];

    const commonProps = {
        autoScale: state.autoScale,
        animate: state.animate,
        animateNow: state.animateNow,
    };

    return (
        <g>
            {items.flat().map((item: HistogramDataItemType | null, ind) => {
                if (!item) {
                    return null;
                }

                if (isSameTarget(item, state.popupTarget)) {
                    return (
                        <DataItem
                            {...commonProps}
                            {...item}
                            key={`xgrid_${ind}`}
                            ref={props.popupTargetRef}
                        />
                    );
                }

                if (isSameTarget(item, state.pinnedTarget)) {
                    return (
                        <DataItem
                            {...commonProps}
                            {...item}
                            key={`xgrid_${ind}`}
                            ref={props.pinnedPopupTargetRef}
                        />
                    );
                }

                return (
                    <DataItem
                        {...commonProps}
                        {...item}
                        key={`xgrid_${ind}`}
                    />
                );
            })}
        </g>
    );
};
