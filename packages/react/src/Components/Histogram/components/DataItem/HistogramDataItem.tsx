import { CSSProperties, forwardRef } from 'react';
import classNames from 'classnames';

import { useStore } from '../../../../utils/Store/StoreProvider.tsx';

import { formatCoord } from '../../../BaseChart/helpers.ts';

import {
    HistogramDataItemComponent,
    HistogramDataItemProps,
    HistogramDataItemRef,
    HistogramState,
} from '../../types.ts';
import './HistogramDataItem.scss';

const animateAttributes = ['y', 'height'];

export interface HistogramDataItemAttrs {
    x: number,
    y: number,
    width: number,
    height: number,
    style?: CSSProperties,
}

/**
 * HistogramDataItem component
 */
// eslint-disable-next-line react/display-name
export const HistogramDataItem: HistogramDataItemComponent = forwardRef<
    HistogramDataItemRef,
    HistogramDataItemProps
>((props, ref) => {
    const {
        x,
        y,
        width,
        height,
    } = props;

    const attrs: HistogramDataItemAttrs = {
        x,
        y,
        width,
        height,
    };

    const store = useStore();
    if (!store) {
        return null;
    }
    const state = store.getState() as HistogramState;

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

    const categoryIndexClass = props.stacked
        ? `histogram_category-ind-${props.categoryIndex + 1}`
        : null;

    const categoryClass = props.stacked && props.category !== null
        ? `histogram_category-${props.category}`
        : null;

    const itemProps = {
        className: classNames(
            'histogram__bar',
            `histogram_column-${props.columnIndex + 1}`,
            categoryIndexClass,
            categoryClass,
            {
                chart__item_active: !!props.active,
            },
        ),
        ...attrs,
    };

    return (
        <rect {...itemProps} ref={ref} />
    );
});
