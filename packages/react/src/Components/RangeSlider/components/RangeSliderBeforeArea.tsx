import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import { px } from '../../../utils/common.ts';
import { useDragnDrop } from '../../../utils/DragnDrop/DragnDropProvider.tsx';

import { valueToPosition } from '../helpers.ts';

// eslint-disable-next-line react/display-name
export const RangeSliderBeforeArea = forwardRef((props, ref) => {
    const getStartValue = (state) => (
        (props.range) ? state.start : state.value
    );

    const { getState } = useDragnDrop();
    if (!props.beforeArea) {
        return null;
    }

    const state = getState();
    const value = getStartValue(state);
    const size = valueToPosition(value, state.min, state.max, state.maxPos);

    const style = {
    };

    if (props.axis === 'x') {
        style.width = px(size);
    } else {
        style.height = px(size);
    }

    return (
        <div className="range-slider__before-area" style={style} ref={ref} />
    );
});

RangeSliderBeforeArea.propTypes = {
    axis: PropTypes.oneOf(['x', 'y']),
    range: PropTypes.bool,
    beforeArea: PropTypes.bool,
};
