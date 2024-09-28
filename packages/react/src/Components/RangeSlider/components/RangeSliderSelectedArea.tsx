import { CSSProperties, forwardRef } from 'react';
import { useDragnDrop } from '../../../utils/DragnDrop/DragnDropProvider.tsx';
import { px } from '../../../utils/common.ts';
import { valueToPosition } from '../helpers.ts';
import { RangeSliderSelectedAreaProps, RangeSliderState } from '../types.ts';

type RangeSliderSelectedAreaRef = HTMLDivElement | null;

// eslint-disable-next-line react/display-name
export const RangeSliderSelectedArea = forwardRef<
    RangeSliderSelectedAreaRef,
    RangeSliderSelectedAreaProps
>((props, ref) => {
    const { getState } = useDragnDrop<RangeSliderState>();
    if (!props.range) {
        return null;
    }

    const state = getState();

    const startPos = valueToPosition(state.start, state.min, state.max, state.maxPos);
    const endPos = valueToPosition(state.end, state.min, state.max, state.maxPos);
    const size = Math.abs(endPos - startPos);

    const style: CSSProperties = {
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
