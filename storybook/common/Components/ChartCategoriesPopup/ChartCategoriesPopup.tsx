import { HistogramItemProps, HistogramPopupComponent } from '@jezvejs/react';
import './ChartCategoriesPopup.scss';

/**
 * ChartCategoriesPopup component
 */
export const ChartCategoriesPopup: HistogramPopupComponent = (props) => {
    const { target } = props;

    if (!target?.item || Array.isArray(target.item)) {
        return null;
    }

    const targetItem = target.item as HistogramItemProps;

    if (!target.group) {
        return (
            <span>{targetItem.value}</span>
        );
    }

    const targetItems = target.group.filter((item) => (
        !!item
        && item.columnIndex === targetItem.columnIndex
        && item.value !== 0
    ));

    if (targetItems.length === 0) {
        return null;
    }

    return (
        <div className="categories-chart-popup">
            <b>{targetItem.groupName}</b>
            <div>{target.series}</div>
            <ul className="categories-chart-popup__list">
                {targetItems.map((item, index) => (
                    <li
                        className={`list-item_category-${(item?.categoryIndex ?? 0) + 1}`}
                        key={`catpopupitem_${index}`}
                    >
                        {(target.index === index)
                            ? <b>{`Long data category name ${index + 1}: ${item?.value}`}</b>
                            : <span>{`Long data category name ${index + 1}: ${item?.value}`}</span>
                        }
                    </li>
                ))}
            </ul>
        </div>
    );
};
