import { CSSProperties, forwardRef } from 'react';
import classNames from 'classnames';

import { IndexedSVGAttributes, StyleDeclaration } from '../../../../utils/types.ts';
import { useStore } from '../../../../utils/Store/StoreProvider.tsx';

import { formatCoord } from '../../../BaseChart/helpers.ts';

import {
    LineChartDataItemComponent,
    LineChartDataItemProps,
    LineChartDataItemRef,
    LineChartState,
} from '../../types.ts';
import './LineChartDataItem.scss';

const animateAttributes = ['cy'];

type SVGCircleAttrs = IndexedSVGAttributes<SVGCircleElement>;

export interface LineChartDataItemAttrs {
    cx: number,
    cy: number,
    r: number,
    style?: CSSProperties,
}

/**
 * LineChartDataItem component
 */
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

    const { getState } = useStore<LineChartState>();
    const state = getState();

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
                (attrs.style as StyleDeclaration)[key] = formatCoord(value, true);
            } else {
                (attrs.style as StyleDeclaration)[key] = '';
                (attrs as SVGCircleAttrs)[key] = formatCoord(value);
            }
        } else {
            (attrs as SVGCircleAttrs)[key] = formatCoord(value);
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

LineChartDataItem.displayName = 'LineChartDataItem';
