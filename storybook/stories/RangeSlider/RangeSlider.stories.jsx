// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { useState } from 'react';
import { isObject } from '@jezvejs/types';
import { RangeSlider } from '@jezvejs/react';

import { ActionButton } from '../../common/Components/ActionButton/ActionButton.jsx';

import './RangeSlider.stories.scss';

const LabeledRangeSlider = (args) => {
    const [state, setState] = useState({
        value: 0,
        start: 0,
        end: 100,
    });

    const onChange = (value) => {
        setState((prev) => (
            isObject(value)
                ? { ...prev, ...value }
                : { ...prev, value }
        ));
    };

    const sliderValue = (args.range)
        ? `${state.start} - ${state.end}`
        : state.value;

    return (
        <div className="range-slider-container">
            <RangeSlider {...args} onChange={onChange} />
            <div className="range-slider-value">{sliderValue}</div>
        </div>
    );
};

export default {
    title: 'Components/RangeSlider',
    component: LabeledRangeSlider,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export const Default = {
};

export const Vertical = {
    args: {
        axis: 'y',
        className: 'vertical',
    },
};

export const Styled = {
    args: {
        className: 'styled',
    },
};

export const BeforeArea = {
    args: {
        className: 'styled',
        beforeArea: true,
    },
};

export const AfterArea = {
    args: {
        className: 'styled',
        afterArea: true,
    },
};

export const BeforeAndAfterAreas = {
    args: {
        className: 'styled',
        beforeArea: true,
        afterArea: true,
    },
};

/**
 * 'step' property is set to 0.02
 */
export const Step = {
    args: {
        className: 'styled',
        step: 0.02,
        min: -10,
        max: 10,
    },
};

export const Range = {
    args: {
        className: 'styled',
        range: true,
    },
};

/**
 * 'scrollOnClickOutsideRange' option is enabled.
 */
export const ScrollRange = {
    args: {
        className: 'styled',
        range: true,
        scrollOnClickOutsideRange: true,
    },
};

export const Disabled = {
    args: {
        disabled: true,
    },
    render: function Render(args) {
        const [state, setState] = useState({
            value: 0,
            start: 0,
            end: 100,
            disabled: true,
        });

        const onToggleEnable = () => {
            setState((prev) => ({ ...prev, disabled: !prev.disabled }));
        };

        const onChange = (value) => {
            setState((prev) => (
                isObject(value)
                    ? { ...prev, ...value }
                    : { ...prev, value }
            ));
        };

        const sliderValue = (args.range)
            ? `${state.start} - ${state.end}`
            : state.value;

        return (
            <div className="range-slider-container">
                <RangeSlider {...args} disabled={state.disabled} onChange={onChange} />
                <div className="range-slider-value">{sliderValue}</div>
                <ActionButton
                    title={(state.disabled ? 'Enable' : 'Disable')}
                    onClick={onToggleEnable}
                />
            </div>
        );
    },
};
