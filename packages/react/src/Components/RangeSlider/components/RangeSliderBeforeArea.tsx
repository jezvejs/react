import { CSSProperties, forwardRef } from 'react';

import { px } from '../../../utils/common.ts';
import { useDragnDrop } from '../../../utils/DragnDrop/DragnDropProvider.tsx';

import { valueToPosition } from '../helpers.ts';
import { RangeSliderBeforeAreaProps, RangeSliderState } from '../types.ts';

type RangeSliderBeforeAreaRef = HTMLDivElement | null;

// eslint-disable-next-line react/display-name
export const RangeSliderBeforeArea = forwardRef<
    RangeSliderBeforeAreaRef,
    RangeSliderBeforeAreaProps
>((props, ref) => {
    const getStartValue = (state: RangeSliderState) => (
        (props.range) ? state.start : state.value
    );

    const { getState } = useDragnDrop<RangeSliderState>();
    if (!props.beforeArea) {
        return null;
    }

    const state = getState();
    const value = getStartValue(state);
    const size = valueToPosition(value, state.min, state.max, state.maxPos);

    const style: CSSProperties = {
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
