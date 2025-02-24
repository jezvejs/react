import { CSSProperties, forwardRef } from 'react';

import { useDragnDrop } from '../../../utils/DragnDrop/DragnDropProvider.tsx';
import { px } from '../../../utils/common.ts';

import { valueToPosition } from '../helpers.ts';
import { RangeSliderAfterAreaProps, RangeSliderState } from '../types.ts';

type RangeSliderAfterAreaRef = HTMLDivElement | null;

export const RangeSliderAfterArea = forwardRef<
    RangeSliderAfterAreaRef,
    RangeSliderAfterAreaProps
>((props, ref) => {
    const getEndValue = (state: RangeSliderState) => (
        (props.range) ? state.end : state.value
    );

    const { getState } = useDragnDrop<RangeSliderState>();
    if (!props.afterArea) {
        return null;
    }

    const state = getState();

    const value = getEndValue(state);
    const endPos = valueToPosition(value, state.min, state.max, state.maxPos);
    const size = Math.abs(state.maxPos - endPos);

    const style: CSSProperties = {
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

RangeSliderAfterArea.displayName = 'RangeSliderAfterArea';
