import { RangeSlider } from '../../../RangeSlider/RangeSlider.tsx';
import { RangeSliderProps } from '../../../RangeSlider/types.ts';

import './RangeScrollChartSlider.scss';

/**
 * Range scroll chart: navigation range slider component
 * @param {RangeSliderProps} props
 */
export const RangeScrollChartSlider = (props: RangeSliderProps) => {
    const rangeSliderProps: RangeSliderProps = {
        ...props,
        range: true,
        className: 'range-scroll-chart__range-slider',
        min: 0,
        max: 1,
        step: null,
        beforeArea: true,
        afterArea: true,
    };

    return <RangeSlider {...rangeSliderProps} />;
};
