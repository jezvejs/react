import PropTypes from 'prop-types';
import './ChartCategoriesPopup.scss';

/**
 * ChartCategoriesPopup component
 */
export const ChartCategoriesPopup = (props) => {
    const { target } = props;

    if (!target.group) {
        return (
            <span>{target.item.value}</span>
        );
    }

    const targetItems = target.group.filter((item) => (
        item.columnIndex === target.item.columnIndex
        && item.value !== 0
    ));

    if (targetItems.length === 0) {
        return null;
    }

    return (
        <div className="categories-chart-popup">
            <b>{target.item.groupName}</b>
            <div>{target.series}</div>
            <ul className="categories-chart-popup__list">
                {targetItems.map((item, index) => (
                    <li
                        className={`list-item_category-${item.categoryIndex + 1}`}
                        key={`catpopupitem_${index}`}
                    >
                        {(target.index === index)
                            ? <b>{`Long data category name ${index + 1}: ${item.value}`}</b>
                            : <span>{`Long data category name ${index + 1}: ${item.value}`}</span>
                        }
                    </li>
                ))}
            </ul>
        </div>
    );
};

ChartCategoriesPopup.propTypes = {
    target: PropTypes.object,
};
