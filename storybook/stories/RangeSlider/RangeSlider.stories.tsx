import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { useState } from 'react';
import { RangeSlider, RangeSliderProps, RangeSliderValue } from '@jezvejs/react';

import { ActionButton } from '../../common/Components/ActionButton/ActionButton.tsx';
import { RangeSliderStyled } from '../../common/Components/RangeSliderStyled/RangeSliderStyled.tsx';

import './RangeSlider.stories.scss';

const LabeledRangeSlider = (args: Partial<RangeSliderProps>) => {
    const [state, setState] = useState({
        value: 0,
        start: 0,
        end: 100,
        ...args,
    });

    const onChange = (value: RangeSliderValue) => {
        setState((prev) => (
            (typeof value === 'number')
                ? { ...prev, value }
                : { ...prev, ...value }
        ));
    };

    const sliderValue = (args.range)
        ? `${state.start} - ${state.end}`
        : state.value;

    const RangeSliderComponent = (args.className?.includes('styled'))
        ? RangeSliderStyled
        : RangeSlider;

    return (
        <div className="range-slider-container">
            <RangeSliderComponent {...args} onChange={onChange} />
            <div className="range-slider-value">{sliderValue}</div>
        </div>
    );
};

export type Story = StoryObj<typeof LabeledRangeSlider>;

const meta: Meta<typeof LabeledRangeSlider> = {
    title: 'Components/RangeSlider',
    component: LabeledRangeSlider,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};
export default meta;

export const Default: Story = {
    args: {
        value: 50,
    },
};

export const Vertical: Story = {
    args: {
        axis: 'y',
        value: 50,
        className: 'vertical',
    },
};

export const Styled: Story = {
    args: {
        value: 50,
        className: 'styled',
    },
};

export const BeforeArea: Story = {
    args: {
        className: 'styled',
        value: 50,
        beforeArea: true,
    },
};

export const AfterArea: Story = {
    args: {
        className: 'styled',
        value: 50,
        afterArea: true,
    },
};

export const BeforeAndAfterAreas: Story = {
    args: {
        className: 'styled',
        value: 50,
        beforeArea: true,
        afterArea: true,
    },
};

/**
 * 'step' property is set to 0.02
 */
export const Step: Story = {
    args: {
        className: 'styled',
        value: 0,
        step: 0.02,
        min: -10,
        max: 10,
    },
};

export const Range: Story = {
    args: {
        className: 'styled',
        range: true,
        start: 30,
        end: 70,
    },
};

/**
 * 'scrollOnClickOutsideRange' option is enabled.
 */
export const ScrollRange: Story = {
    args: {
        className: 'styled',
        range: true,
        start: 30,
        end: 70,
        scrollOnClickOutsideRange: true,
    },
};

export const Disabled: Story = {
    args: {
        className: 'styled',
        range: true,
        start: 30,
        end: 70,
        disabled: true,
    },
    render: function Render(args) {
        const [state, setState] = useState({ ...args });

        const onToggleEnable = () => {
            setState((prev) => ({ ...prev, disabled: !prev.disabled }));
        };

        const onChange = (value: RangeSliderValue) => {
            setState((prev) => (
                (typeof value === 'number')
                    ? { ...prev, value }
                    : { ...prev, ...value }
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
