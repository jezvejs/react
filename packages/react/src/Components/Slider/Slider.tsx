import { createSlice } from '../../utils/createSlice.ts';
import { DragnDropProvider } from '../../utils/DragnDrop/DragnDropProvider.tsx';

import { SliderContainer } from './SliderContainer.tsx';

import { SliderProps } from './types.ts';
import './Slider.scss';

export const Slider = (props: SliderProps) => {
    const {
        vertical = false,
        allowMouse = false,
        allowTouch = true,
        allowWheel = true,
        width = 400,
        height = 300,
    } = props;

    const initialState = {
        vertical,
        allowMouse,
        allowTouch,
        allowWheel,
        width,
        height,
        position: 0,
        slideIndex: 0,
        animate: false,
        waitingForAnimation: false,
        items: [...props.items],
    };

    const slice = createSlice({
    });

    return (
        <DragnDropProvider reducer={slice.reducer} initialState={initialState}>
            <SliderContainer {...props} />
        </DragnDropProvider>
    );
};
