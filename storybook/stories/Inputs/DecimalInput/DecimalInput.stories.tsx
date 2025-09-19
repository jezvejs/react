import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { useState } from 'react';
import { DecimalInput, DecimalInputProps } from '@jezvejs/react';
import '@jezvejs/react/style.scss';

import { ActionButton } from 'common/Components/ActionButton/ActionButton.tsx';
import { SectionControls } from 'common/Components/SectionControls/SectionControls.tsx';
import { withInputState } from 'common/utils/withInputState.tsx';

const TempInputDecorator = (StoryComponent: StoryFn) => (
    <div>
        <StoryComponent />
        <SectionControls>
            <input className="input tmp-input" placeholder="Temporary input" type="text" />
        </SectionControls>
    </div>
);

const InputWithState = withInputState<DecimalInputProps>(DecimalInput);

type Story = StoryObj<typeof InputWithState>;

const meta: Meta<typeof InputWithState> = {
    title: 'Input/DecimalInput',
    component: InputWithState,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

export const Default: Story = {
    args: {
        id: 'defaultInput',
    },
    render: function Render(args) {
        const onSubmit = (e: React.FormEvent<HTMLElement>) => {
            e.preventDefault();
            alert('Form submitted');
        };

        return (
            <form onSubmit={onSubmit}>
                <InputWithState {...args} />
                <input type="submit" hidden />
            </form>
        );
    },
    decorators: [TempInputDecorator],
};

export const DigitsLimit: Story = {
    args: {
        id: 'digitsLimitInput',
        digits: 3,
        value: '2',
    },
    decorators: [TempInputDecorator],
};

export const MinMax: Story = {
    args: {
        id: 'minMaxDecInput',
        min: -10,
        max: 10,
    },
    decorators: [TempInputDecorator],
};

export const Integer: Story = {
    args: {
        id: 'integerInput',
        digits: 0,
    },
    decorators: [TempInputDecorator],
};

export const OnlyPositive: Story = {
    args: {
        id: 'positiveInput',
        allowNegative: false,
    },
    decorators: [TempInputDecorator],
};

export const LeadingZeros: Story = {
    args: {
        id: 'leadZerosInput',
        allowMultipleLeadingZeros: true,
    },
    decorators: [TempInputDecorator],
};

export const Disabled: Story = {
    args: {
        id: 'disabledInput',
        value: '-5678.90',
        disabled: true,
    },
    render: function Render(args) {
        const [state, setState] = useState(args);

        const onToggle = () => {
            setState((prev) => ({ ...prev, disabled: !prev.disabled }));
        };

        const onChangeValue = () => {
            setState((prev) => ({ ...prev, value: '1000' }));
        };

        return (
            <>
                <InputWithState {...state} />
                <SectionControls>
                    <ActionButton
                        id="toggleEnableBtn"
                        title={(state.disabled ? 'Enable' : 'Disable')}
                        onClick={onToggle}
                    />
                    <ActionButton
                        id="changeValueBtn"
                        title="Change value"
                        onClick={onChangeValue}
                    />
                </SectionControls>
            </>
        );
    },
};
