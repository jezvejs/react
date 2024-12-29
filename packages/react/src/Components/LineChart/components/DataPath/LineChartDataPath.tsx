import { forwardRef } from 'react';
import classNames from 'classnames';
import { LineChartDataPathComponent, LineChartDataPathProps, LineChartDataPathRef } from '../../types.ts';
import './LineChartDataPath.scss';

/**
 * LineChartDataPath component
 */
export const LineChartDataPath: LineChartDataPathComponent = forwardRef<
    LineChartDataPathRef,
    LineChartDataPathProps
>((props, ref) => {
    const {
        shape = null,
    } = props;
    if (!shape) {
        return null;
    }

    const categoryIndexClass = `linechart_category-ind-${props.categoryIndex + 1}`;
    const categoryClass = props.stacked && props.category !== null
        ? `linechart_category-${props.category}`
        : null;

    const itemProps = {
        className: classNames(
            'linechart__path',
            categoryIndexClass,
            categoryClass,
            {
                chart__item_active: !!props.active,
            },
        ),
        d: shape,
    };

    return (
        <path {...itemProps} ref={ref} />
    );
});

LineChartDataPath.displayName = 'LineChartDataPath';
