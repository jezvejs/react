import { afterTransition } from '@jezvejs/dom';
import {
    HTMLAttributes,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';
import classNames from 'classnames';

import { minmax, px } from '../../utils/common.ts';
import { useSlidable } from '../../hooks/useSlidable/useSlidable.tsx';

import { Slide } from './components/Slide/Slide.tsx';
import { useDragnDrop } from '../../utils/DragnDrop/DragnDropProvider.tsx';
import { SliderContainerProps, SliderState } from './types.ts';

const TRANSITION_END_TIMEOUT = 500;
const SWIPE_THRESHOLD = 0.1;

interface Callable {
    (): void,
}

type DragZoneRef = Element | null;
type DropTargetRef = Element | null;

export const SliderContainer = (props: SliderContainerProps) => {
    const {
        id,
        vertical = false,
        allowMouse = false,
        allowTouch = true,
        allowWheel = true,
        updatePosition,
        onChanged = null,
    } = props;

    const { getState, setState } = useDragnDrop<SliderState>();

    const elemRef = useRef(null);
    const contentRef = useRef(null);

    const animationFrameRef = useRef(0);
    const clearTransitionRef = useRef<Callable | null>(null);

    const clientSize = () => {
        const state = getState();
        return ((state.vertical) ? state.height : state.width) ?? 0;
    };

    const notifyChanged = () => {
        onChanged?.(getState().slideIndex!);
    };

    const calculatePosition = (num: number): number | false => {
        const state = getState();

        if (num < 0 || num > (state.items ?? []).length - 1) {
            return false;
        }

        return clientSize() * num * -1;
    };

    const slideIndexFromPosition = (position: number): number => (
        Math.round(-position / clientSize())
    );

    const onAnimationDone = () => {
        clearTransitionRef.current = null;

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

        if (clearTransitionRef.current) {
            clearTransitionRef.current?.();
            clearTransitionRef.current = null;
        }
    };

    const slideTo = (num: number) => {
        const position = calculatePosition(num);
        if (position === false) {
            return;
        }

        const slideIndex = slideIndexFromPosition(position);

        cancelAnimation();

        animationFrameRef.current = requestAnimationFrame(() => {
            animationFrameRef.current = 0;

            if (!contentRef.current) {
                return;
            }

            setState((prev: SliderState) => ({
                ...prev,
                animate: true,
                waitingForAnimation: true,
                position,
                slideIndex,
            }));

            clearTransitionRef.current = afterTransition(
                contentRef.current,
                {
                    duration: TRANSITION_END_TIMEOUT,
                    target: contentRef.current,
                },
                () => onAnimationDone(),
            );
        });
    };

    const switchTo = (num: number) => {
        const position = calculatePosition(num);
        if (position === false) {
            return;
        }

        const slideIndex = slideIndexFromPosition(position);

        cancelAnimation();

        setState((prev: SliderState) => ({
            ...prev,
            animate: false,
            waitingForAnimation: false,
            position,
            slideIndex,
        }));

        notifyChanged();
    };

    const slideToPrev = () => {
        slideTo(getState().slideIndex! - 1);
    };

    const slideToNext = () => {
        slideTo(getState().slideIndex! + 1);
    };

    const { dragZoneRef, dropTargetRef } = useSlidable({
        id: id!,
        vertical,
        allowMouse,
        allowTouch,
        allowWheel,

        updatePosition: updatePosition!,

        isReady: () => !getState().waitingForAnimation,

        onWheel: (ev: Event) => {
            const e = ev as WheelEvent;
            if (!allowWheel || getState().waitingForAnimation) {
                return;
            }

            const delta = (e.deltaY === 0) ? e.deltaX : e.deltaY;
            if (delta > 0) {
                slideToPrev();
            } else {
                slideToNext();
            }
        },

        onSlideEnd(position, distance, velocity) {
            const passThreshold = Math.abs(velocity) > SWIPE_THRESHOLD;
            let slideNum = -position / clientSize();
            if (passThreshold) {
                slideNum = (distance > 0) ? Math.ceil(slideNum) : Math.floor(slideNum);
            } else {
                slideNum = Math.round(slideNum);
            }

            const num = minmax(0, (getState().items ?? []).length - 1, slideNum);
            slideTo(num);
        },

        onDragCancel() {
            const state = getState();
            slideTo(state.slideIndex ?? 0);
        },
    });

    useImperativeHandle<DragZoneRef, DragZoneRef>(dragZoneRef, () => contentRef.current);
    useImperativeHandle<DropTargetRef, DropTargetRef>(dropTargetRef, () => elemRef.current);

    useEffect(() => {
        setState((prev: SliderState) => ({
            ...prev,
            items: [...(props.items ?? [])],
        }));
    }, [props.items]);

    useEffect(() => {
        const state = getState();

        if (
            props.slideIndex === state.slideIndex
            || state.waitingForAnimation
        ) {
            return;
        }

        const num = minmax(0, (state.items ?? []).length - 1, props.slideIndex ?? 0);
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
            state.className,
        ),
        style: {
            width: px(state.width ?? 0),
            height: px(state.height ?? 0),
        },
    };

    // Sliding content props
    const contentProps: HTMLAttributes<HTMLDivElement> = {
        ...(state.content ?? {}),
        className: classNames(
            'slider__content',
            {
                animate: state.animate,
            },
            state.content?.className,
        ),
        style: {},
    };

    if (state.vertical) {
        contentProps.style!.top = px(state.position);
    } else {
        contentProps.style!.left = px(state.position);
    }

    // Slide props
    const commonSlideProps = {
        width: state.width ?? 0,
        height: state.height ?? 0,
    };

    return (
        <div {...sliderProps} ref={elemRef}>
            <div {...contentProps} ref={contentRef}>
                {(state.items ?? []).map((item) => (
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
