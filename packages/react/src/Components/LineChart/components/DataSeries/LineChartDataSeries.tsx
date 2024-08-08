import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { isSameTarget } from '../../../BaseChart/helpers.ts';
import { useStore } from '../../../../utils/Store/StoreProvider.tsx';

import { getLinePath } from '../../helpers.ts';

/**
 * LineChartDataSeries component
 */
export const LineChartDataSeries = (props) => {
    const { getState, setState } = useStore();
    const { dataSets, activeTarget, grid } = getState();

    const storeState = getState();

    useEffect(() => {
        const firstGroupIndex = props.getFirstVisibleGroupIndex(storeState);
        const visibleGroups = props.getVisibleGroupsCount(firstGroupIndex, storeState);
        const activeCategory = storeState.activeCategory?.toString() ?? null;

        const items = [];
        for (let i = 0; i < visibleGroups; i += 1) {
            const groupIndex = firstGroupIndex + i;
            const group = [];
            let posValueOffset = 0;
            let negValueOffset = 0;

            dataSets.forEach((dataSet, categoryIndex) => {
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

                const itemProps = {
                    value,
                    groupIndex,
                    category,
                    categoryIndex,
                    active,
                    valueOffset,
                };

                const item = props.createItem(itemProps, storeState);

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
        const paths = [];
        const flatItems = items.flat();
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

        setState((prev) => ({
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

    if (dataSets.length === 0 || !grid) {
        return null;
    }

    const { DataItem, DataPath } = props.components;

    const state = getState();
    const items = state.dataSeries?.items ?? [];
    const paths = state.dataSeries?.paths ?? [];

    const commonProps = {
        autoScale: state.autoScale,
        animate: state.animate,
        animateNow: state.animateNow,
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
                {items.flat().map((item, ind) => {
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

LineChartDataSeries.propTypes = {
    grid: PropTypes.object,
    dataSets: PropTypes.array,
    items: PropTypes.array,
    data: PropTypes.object,
    autoScale: PropTypes.bool,
    animate: PropTypes.bool,
    animateNow: PropTypes.bool,
    scrollLeft: PropTypes.number,
    groupsGap: PropTypes.number,
    groupsCount: PropTypes.number,
    columnWidth: PropTypes.number,
    columnsInGroup: PropTypes.number,
    chartContentWidth: PropTypes.number,
    height: PropTypes.number,
    chartWidth: PropTypes.number,
    scrollerWidth: PropTypes.number,
    activeTarget: PropTypes.object,
    popupTarget: PropTypes.object,
    pinnedTarget: PropTypes.object,
    popupTargetRef: PropTypes.func,
    pinnedPopupTargetRef: PropTypes.func,
    activeCategory: PropTypes.string,
    getStackedGroups: PropTypes.func,
    getStackedCategories: PropTypes.func,
    getCategoriesCount: PropTypes.func,
    getFirstVisibleGroupIndex: PropTypes.func,
    getVisibleGroupsCount: PropTypes.func,
    isVisibleValue: PropTypes.func,
    createItem: PropTypes.func,
    components: PropTypes.shape({
        DataItem: PropTypes.object,
        DataPath: PropTypes.object,
    }),
};
