import { afterTransition } from '@jezvejs/dom';
import {
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { minmax, px } from '../../utils/common.js';
import { useSlidable } from '../../hooks/useSlidable/useSlidable.jsx';

import { Slide } from './components/Slide/Slide.jsx';
import { useDragnDrop } from '../../utils/DragnDrop/DragnDropProvider.jsx';

const TRANSITION_END_TIMEOUT = 500;
const SWIPE_THRESHOLD = 0.1;

export const SliderContainer = (props) => {
    const {
        vertical = false,
        allowMouse = false,
        allowTouch = true,
        allowWheel = true,
        onChanged = null,
    } = props;

    const { getState, setState } = useDragnDrop();

    const elemRef = useRef(null);
    const contentRef = useRef(null);

    const animationFrameRef = useRef(null);
    const removeTransitionHandlerRef = useRef(null);

    const clientSize = () => {
        const state = getState();
        return state.vertical ? state.height : state.width;
    };

    const notifyChanged = () => {
        onChanged?.(getState().slideIndex);
    };

    const calculatePosition = (num) => {
        const state = getState();

        if (num < 0 || num > state.items.length - 1) {
            return false;
        }

        return clientSize() * num * -1;
    };

    const slideIndexFromPosition = (position) => (
        Math.round(-position / clientSize())
    );

    const onAnimationDone = () => {
        removeTransitionHandlerRef.current = null;

        setState((prev) => ({
            ...prev,
            animate: false,
            waitingForAnimation: false,
        }));

        notifyChanged();
    };

    const cancelAnimation = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = 0;
        }

        if (removeTransitionHandlerRef.current) {
            removeTransitionHandlerRef.current();
            removeTransitionHandlerRef.current = null;
        }
    };

    const slideTo = (num) => {
        const position = calculatePosition(num);
        if (position === false) {
            return;
        }

        const slideIndex = slideIndexFromPosition(position);

        cancelAnimation();

        animationFrameRef.current = requestAnimationFrame(() => {
            animationFrameRef.current = 0;

            setState((prev) => ({
                ...prev,
                animate: true,
                waitingForAnimation: true,
                position,
                slideIndex,
            }));

            removeTransitionHandlerRef.current = afterTransition(
                contentRef.current,
                {
                    duration: TRANSITION_END_TIMEOUT,
                    target: contentRef.current,
                },
                () => onAnimationDone(),
            );
        });
    };

    const switchTo = (num) => {
        const position = calculatePosition(num);
        if (position === false) {
            return;
        }

        const slideIndex = slideIndexFromPosition(position);

        cancelAnimation();

        setState((prev) => ({
            ...prev,
            animate: false,
            waitingForAnimation: false,
            position,
            slideIndex,
        }));

        notifyChanged(slideIndex);
    };

    const slideToPrev = () => {
        slideTo(getState().slideIndex - 1);
    };

    const slideToNext = () => {
        slideTo(getState().slideIndex + 1);
    };

    const { dragZoneRef, dropTargetRef } = useSlidable({
        vertical,
        allowMouse,
        allowTouch,
        allowWheel,

        isReady: () => !getState().waitingForAnimation,

        onWheel(e) {
            if (!allowWheel || getState().waitingForAnimation) {
                return;
            }

            if (e.wheelDelta > 0) {
                slideToPrev();
            } else {
                slideToNext();
            }
        },

        onDragEnd(position, distance, velocity) {
            const passThreshold = Math.abs(velocity) > SWIPE_THRESHOLD;
            let slideNum = -position / clientSize();
            if (passThreshold) {
                slideNum = (distance > 0) ? Math.ceil(slideNum) : Math.floor(slideNum);
            } else {
                slideNum = Math.round(slideNum);
            }

            const num = minmax(0, getState().items.length - 1, slideNum);
            slideTo(num);
        },

        onDragCancel() {
            const state = getState();
            slideTo(state.slideIndex);
        },
    });

    useImperativeHandle(dragZoneRef, () => contentRef.current);
    useImperativeHandle(dropTargetRef, () => elemRef.current);

    useEffect(() => {
        const state = getState();

        if (
            props.slideIndex === state.slideIndex
            || state.waitingForAnimation
        ) {
            return;
        }

        const num = minmax(0, state.items.length - 1, props.slideIndex);
        if (props.animate) {
            slideTo(num);
        } else {
            switchTo(num);
        }
    }, [props.slideIndex, props.animate]);

    const state = getState();

    // Slider props
    const sliderProps = {
        className: classNames(
            'slider',
            {
                slider_vertical: state.vertical,
            },
        ),
        style: {
            width: px(state.width),
            height: px(state.height),
        },
    };

    // Sliding content props
    const contentProps = {
        className: classNames(
            'slider__content',
            {
                animate: state.animate,
            },
        ),
        style: {},
    };

    if (state.vertical) {
        contentProps.style.top = px(state.position);
    } else {
        contentProps.style.left = px(state.position);
    }

    // Slide props
    const commonSlideProps = {
        width: state.width,
        height: state.height,
    };

    return (
        <div {...sliderProps} ref={elemRef}>
            <div {...contentProps} ref={contentRef}>
                {state.items.map((item) => (
                    <Slide
                        key={item.id}
                        {...item}
                        {...commonSlideProps}
                    />
                ))}
            </div>
        </div>
    );
};

SliderContainer.propTypes = {
    id: PropTypes.string,
    slideIndex: PropTypes.number,
    onChanged: PropTypes.func,
    animate: PropTypes.bool,
    vertical: PropTypes.bool,
    allowMouse: PropTypes.bool,
    allowTouch: PropTypes.bool,
    allowWheel: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    items: PropTypes.array,
};
