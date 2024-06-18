import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useStore } from '@jezvejs/react';
import './ChartCustomLegend.scss';

/**
 * ChartCustomLegend component
 */
export const ChartCustomLegend = (props) => {
    const { setState } = useStore();

    const categories = (props.onlyVisibleCategoriesLegend)
        ? props.getVisibleCategories(props)
        : props.getAllCategories(props);
    const activeCategory = props.activeCategory?.toString() ?? null;

    const onClick = (e) => {
        const listItem = e.target.closest('.list-item_category');
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
            {categories.map((category, ind) => (
                <li
                    className={classNames(
                        'list-item_category',
                        { 'list-item_active-category': (category?.toString() === activeCategory) },
                        `list-item_category-${category + 1}`,
                    )}
                    data-category={category}
                    key={`customlegenditem_${ind}`}
                >
                    <span>{`Category ${category + 1}`}</span>
                </li>
            ))}
        </ul>
    );
};

ChartCustomLegend.propTypes = {
    onlyVisibleCategoriesLegend: PropTypes.bool,
    activeCategory: PropTypes.string,
    getVisibleCategories: PropTypes.func,
    getAllCategories: PropTypes.func,
};
