import PropTypes from 'prop-types';
import './BaseChartLegend.scss';

/**
 * BaseChartLegend component
 */
export const BaseChartLegend = (props) => {
    const categories = (props.onlyVisibleCategoriesLegend)
        ? props.getVisibleCategories(props)
        : props.getAllCategories(props);

    return (
        <ul className="chart__legend-list">
            {categories.map((category, ind) => (
                <li className="chart__legend-list-item" key={`chlegenditem_${ind}`}>
                    {category.toString()}
                </li>
            ))}
        </ul>
    );
};

BaseChartLegend.propTypes = {
    onlyVisibleCategoriesLegend: PropTypes.bool,
    getAllCategories: PropTypes.func,
    getVisibleCategories: PropTypes.func,
};
