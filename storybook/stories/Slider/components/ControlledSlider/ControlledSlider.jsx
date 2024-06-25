import { Slider } from '@jezvejs/react';
import { useState } from 'react';

// Common components
import { ActionButton } from '../../../../Components/ActionButton/ActionButton.jsx';
import { SectionControls } from '../../../../Components/SectionControls/SectionControls.jsx';

export const ControlledSlider = (args) => {
    const [state, setState] = useState({
        animate: false,
        slideIndex: 0,
    });

    const slideToStart = () => {
        setState((prev) => ({
            ...prev,
            animate: true,
            slideIndex: 0,
        }));
    };

    const slideToPrev = () => {
        setState((prev) => ({
            ...prev,
            animate: true,
            slideIndex: prev.slideIndex - 1,
        }));
    };

    const slideToNext = () => {
        setState((prev) => ({
            ...prev,
            animate: true,
            slideIndex: prev.slideIndex + 1,
        }));
    };

    const switchToStart = () => {
        setState((prev) => ({
            ...prev,
            animate: false,
            slideIndex: 0,
        }));
    };

    const sliderProps = {
        ...args,
        slideIndex: state.slideIndex,
        animate: state.animate,
        onChanged: (slideIndex) => {
            setState((prev) => ({
                ...prev,
                animate: false,
                slideIndex,
            }));
        },
    };

    return (
        <div className="range-slider-container">
            <Slider {...sliderProps} />

            <SectionControls>
                <ActionButton
                    title="Slide to start"
                    className="slide-to-start-btn"
                    onClick={slideToStart}
                />
                <ActionButton
                    title="Prev"
                    className="slide-to-prev-btn"
                    onClick={slideToPrev}
                />
                <ActionButton
                    title="Next"
                    className="slide-to-next-btn"
                    onClick={slideToNext}
                />
                <ActionButton
                    title="Switch to start"
                    className="switch-to-start-btn"
                    onClick={switchToStart}
                />
            </SectionControls>
        </div>
    );
};
