import classNames from 'classnames';
import { BaseChartState, useStore } from '@jezvejs/react';
import './ChartCustomLegend.scss';

/**
 * ChartCustomLegend component
 */
export const ChartCustomLegend: React.FC<BaseChartState> = (props) => {
    const { setState } = useStore();

    const categories = (props.onlyVisibleCategoriesLegend)
        ? props.getVisibleCategories(props)
        : props.getAllCategories(props);
    const activeCategory = props.activeCategory?.toString() ?? null;

    const onClick = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.target as HTMLElement;
        const listItem = target.closest('.list-item_category') as HTMLElement;
        if (!listItem) {
            return;
        }

        const { category } = listItem.dataset;
        const isActive = (
            !!category
            && category.toString() === activeCategory
        );

        setState((prev) => ({
            ...prev,
            activeCategory: (isActive) ? null : category,
        }));
    };

    return (
        <ul className="chart__legend-list" onClick={onClick}>
            {categories.map((category, ind) => {
                const categoryNum = parseInt(category?.toString() ?? '0', 10);

                return (
                    <li
                        className={classNames(
                            'list-item_category',
                            { 'list-item_active-category': (category?.toString() === activeCategory) },
                            `list-item_category-${categoryNum}`,
                        )}
                        data-category={category}
                        key={`customlegenditem_${ind}`}
                    >
                        <span>{`Category ${categoryNum}`}</span>
                    </li>
                );
            })}
        </ul>
    );
};
