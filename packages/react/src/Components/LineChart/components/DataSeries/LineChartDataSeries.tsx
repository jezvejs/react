import { useEffect } from 'react';

import { isSameTarget } from '../../../BaseChart/helpers.ts';
import { useStore } from '../../../../utils/Store/StoreProvider.tsx';

import { getLinePath } from '../../helpers.ts';
import { BaseChartDataSet } from '../../../BaseChart/types.ts';
import {
    LineChartItemProps,
    LineChartState,
    LineChartDataGroup,
    LineChartDataItemType,
    LineChartDataPath,
    LineChartDataSeriesComponent,
    LineChartDataSeriesProps,
} from '../../types.ts';
import { BaseChartHelpers } from '../../../BaseChart/BaseChart.tsx';

/**
 * LineChartDataSeries component
 */
export const LineChartDataSeries: LineChartDataSeriesComponent = (
    p: LineChartDataSeriesProps,
) => {
    const props = p as LineChartState;
    const store = useStore();

    const storeState = store?.getState() as LineChartState;
    const { dataSets, activeTarget, grid } = storeState;

    useEffect(() => {
        const firstGroupIndex = props.getFirstVisibleGroupIndex(storeState);
        const visibleGroups = props.getVisibleGroupsCount(firstGroupIndex, storeState);
        const activeCategory = storeState.activeCategory?.toString() ?? null;

        const items: LineChartDataGroup[] = [];
        for (let i = 0; i < visibleGroups; i += 1) {
            const groupIndex = firstGroupIndex + i;
            const group: LineChartDataGroup = [];
            let posValueOffset = 0;
            let negValueOffset = 0;

            dataSets.forEach((dataSet: BaseChartDataSet, categoryIndex: number) => {
                const value = dataSet.data[groupIndex] ?? 0;
                const category = dataSet.category ?? null;
                const valueOffset = (value >= 0) ? posValueOffset : negValueOffset;

                const active = (
                    (category?.toString() === activeCategory)
                    || (categoryIndex.toString() === activeCategory)
                    || (
                        !!activeTarget
                        && activeTarget.groupIndex === groupIndex
                        && activeTarget.categoryIndex === categoryIndex
                    )
                );

                const itemProps: LineChartItemProps = {
                    value,
                    groupIndex,
                    category,
                    categoryIndex,
                    active,
                    valueOffset,
                    columnIndex: 0,
                };

                const item = props.createItem?.(itemProps, storeState);
                if (!item) {
                    return;
                }

                group.push(item);

                if (!storeState.data.stacked) {
                    return;
                }
                if (value >= 0) {
                    posValueOffset += value;
                } else {
                    negValueOffset += value;
                }
            });

            items.push(group);
        }

        // Paths
        const categoriesCount = props.getCategoriesCount(storeState);
        const paths: LineChartDataPath[] = [];
        const flatItems = items.flat() as LineChartDataItemType[];
        for (let i = 0; i < categoriesCount; i += 1) {
            const categoryItems = flatItems.filter((item) => (
                item?.categoryIndex === i
            ));

            const pathItem = categoryItems[0] ?? null;
            if (categoryItems.length === 0 || pathItem === null) {
                continue;
            }

            const { category, categoryIndex } = pathItem;
            const active = (
                (category?.toString() === activeCategory)
                || (categoryIndex?.toString() === activeCategory)
            );

            const path = getLinePath({
                values: categoryItems.map((item) => item.cy),
                categoryIndex,
                category,
                active,
            }, storeState);

            paths.push(path);
        }

        store?.setState((prev: LineChartState) => ({
            ...prev,
            dataSeries: {
                ...prev.dataSeries,
                firstGroupIndex,
                lastGroupIndex: firstGroupIndex + visibleGroups,
                visibleGroups,
                items,
                paths,
            },
        }));
    }, [
        dataSets,
        storeState.data,
        storeState.grid,
        storeState.height,
        storeState.chartWidth,
        storeState.chartContentWidth,
        storeState.scrollerWidth,
        storeState.columnWidth,
        storeState.groupsGap,
        storeState.groupsCount,
        storeState.scrollLeft,
        storeState.activeTarget,
        storeState.activeCategory,
        storeState.popupTarget,
        storeState.pinnedTarget,
    ]);

    if (!store || dataSets.length === 0 || !grid) {
        return null;
    }

    const state = store.getState() as LineChartState;

    const { DataItem, DataPath } = state.components;
    if (!DataItem || !DataPath) {
        return null;
    }

    const items = state.dataSeries?.items ?? [];
    const paths = state.dataSeries?.paths ?? [];

    const commonProps = {
        autoScale: state.autoScale,
        animate: state.animate,
        animateNow: state.animateNow,
        stacked: BaseChartHelpers.isStacked(state),
    };

    return (
        <>
            <g>
                {paths.flat().map((path, ind) => (
                    <DataPath
                        {...commonProps}
                        {...path}
                        key={`lcpath_${ind}`}
                    />
                ))}
            </g>
            <g>
                {items.flat().map((item: LineChartDataItemType | null, ind: number) => {
                    if (!item) {
                        return null;
                    }

                    if (isSameTarget(item, state.popupTarget)) {
                        return (
                            <DataItem
                                {...commonProps}
                                {...item}
                                key={`lcgrid_${ind}`}
                                ref={props.popupTargetRef}
                            />
                        );
                    }

                    if (isSameTarget(item, state.pinnedTarget)) {
                        return (
                            <DataItem
                                {...commonProps}
                                {...item}
                                key={`lcgrid_${ind}`}
                                ref={props.pinnedPopupTargetRef}
                            />
                        );
                    }

                    return (
                        <DataItem
                            {...commonProps}
                            {...item}
                            key={`lcgrid_${ind}`}
                        />
                    );
                })}
            </g>
        </>
    );
};
