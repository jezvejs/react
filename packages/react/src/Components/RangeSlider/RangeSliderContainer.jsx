import PropTypes from 'prop-types';
import { useRef, forwardRef, useImperativeHandle } from 'react';
import { isFunction } from '@jezvejs/types';

// Utils
import { minmax } from '../../utils/common.js';
import { useDragnDrop } from '../../utils/DragnDrop/DragnDropProvider.jsx';

// Local components
import { RangeSliderDragZone } from './components/RangeSliderDragZone.jsx';
import { RangeSliderDropTarget } from './components/RangeSliderDropTarget.jsx';
import { RangeSliderBeforeArea } from './components/RangeSliderBeforeArea.jsx';
import { RangeSliderAfterArea } from './components/RangeSliderAfterArea.jsx';

import { positionToValue, valueToPosition, stepValue } from './helpers.js';

// eslint-disable-next-line react/display-name
export const RangeSliderContainer = forwardRef((props, ref) => {
    const innerRef = useRef(null);
    useImperativeHandle(ref, () => innerRef.current);

    const { getState, setState } = useDragnDrop();

    const sliderRef = useRef(null);
    const endSliderRef = useRef(null);
    const sliderAreaRef = useRef(null);
    const beforeAreaRef = useRef(null);
    const afterAreaRef = useRef(null);
    const selectedAreaRef = useRef(null);

    const getValue = () => {
        const state = getState();
        return (props.range)
            ? { start: state.start, end: state.end }
            : state.value;
    };

    const getStep = () => {
        const state = getState();
        const { step, min, max } = state;
        return step ?? (Math.abs(max - min) / 100);
    };

    const posToValue = (pos, state) => {
        const { maxPos } = state;
        const value = positionToValue(pos, state.min, state.max, maxPos);

        return stepValue(value, state.step, state.precision);
    };

    const valueToPos = (value) => {
        const state = getState();
        return valueToPosition(value, state.min, state.max, state.maxPos);
    };

    const notifyChanged = () => {
        props.onChange?.(getValue());
    };

    const notifyScroll = () => {
        props.onScroll?.(getValue());
    };

    const beforeChange = (value, changeType = 'value') => (
        isFunction(props.onBeforeChange)
            ? props.onBeforeChange(value, changeType)
            : value
    );

    const changeRange = (range, scroll = false) => {
        const { start, end } = range;

        setState((prev) => ({ ...prev, start, end }));

        if (scroll) {
            notifyScroll();
        }
        notifyChanged();
    };

    const onScroll = (pos) => {
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

    const onStartPosChange = (pos) => {
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
        changeRange(range);
    };

    const onEndPosChange = (pos) => {
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
        changeRange(range);
    };

    const onPosChange = (pos, type) => {
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
        const value = beforeChange(newValue);
        if (state.value === value) {
            return;
        }

        setState((prev) => ({
            ...prev,
            value,
        }));

        props?.onChange?.(value);
    };

    const onClick = (e) => {
        const availTargets = [
            sliderAreaRef.current,
            beforeAreaRef.current,
            afterAreaRef.current,
        ];

        if (e.target && !availTargets.includes(e.target)) {
            return;
        }

        let pos = null;
        const { axis } = props;

        const rect = sliderRef.current?.getBoundingClientRect();
        const offset = innerRef.current?.getBoundingClientRect();
        if (axis === 'x') {
            pos = (e.clientX - offset.left) - (rect.width / 2);
        } else if (axis === 'y') {
            pos = (e.clientY - offset.top) - (rect.height / 2);
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

    const onFocus = (e) => {
        props?.onFocus?.(e);
    };

    const onBlur = (e) => {
        props?.onBlur?.(e);
    };

    const onKey = (e) => {
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
            onPosChange={(pos) => onPosChange(pos, props.range && 'startSlider')}
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
            <div className="range-slider__area" ref={sliderAreaRef}></div>
            {sliderBeforeArea}
            {sliderAfterArea}
            {sliderSelectedArea}
            {slider}
            {endSlider}
        </RangeSliderDropTarget>
    );
});

RangeSliderContainer.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    tabIndex: PropTypes.number,
    value: PropTypes.number,
    start: PropTypes.number,
    end: PropTypes.number,
    axis: PropTypes.oneOf(['x', 'y']),
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    disabled: PropTypes.bool,
    range: PropTypes.bool,
    beforeArea: PropTypes.bool,
    afterArea: PropTypes.bool,
    scrollOnClickOutsideRange: PropTypes.bool,
    onClick: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onKey: PropTypes.func,
    onBeforeChange: PropTypes.func,
    onChange: PropTypes.func,
    onScroll: PropTypes.func,
};
