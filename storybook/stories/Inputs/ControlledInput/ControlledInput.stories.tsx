import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { ControlledInput, ControlledInputProps } from '@jezvejs/react';

// Hooks
import { useInputState } from 'common/hooks/useInputState.ts';
import { withInputState } from 'common/utils/withInputState.tsx';

// Common components
import { ActionButton } from 'common/Components/ActionButton/ActionButton.tsx';
import { SectionControls } from 'common/Components/SectionControls/SectionControls.tsx';

const InputWithState = withInputState<ControlledInputProps>(ControlledInput);

type Story = StoryObj<typeof InputWithState>;

const meta: Meta<typeof InputWithState> = {
    title: 'Input/ControlledInput',
    component: InputWithState,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

export const DigitsOnly: Story = {
    args: {
        isValidValue: (value: string) => (/^\d*$/.test(value)),
    },
};

export const LettersOnly: Story = {
    args: {
        isValidValue: (value: string) => (/^[a-zA-Z]*$/.test(value)),
    },
};

export const Disabled: Story = {
    args: {
        value: '-5678.90',
        disabled: true,
        isValidValue: (value: string) => /^-?\d*\.?\d*$/.test(value),
    },
    render: function Render(args) {
        const { inputProps, state, setState } = useInputState(args);

        const onToggle = () => {
            setState((prev) => ({ ...prev, disabled: !prev.disabled }));
        };

        const onChangeValue = () => {
            setState((prev) => ({ ...prev, value: '1000' }));
        };

        return (
            <>
                <ControlledInput {...inputProps} />
                <SectionControls>
                    <ActionButton
                        title={(state.disabled ? 'Enable' : 'Disable')}
                        onClick={onToggle}
                    />
                    <ActionButton
                        title="Change value"
                        onClick={onChangeValue}
                    />
                </SectionControls>
            </>
        );
    },
};
