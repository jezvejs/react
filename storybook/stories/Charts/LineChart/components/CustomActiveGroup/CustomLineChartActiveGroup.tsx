import classNames from 'classnames';
import { minmax, BaseChartHelpers, BaseChartState } from '@jezvejs/react';
import './CustomLineChartActiveGroup.scss';

const { formatCoord } = BaseChartHelpers;

/**
 * CustomLineChartActiveGroup component
 */
export const CustomLineChartActiveGroup: React.FC<BaseChartState> = (props) => {
    const getItemPosition = (state: BaseChartState) => {
        const { dataSets, grid } = state;
        if (dataSets.length === 0 || !grid || !state.activeTarget) {
            return 0;
        }

        const { groupIndex } = state.activeTarget;
        if (typeof groupIndex !== 'number') {
            return 0;
        }

        let value = 0;
        dataSets.forEach((dataSet) => {
            const itemValue = dataSet.data[groupIndex] ?? 0;
            value += itemValue;
        });

        const y = grid.getY(value);
        return grid.roundToPrecision(y, 1);
    };

    const state = props;

    if (!state.activeTarget) {
        return null;
    }

    const { groupIndex } = state.activeTarget;
    if (typeof groupIndex !== 'number') {
        return null;
    }

    const itemPos = getItemPosition(state);
    const groupWidth = state.getGroupOuterWidth(state);
    const padding = 10;

    // Rectangle background
    const rectProps = {
        x: formatCoord(groupIndex * groupWidth),
        y: 0,
        width: formatCoord(groupWidth),
        height: formatCoord(props.height),
        className: 'chart__active-group-back',
    };

    // Line before
    const rX = formatCoord((groupIndex + 0.5) * groupWidth);
    const y0Before = padding;
    const y1Before = formatCoord(
        minmax(
            padding,
            state.height - padding * 2,
            itemPos - padding,
        ),
    );

    const lineBeforeProps = {
        className: 'chart__active-group-line',
        d: `M${rX},${y0Before}L${rX},${y1Before}`,
    };

    // Line after
    const y0After = formatCoord(
        minmax(
            padding * 2,
            state.height - padding,
            itemPos + padding,
        ),
    );
    const y1After = formatCoord(state.height - padding);

    const lineAfterProps = {
        className: 'chart__active-group-line',
        d: `M${rX},${y0After}L${rX},${y1After}`,
    };

    return (
        <g className={classNames(
            'chart__active-group',
            props.className,
        )}>
            <rect {...rectProps} />
            <path {...lineBeforeProps} />
            <path {...lineAfterProps} />
        </g>
    );
};
