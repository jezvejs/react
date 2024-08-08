import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import { px } from '../../../utils/common.ts';
import { useDragnDrop } from '../../../utils/DragnDrop/DragnDropProvider.tsx';

import { getMaxPos, valueToPosition } from '../helpers.ts';

// eslint-disable-next-line react/display-name
export const RangeSliderValueSlider = forwardRef((props, ref) => {
    const {
        type = 'startSlider',
        axis = 'x',
    } = props;

    const { getState } = useDragnDrop();
    const state = getState();

    const maxPos = getMaxPos(ref?.current, props);
    const rangeValue = (type === 'endSlider') ? state.end : state.start;
    const sliderValue = state.range ? rangeValue : state.value;
    const pos = valueToPosition(sliderValue, state.min, state.max, maxPos);

    const sliderProps = {
        id: props.id,
        style: {
        },
    };

    if (axis === 'x') {
        sliderProps.style.left = px(pos);
    } else {
        sliderProps.style.top = px(pos);
    }

    if (!props.disabled && typeof props.tabIndex !== 'undefined') {
        sliderProps.tabIndex = props.tabIndex;
    }

    return (
        <div
            {...sliderProps}
            className="range-slider__slider"
            ref={ref}
        />
    );
});

RangeSliderValueSlider.propTypes = {
    id: PropTypes.string,
    axis: PropTypes.oneOf(['x', 'y']),
    type: PropTypes.oneOf(['startSlider', 'endSlider']),
    tabIndex: PropTypes.number,
    disabled: PropTypes.bool,
};
