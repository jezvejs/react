import PropTypes from 'prop-types';

import { createSlice } from '../../utils/createSlice.ts';
import { DragnDropProvider } from '../../utils/DragnDrop/DragnDropProvider.tsx';

import { SliderContainer } from './SliderContainer.tsx';

import './Slider.scss';

export const Slider = (props) => {
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

Slider.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    slideIndex: PropTypes.number,
    onChanged: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number,
    animate: PropTypes.bool,
    vertical: PropTypes.bool,
    items: PropTypes.array,
    allowMouse: PropTypes.bool,
    allowTouch: PropTypes.bool,
    allowWheel: PropTypes.bool,
};
