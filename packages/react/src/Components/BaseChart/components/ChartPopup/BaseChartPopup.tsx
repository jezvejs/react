import { BaseChartPopupProps } from '../../types.ts';
import './BaseChartPopup.scss';

/**
 * BaseChartPopup component
 */
export const BaseChartPopup = (props: BaseChartPopupProps) => {
    const { target } = props;

    const content = (!target?.group)
        ? <span>{target.item?.value}</span>
        : (
            <ul className="chart__popup-list">
                {target.group.map((item, ind: number) => (
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
