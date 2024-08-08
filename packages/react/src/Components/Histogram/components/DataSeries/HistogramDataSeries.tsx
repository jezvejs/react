import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useStore } from '../../../../utils/Store/StoreProvider.tsx';
import { isSameTarget } from '../../../BaseChart/helpers.ts';

/**
 * HistogramDataSeries component
 */
export const HistogramDataSeries = (props) => {
    const { getState, setState } = useStore();

    const { dataSets, activeTarget, grid } = props;

    useEffect(() => {
        const stackedGroups = props.getStackedGroups(props);
        const stackedCategories = props.getStackedCategories(props);
        const firstGroupIndex = props.getFirstVisibleGroupIndex(props);
        const visibleGroups = props.getVisibleGroupsCount(firstGroupIndex, props);
        const activeCategory = props.activeCategory?.toString() ?? null;

        const items = [];
        for (let i = 0; i < visibleGroups; i += 1) {
            const groupIndex = firstGroupIndex + i;
            const group = [];
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

                const itemProps = {
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

        setState((prev) => ({
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

    if (dataSets.length === 0 || !grid) {
        return null;
    }

    const { DataItem } = props.components;

    const state = getState();
    const items = state.dataSeries?.items ?? [];

    const commonProps = {
        autoScale: state.autoScale,
        animate: state.animate,
        animateNow: state.animateNow,
    };

    return (
        <g>
            {items.flat().map((item, ind) => {
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

HistogramDataSeries.propTypes = {
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
    getFirstVisibleGroupIndex: PropTypes.func,
    getVisibleGroupsCount: PropTypes.func,
    isVisibleValue: PropTypes.func,
    createItem: PropTypes.func,
    components: PropTypes.shape({
        DataItem: PropTypes.object,
    }),
};
