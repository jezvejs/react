import { CSSProperties, forwardRef } from 'react';
import classNames from 'classnames';

import { formatCoord } from '../../../BaseChart/helpers.ts';
import { useStore } from '../../../../utils/Store/StoreProvider.tsx';

import {
    LineChartDataItemComponent,
    LineChartDataItemProps,
    LineChartDataItemRef,
    LineChartState,
} from '../../types.ts';
import './LineChartDataItem.scss';

const animateAttributes = ['cy'];

export interface LineChartDataItemAttrs {
    cx: number,
    cy: number,
    r: number,
    style?: CSSProperties,
}

/**
 * LineChartDataItem component
 */
// eslint-disable-next-line react/display-name
export const LineChartDataItem: LineChartDataItemComponent = forwardRef<
    LineChartDataItemRef,
    LineChartDataItemProps
>((props, ref) => {
    const {
        cx = 0,
        cy = 0,
        r = 4,
    } = props;

    const attrs: LineChartDataItemAttrs = {
        cx,
        cy,
        r,
    };

    const store = useStore();
    if (!store) {
        return null;
    }
    const state = store.getState() as LineChartState;

    const isValid = Object.values(attrs).every((value) => value >= 0);
    if (!isValid) {
        return null;
    }

    Object.entries(attrs).forEach(([key, value]) => {
        if (
            state.autoScale
            && state.animate
            && animateAttributes.includes(key)
        ) {
            if (!attrs.style) {
                attrs.style = {};
            }

            if (state.animateNow) {
                attrs.style[key] = formatCoord(value, true);
            } else {
                attrs.style[key] = '';
                attrs[key] = formatCoord(value);
            }
        } else {
            attrs[key] = formatCoord(value);
        }
    });

    const categoryIndexClass = `linechart_category-ind-${props.categoryIndex + 1}`;
    const categoryClass = props.stacked && props.category !== null
        ? `linechart_category-${props.category}`
        : null;

    const itemProps = {
        className: classNames(
            'linechart__item',
            categoryIndexClass,
            categoryClass,
            {
                chart__item_active: !!props.active,
            },
        ),
        ...attrs,
    };

    return (
        <circle {...itemProps} ref={ref} />
    );
});
