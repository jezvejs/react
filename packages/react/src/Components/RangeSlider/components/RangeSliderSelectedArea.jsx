import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { useDragnDrop } from '../../../utils/DragnDrop/DragnDropProvider.jsx';
import { px } from '../../../utils/common.js';
import { valueToPosition } from '../helpers.js';

// eslint-disable-next-line react/display-name
export const RangeSliderSelectedArea = forwardRef((props, ref) => {
    const { getState } = useDragnDrop();

    if (!props.range) {
        return null;
    }

    const state = getState();
    const startPos = valueToPosition(state.start, state.min, state.max, state.maxPos);
    const endPos = valueToPosition(state.end, state.min, state.max, state.maxPos);
    const size = Math.abs(endPos - startPos);

    const style = {
    };

    if (props.axis === 'x') {
        style.left = px(startPos);
        style.width = px(size);
    } else {
        style.top = px(startPos);
        style.height = px(size);
    }

    return (
        <div
            className="range-slider__selected-area"
            style={style}
            ref={ref}
        />
    );
});

RangeSliderSelectedArea.propTypes = {
    id: PropTypes.string,
    axis: PropTypes.oneOf(['x', 'y']),
    range: PropTypes.bool,
};
