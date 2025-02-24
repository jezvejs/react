import classNames from 'classnames';
import { px } from '../../../../utils/common.ts';
import { BaseChartState } from '../../types.ts';
import './BaseChartYAxisLabels.scss';

export interface BaseChartLabelProps {
    id: string,
    value: string,
    className?: string,
}

/**
 * BaseChartYAxisLabels component
 */
export const BaseChartYAxisLabels = (props: BaseChartState) => {
    const defaultLabelRenderer = (value: number) => (value?.toString() ?? '');
    const formatFunction = props.renderYAxisLabel ?? defaultLabelRenderer;

    const { grid, yAxisGrid } = props;
    if (!grid?.steps || !yAxisGrid) {
        return null;
    }

    const disabled = props.yAxis === 'none';
    if (disabled) {
        return null;
    }

    let curY = grid.yFirst;
    const firstY = curY;
    let lastY = curY;

    let val = grid.valueFirst;
    let step = 0;

    const items: BaseChartLabelProps[] = [];

    while (step <= grid.steps) {
        lastY = curY;

        const isZero = Math.abs(grid.toPrec(val)) === 0;
        const tVal = (isZero)
            ? 0
            : parseFloat(grid.toPrecString(val));

        const label: BaseChartLabelProps = {
            id: step.toString(),
            value: formatFunction(tVal),
            className: 'chart__text chart-y-axis-labels__label',
        };

        items.push(label);

        val -= grid.valueStep;
        curY += grid.yStep;
        step += 1;
    }

    // yAxisLabelsAlign
    const isRightAlign = props.yAxisLabelsAlign === 'right';
    const isCenterAlign = props.yAxisLabelsAlign === 'center';

    // Container props
    const containerProps = {
        className: classNames(
            'chart-y-axis-labels',
            {
                'chart-y-axis-labels_right-align': isRightAlign,
                'chart-y-axis-labels_center-align': isCenterAlign,
            },
        ),
    };

    // Content props
    const contentProps = {
        className: 'chart-y-axis-labels__content',
        style: {
            top: px(firstY),
            '--chart-grid-height': px(lastY - firstY),
        },
    };

    return (
        <div {...containerProps}>
            <div {...contentProps}>
                {items.map(({ id, value, ...item }) => (
                    <span {...item} key={id}>{value}</span>
                ))}
            </div>
        </div>
    );
};
