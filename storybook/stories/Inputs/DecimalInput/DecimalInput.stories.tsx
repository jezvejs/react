import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { DecimalInput, DecimalInputProps } from '@jezvejs/react';
import { SectionControls } from '../../../common/Components/SectionControls/SectionControls.tsx';
import { useInputState } from '../../../common/hooks/useInputState.ts';

const TempInputDecorator = (StoryComponent: StoryFn) => (
    <div>
        <StoryComponent />
        <SectionControls>
            <input className="input tmp-input" placeholder="Temporary input" type="text" />
        </SectionControls>
    </div>
);

const InputWithState: React.FC<DecimalInputProps> = (props) => {
    const { inputProps } = useInputState<DecimalInputProps>(props);

    return (
        <DecimalInput {...inputProps} />
    );
};

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
