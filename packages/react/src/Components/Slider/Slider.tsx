import { useRef } from 'react';

import { createSlice } from '../../utils/createSlice.ts';
import { DragnDropProvider } from '../../utils/DragnDrop/DragnDropProvider.tsx';

import { SliderContainer } from './SliderContainer.tsx';

import { generateId } from './helpers.ts';
import { SliderProps } from './types.ts';
import './Slider.scss';

export * from './types.ts';

const defaultProps = {
    vertical: false,
    allowMouse: false,
    allowTouch: true,
    allowWheel: true,
    width: 400,
    height: 300,
};

export const Slider = (p: SliderProps) => {
    const defaultId = useRef(generateId('slider'));
    const defProps = {
        ...defaultProps,
        id: defaultId.current,
    };

    const props = {
        ...defProps,
        ...p,
    };

    const initialState = {
        ...props,
        position: 0,
        slideIndex: 0,
        animate: false,
        waitingForAnimation: false,
        items: [...(props.items ?? [])],
    };

    const slice = createSlice({
    });

    return (
        <DragnDropProvider reducer={slice.reducer} initialState={initialState}>
            <SliderContainer {...props} />
        </DragnDropProvider>
    );
};
