import { forwardRef } from 'react';

import { DragnDropProvider } from '../../utils/DragnDrop/DragnDropProvider.tsx';
import { createSlice } from '../../utils/createSlice.ts';

import { getStepPrecision } from './helpers.ts';
import { RangeSliderContainer } from './RangeSliderContainer.tsx';
import { RangeSliderProps, RangeSliderState } from './types.ts';

import './RangeSlider.scss';

type RangeSliderRef = HTMLDivElement | null;

export type * from './types.ts';

export const RangeSlider = forwardRef<RangeSliderRef, RangeSliderProps>((props, ref) => {
    const {
        tabIndex = 0,
        axis = 'x',
        value = 0,
        start = 0,
        end = 100,
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
        value,
        start,
        end,
        min,
        max,
        step,
        range,
        beforeArea,
        afterArea,
        scrollOnClickOutsideRange,
    };

    const defaultOffset = {
        top: 0,
        left: 0,
    };
    const commonSliderProps = {
        ...defaultOffset,
        original: { ...defaultOffset },
        shift: { x: 0, y: 0 },
        border: { ...defaultOffset },
        offset: { ...defaultOffset },
    };

    const initialState: RangeSliderState = {
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
        precision: getStepPrecision(step),
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

    const slice = createSlice({
    });

    return (
        <DragnDropProvider reducer={slice.reducer} initialState={initialState}>
            <RangeSliderContainer {...commonProps} ref={ref} />
        </DragnDropProvider >
    );

    /*
    return (
        <DragnDropProvider<RangeSliderState> initialState={initialState}>
            <RangeSliderContainer {...commonProps} ref={ref} />
        </DragnDropProvider >
    );
    */
});

RangeSlider.displayName = 'RangeSlider';
