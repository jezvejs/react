import { BaseChartState } from '../../types.ts';
import './BaseChartLegend.scss';

export interface BaseChartLegendProps {
    onlyVisibleCategoriesLegend: boolean,
    getAllCategories: () => void,
    getVisibleCategories: () => void,
}

/**
 * BaseChartLegend component
 */
export const BaseChartLegend = (props: BaseChartState) => {
    const categories = (props.onlyVisibleCategoriesLegend)
        ? props.getVisibleCategories(props)
        : props.getAllCategories(props);

    return (
        <ul className="chart__legend-list">
            {categories.map((category, ind) => (
                <li className="chart__legend-list-item" key={`chlegenditem_${ind}`}>
                    {category?.toString()}
                </li>
            ))}
        </ul>
    );
};
