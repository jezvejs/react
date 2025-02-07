import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { ColorInput } from '@jezvejs/react';
import { useState } from 'react';

// Common components
import { ActionButton } from '../../../common/Components/ActionButton/ActionButton.tsx';
import { SectionControls } from '../../../common/Components/SectionControls/SectionControls.tsx';

type Story = StoryObj<typeof ColorInput>;

const meta: Meta<typeof ColorInput> = {
    title: 'Input/ColorInput',
    component: ColorInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

export const Default: Story = {
    render: function Render(args) {
        const [state, setState] = useState({
            ...args,
        });

        const setValue = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            setState((prev) => ({ ...prev, value }));
        };

        const inputProps = {
            ...state,
            onInput: setValue,
            onChange: setValue,
        };

        return (
            <ColorInput {...inputProps} />
        );
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
    render: function Render(args) {
        const [state, setState] = useState({
            ...args,
        });

        function onToggle() {
            setState((prev) => ({ ...prev, disabled: !prev.disabled }));
        }

        const setValue = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            setState((prev) => ({ ...prev, value }));
        };

        const inputProps = {
            ...state,
            onInput: setValue,
            onChange: setValue,
        };

        return (
            <>
                <ColorInput {...inputProps} />
                <SectionControls>
                    <ActionButton
                        title={(state.disabled ? 'Enable' : 'Disable')}
                        onClick={onToggle}
                    />
                </SectionControls>
            </>
        );
    },
};
