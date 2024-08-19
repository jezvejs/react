import classNames from 'classnames';
import { formatCoord } from '../../helpers.ts';
import { BaseChartState } from '../../types.ts';
import './BaseChartActiveGroup.scss';

/**
 * BaseChartActiveGroup component
 */
export const BaseChartActiveGroup = (props: BaseChartState) => {
    if (!props.activeTarget) {
        return null;
    }

    const groupWidth = props.getGroupOuterWidth(props);
    const { groupIndex } = props.activeTarget;
    const rectProps = {
        x: formatCoord(groupIndex * groupWidth),
        y: 0,
        width: formatCoord(groupWidth),
        height: formatCoord(props.height),
        className: 'chart__active-group-back',
    };

    return (
        <g className={classNames(
            'chart__active-group',
            props.className,
        )}>
            <rect {...rectProps} />
        </g>
    );
};
