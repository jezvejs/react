import { RangeSliderAxisType } from './types.ts';

export const defaultProps = {
    tabIndex: 0,
    axis: 'x' as RangeSliderAxisType,
    value: 0,
    start: 0,
    end: 100,
    min: 0,
    max: 100,
    step: 1,
    range: false,
    beforeArea: false,
    afterArea: false,
    scrollOnClickOutsideRange: false,
};
