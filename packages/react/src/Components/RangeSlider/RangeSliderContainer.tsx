import {
    useRef,
    forwardRef,
    useImperativeHandle,
    useEffect,
} from 'react';

// Utils
import { minmax } from '../../utils/common.ts';
import { RangeType } from '../../utils/types.ts';
import { useDragnDrop } from '../../utils/DragnDrop/DragnDropProvider.tsx';

// Local components
import { RangeSliderDragZone } from './components/RangeSliderDragZone.tsx';
import { RangeSliderDropTarget } from './components/RangeSliderDropTarget.tsx';
import { RangeSliderBeforeArea } from './components/RangeSliderBeforeArea.tsx';
import { RangeSliderAfterArea } from './components/RangeSliderAfterArea.tsx';

import { positionToValue, valueToPosition, stepValue } from './helpers.ts';
import {
    RangeSliderBeforeChangeType,
    RangeSliderProps,
    RangeSliderState,
    RangeSliderValue,
} from './types.ts';

type RangeSliderContainerProps = RangeSliderProps;
type RangeSliderContainerRef = HTMLDivElement | null;

export const RangeSliderContainer = forwardRef<
    RangeSliderContainerRef,
    RangeSliderContainerProps
>((props, ref) => {
    const innerRef = useRef<HTMLDivElement>(null);
    useImperativeHandle<RangeSliderContainerRef, RangeSliderContainerRef>(ref, () => (
        innerRef?.current
    ));

    const { getState, setState } = useDragnDrop<RangeSliderState>();

    const sliderRef = useRef<HTMLDivElement>(null);
    const endSliderRef = useRef<HTMLDivElement>(null);
    const sliderAreaRef = useRef<HTMLDivElement>(null);
    const beforeAreaRef = useRef<HTMLDivElement>(null);
    const afterAreaRef = useRef<HTMLDivElement>(null);
    const selectedAreaRef = useRef<HTMLDivElement>(null);

    const getValue = (): RangeSliderValue => {
        const state = getState();
        if (!state) {
            return 0;
        }

        return (props.range)
            ? { start: state.start, end: state.end }
            : state.value;
    };

    const getStep = () => {
        const state = getState();
        const { step, min, max } = state;
        return step ?? (Math.abs(max - min) / 100);
    };

    const posToValue = (pos: number, state: RangeSliderState) => {
        const { maxPos } = state;
        const value = positionToValue(pos, state.min, state.max, maxPos);

        return stepValue(value, state.step ?? 0, state.precision ?? 0);
    };

    const valueToPos = (value: number) => {
        const state = getState();
        return valueToPosition(value, state.min, state.max, state.maxPos);
    };

    const notifyChanged = () => {
        props.onChange?.(getValue());
    };

    const notifyScroll = () => {
        props.onScroll?.(getValue());
    };

    const beforeChange = (
        value: RangeSliderValue,
        changeType: RangeSliderBeforeChangeType = 'value',
    ): RangeSliderValue => (
        (typeof props.onBeforeChange === 'function')
            ? props.onBeforeChange(value, changeType)
            : value
    );

    const changeRange = (range: RangeType, scroll = false) => {
        const { start, end } = range;

        setState((prev) => ({ ...prev, start, end }));

        if (scroll) {
            notifyScroll();
        }
        notifyChanged();
    };

    const onScroll = (pos: number) => {
        if (!props.range) {
            return;
        }

        const state = getState();
        const value = posToValue(pos, state);
        const size = Math.abs(state.end - state.start);
        const start = minmax(state.min, state.max - size, value);
        const end = minmax(state.min + size, state.max, start + size);

        changeRange({ start, end }, true);
    };

    const onStartPosChange = (pos: number) => {
        if (!props.range) {
            return;
        }

        const state = getState();
        const value = posToValue(pos, state);
        const newRange = {
            start: Math.min(state.end, value),
            end: state.end,
        };

        const range = beforeChange(newRange, 'start');
        changeRange(range as RangeType);
    };

    const onEndPosChange = (pos: number) => {
        if (!props.range) {
            return;
        }

        const state = getState();
        const value = posToValue(pos, state);
        const newRange = {
            start: state.start,
            end: Math.max(state.start, value),
        };

        const range = beforeChange(newRange, 'end');
        changeRange(range as RangeType);
    };

    const onPosChange = (pos: number, type: string | null = null) => {
        if (props.range) {
            if (type === 'endSlider') {
                onEndPosChange(pos);
            } else if (type === 'startSlider') {
                onStartPosChange(pos);
            } else if (type === 'selectedArea') {
                onScroll(pos);
            }
            return;
        }

        const state = getState();

        const newValue = posToValue(pos, state);
        const value = beforeChange(newValue) as number;
        if (state.value === value) {
            return;
        }

        setState((prev: RangeSliderState) => ({
            ...prev,
            value,
        }));

        props?.onChange?.(value);
    };

    const onClick = (e: React.MouseEvent) => {
        const availTargets = [
            sliderAreaRef.current,
            beforeAreaRef.current,
            afterAreaRef.current,
        ];

        if (e.target && !availTargets.includes(e.target as HTMLDivElement)) {
            return;
        }

        let pos: number | null = null;
        const { axis } = props;

        const rect = sliderRef.current?.getBoundingClientRect();
        const offset = innerRef.current?.getBoundingClientRect();
        if (axis === 'x') {
            const { clientX } = e.nativeEvent;
            const left = offset?.left ?? 0;
            const width = rect?.width ?? 0;
            pos = (clientX - left) - (width / 2);
        } else if (axis === 'y') {
            const { clientY } = e.nativeEvent;
            const top = offset?.top ?? 0;
            const height = rect?.height ?? 0;
            pos = (clientY - top) - (height / 2);
        }

        if (pos !== null) {
            const state = getState();
            const value = posToValue(pos, state);

            if (props.range) {
                const { start, end, maxPos } = state;
                const delta = Math.abs(end - start) * 0.9;

                if (value < start) {
                    if (props.scrollOnClickOutsideRange) {
                        const newValue = valueToPos(start - delta);
                        const newPos = Math.max(0, newValue);
                        onScroll(newPos);
                    } else {
                        onStartPosChange(pos);
                    }
                } else if (value > end) {
                    if (props.scrollOnClickOutsideRange) {
                        const newValue = valueToPos(start + delta);
                        const newPos = Math.min(maxPos, newValue);
                        onScroll(newPos);
                    } else {
                        onEndPosChange(pos);
                    }
                }
            } else {
                onPosChange(pos);
            }
        }

        props?.onClick?.(e);
    };

    const onFocus = (e: React.FocusEvent) => {
        props?.onFocus?.(e);
    };

    const onBlur = (e: React.FocusEvent) => {
        props?.onBlur?.(e);
    };

    const onKey = (e: React.KeyboardEvent) => {
        const { axis } = props;
        const state = getState();
        const {
            value,
            start,
            end,
            maxPos,
        } = state;
        const step = getStep();

        const isEndFocused = (
            props.range
            && document.activeElement?.contains(endSliderRef?.current)
        );

        if (
            (axis === 'x' && e.code === 'ArrowRight')
            || (axis === 'y' && e.code === 'ArrowDown')
        ) {
            e.preventDefault();

            if (props.range) {
                if (isEndFocused) {
                    const newValue = valueToPos(end + step);
                    const newPos = Math.min(maxPos, newValue);
                    onEndPosChange(newPos);
                } else {
                    const newValue = valueToPos(start + step);
                    const newPos = Math.min(maxPos, newValue);
                    onStartPosChange(newPos);
                }
            } else {
                const newValue = valueToPos(value + step);
                const newPos = Math.min(maxPos, newValue);
                onPosChange(newPos);
            }
        }

        if (
            (axis === 'x' && e.code === 'ArrowLeft')
            || (axis === 'y' && e.code === 'ArrowUp')
        ) {
            e.preventDefault();

            if (props.range) {
                if (isEndFocused) {
                    const newValue = valueToPos(end - step);
                    const newPos = Math.max(0, newValue);
                    onEndPosChange(newPos);
                } else {
                    const newValue = valueToPos(start - step);
                    const newPos = Math.max(0, newValue);
                    onStartPosChange(newPos);
                }
            } else {
                const newValue = valueToPos(value - step);
                const newPos = Math.max(0, newValue);
                onPosChange(newPos);
            }
        }

        props?.onKey?.(e);
    };

    useEffect(() => {
        const { start, end, value } = props;

        setState((prev) => ({
            ...prev,
            start,
            end,
            value,
        }));
    }, [props.start, props.end, props.value]);

    const commonProps = {
        ...props,
    };

    const sliderBeforeArea = props.beforeArea && (
        <RangeSliderBeforeArea {...commonProps} ref={beforeAreaRef} />
    );
    const sliderAfterArea = props.afterArea && (
        <RangeSliderAfterArea {...commonProps} ref={afterAreaRef} />
    );

    const sliderSelectedArea = props.range && (
        <RangeSliderDragZone
            {...commonProps}
            type="selectedArea"
            onPosChange={(pos) => onPosChange(pos, 'selectedArea')}
            ref={selectedAreaRef}
        />
    );

    const slider = (
        <RangeSliderDragZone
            {...commonProps}
            onPosChange={(pos) => onPosChange(pos, (props.range) ? 'startSlider' : null)}
            ref={sliderRef}
        />
    );

    const endSlider = props.range && (
        <RangeSliderDragZone
            {...commonProps}
            type="endSlider"
            onPosChange={(pos) => onPosChange(pos, 'endSlider')}
            ref={endSliderRef}
        />
    );

    return (
        <RangeSliderDropTarget
            {...commonProps}
            onClickCapture={onClick}
            onFocusCapture={onFocus}
            onBlurCapture={onBlur}
            onKeyDownCapture={onKey}
            ref={innerRef}
        >
            <div className="range-slider__area" ref={sliderAreaRef}>
                {sliderBeforeArea}
                {sliderAfterArea}
                {sliderSelectedArea}
            </div>
            {slider}
            {endSlider}
        </RangeSliderDropTarget>
    );
});

RangeSliderContainer.displayName = 'RangeSliderContainer';
