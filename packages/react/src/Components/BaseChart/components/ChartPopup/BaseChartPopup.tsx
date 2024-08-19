import './BaseChartPopup.scss';

export interface BaseChartPopupProps {
    target: object,
}

/**
 * BaseChartPopup component
 */
export const BaseChartPopup = (props) => {
    const { target } = props;

    const content = (!target?.group)
        ? <span>{target.item.value}</span>
        : (
            <ul className="chart__popup-list">
                {target.group.map((item, ind) => (
                    <li className="chart__popup-list-item" key={`chpopupli_${ind}`}>
                        {item.value}
                    </li>
                ))}
            </ul>
        );

    return (
        <div className="chart__popup-content">
            {content}
        </div>
    );
};
