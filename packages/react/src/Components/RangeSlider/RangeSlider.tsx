import { forwardRef } from 'react';

import { DragnDropProvider } from '../../utils/DragnDrop/DragnDropProvider.tsx';
import { createSlice } from '../../utils/createSlice.ts';

import { getStepPrecision } from './helpers.ts';
import { RangeSliderContainer } from './RangeSliderContainer.tsx';

import './RangeSlider.scss';

// eslint-disable-next-line react/display-name
export const RangeSlider = forwardRef((props, ref) => {
    const {
        tabIndex = 0,
        axis = 'x',
        min = 0,
        max = 100,
        step = 1,
        range = false,
        beforeArea = false,
        afterArea = false,
        scrollOnClickOutsideRange = false,
    } = props;

    const commonProps = {
        ...props,
        tabIndex,
        axis,
        min,
        max,
        step,
        range,
        beforeArea,
        afterArea,
        scrollOnClickOutsideRange,
    };

    const commonSliderProps = {
        top: 0,
        left: 0,
        shiftX: 0,
        shiftY: 0,
    };

    const initialState = {
        ...commonProps,
        startSlider: {
            ...commonSliderProps,
        },
        endSlider: {
            ...commonSliderProps,
        },
        selectedArea: {
            ...commonSliderProps,
        },
        dragging: false,
        offset: {},
        rect: {},
        maxPos: 0,
    };

    if (range) {
        const values = [min, max];
        initialState.min = Math.min(...values);
        initialState.max = Math.max(...values);
        initialState.start = initialState.start ?? min;
        initialState.end = initialState.end ?? max;
    } else {
        initialState.value = initialState.value ?? min;
    }

    initialState.precision = getStepPrecision(step);

    const slice = createSlice({
    });

    return (
        <DragnDropProvider reducer={slice.reducer} initialState={initialState}>
            <RangeSliderContainer {...commonProps} ref={ref} />
        </DragnDropProvider >
    );
});

RangeSlider.propTypes = {
    ...RangeSliderContainer.propTypes,
};
