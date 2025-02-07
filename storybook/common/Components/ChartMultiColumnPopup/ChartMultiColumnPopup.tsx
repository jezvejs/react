import classNames from 'classnames';
import { BaseChartPopupComponent } from '@jezvejs/react';
import './ChartMultiColumnPopup.scss';

/**
 * ChartMultiColumnPopup component
 */
export const ChartMultiColumnPopup: BaseChartPopupComponent = (props) => {
    const { target } = props;

    if (!target.group) {
        return (
            <span>{target.value}</span>
        );
    }

    return (
        <ul className="custom-chart-popup__list">
            {target.group.map((item, index) => (
                <li
                    className={classNames(
                        'list-item_category',
                        `list-item_category-${(item?.categoryIndex ?? 0) + 1}`,
                    )}
                    key={`custompopupitem_${index}`}
                >
                    {(target.index === index)
                        ? <b>{item?.value}</b>
                        : <span>{item?.value}</span>
                    }
                </li>
            ))}
        </ul>
    );
};
