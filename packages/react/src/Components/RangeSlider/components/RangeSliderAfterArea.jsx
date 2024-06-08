import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import { useDragnDrop } from '../../../utils/DragnDrop/DragnDropProvider.jsx';
import { px } from '../../../utils/common.js';
import { valueToPosition } from '../helpers.js';

// eslint-disable-next-line react/display-name
export const RangeSliderAfterArea = forwardRef((props, ref) => {
    const getEndValue = (state) => (
        (props.range) ? state.end : state.value
    );

    const { getState } = useDragnDrop();

    if (!props.afterArea) {
        return null;
    }

    const state = getState();
    const value = getEndValue(state);

    const endPos = valueToPosition(value, state.min, state.max, state.maxPos);
    const size = Math.abs(state.maxPos - endPos);

    const style = {
    };

    if (props.axis === 'x') {
        style.width = px(size);
    } else {
        style.height = px(size);
    }

    return (
        <div className="range-slider__after-area" style={style} ref={ref} />
    );
});

RangeSliderAfterArea.propTypes = {
    axis: PropTypes.oneOf(['x', 'y']),
    range: PropTypes.bool,
    afterArea: PropTypes.bool,
};
