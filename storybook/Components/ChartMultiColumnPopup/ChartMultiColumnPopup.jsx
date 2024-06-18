import PropTypes from 'prop-types';
import classNames from 'classnames';
import './ChartMultiColumnPopup.scss';

/**
 * ChartMultiColumnPopup component
 */
export const ChartMultiColumnPopup = (props) => {
    const { target } = props;

    if (!target.group) {
        return (
            <span>{target.item.value}</span>
        );
    }

    return (
        <ul className="custom-chart-popup__list">
            {target.group.map((item, index) => (
                <li
                    className={classNames(
                        'list-item_category',
                        `list-item_category-${item.categoryIndex + 1}`,
                    )}
                    key={`custompopupitem_${index}`}
                >
                    {(target.index === index)
                        ? <b>{item.value}</b>
                        : <span>{item.value}</span>
                    }
                </li>
            ))}
        </ul>
    );
};

ChartMultiColumnPopup.propTypes = {
    target: PropTypes.object,
};
