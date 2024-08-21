import { minmax } from '../../utils/common.ts';
import { RangeSliderValue } from '../RangeSlider/types.ts';
import { RangeScrollChartChangeType, RangeScrollChartProps, RangeScrollChartState } from './types.ts';

/**
 * Returns initial state object
 * @param {RangeScrollChartProps} props
 * @returns {RangeScrollChartState}
 */
export const getInitialState = (props: RangeScrollChartProps): RangeScrollChartState => {
    const res = {
        ...props,
        start: 0,
        end: 1,
        scrollLeft: 0,
        columnWidth: 0,
        groupsGap: 0,
        scrollBarSize: 0,
        chartScrollRequested: false,
    };

    return res as RangeScrollChartState;
};

export const getSliderStart = (state: RangeScrollChartState) => (
    minmax(
        0,
        1,
        state.scrollLeft / state.scrollWidth,
    )
);

export const getSliderEnd = (state: RangeScrollChartState) => (
    minmax(
        0,
        1,
        (state.scrollLeft + state.scrollerWidth) / state.scrollWidth,
    )
);

export const getSliderChangeType = (
    value: RangeSliderValue,
    state: RangeScrollChartState,
): RangeScrollChartChangeType | null => {
    if (typeof value === 'number') {
        return 'value';
    }

    const { start, end } = value;

    if (state.start === start && state.end === end) {
        return null;
    }

    if (state.start === start && state.end !== end) {
        return 'start';
    }

    if (state.start !== start && state.end === end) {
        return 'end';
    }

    if (
        (state.start > start && state.end > end)
        || (state.start < start && state.end < end)
    ) {
        return 'scroll';
    }

    return 'resize';
};
