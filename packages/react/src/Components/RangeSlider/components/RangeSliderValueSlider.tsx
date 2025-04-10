import {
    CSSProperties,
    forwardRef,
    useImperativeHandle,
    useRef,
} from 'react';

import { px } from '../../../utils/common.ts';
import { useDragnDrop } from '../../../utils/DragnDrop/DragnDropProvider.tsx';

import { getMaxPos, valueToPosition } from '../helpers.ts';
import { RangeSliderState, RangeSliderValueSliderProps } from '../types.ts';

interface SliderProps {
    id: string,
    tabIndex?: number,
    style: CSSProperties,
}

type RangeSliderValueSliderRef = HTMLDivElement | null;

export const RangeSliderValueSlider = forwardRef<
    RangeSliderValueSliderRef,
    RangeSliderValueSliderProps
>((props, ref) => {
    const {
        type = 'startSlider',
        axis = 'x',
    } = props;

    const innerRef = useRef<HTMLDivElement>(null);
    useImperativeHandle<
        RangeSliderValueSliderRef,
        RangeSliderValueSliderRef
    >(ref, () => innerRef?.current);

    const { getState } = useDragnDrop<RangeSliderState>();
    const state = getState();

    const maxPos = getMaxPos(innerRef?.current, axis);
    const rangeValue = (type === 'endSlider') ? state.end : state.start;
    const sliderValue = state.range ? rangeValue : state.value;
    const pos = valueToPosition(sliderValue, state.min, state.max, maxPos);

    const sliderProps: SliderProps = {
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
            ref={innerRef}
        />
    );
});

RangeSliderValueSlider.displayName = 'RangeSliderValueSlider';
