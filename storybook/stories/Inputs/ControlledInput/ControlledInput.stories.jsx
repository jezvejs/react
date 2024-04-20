// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { ControlledInput } from '@jezvejs/react';
import { useState } from 'react';

import { ActionButton } from '../../../Components/ActionButton/ActionButton.jsx';

export default {
    title: 'Input/ControlledInput',
    component: ControlledInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const DigitsOnly = {
    args: {
        isValidValue: (value) => (/^\d*$/.test(value)),
    },
};

export const LettersOnly = {
    args: {
        isValidValue: (value) => (/^[a-zA-Z]*$/.test(value)),
    },
};

export const Disabled = {
    args: {
        value: '-5678.90',
        disabled: true,
        isValidValue: (value) => /^-?\d*\.?\d*$/.test(value),
    },
    render: function Render(args) {
        const [state, setState] = useState({
            ...args,
        });

        function onToggle() {
            setState((prev) => ({ ...prev, disabled: !prev.disabled }));
        }

        return (
            <>
                <div style={{ marginBottom: '1rem' }}>
                    <ControlledInput {...args} disabled={state.disabled} />
                </div>
                <ActionButton
                    title={(state.disabled ? 'Enable' : 'Disable')}
                    onClick={onToggle}
                />
            </>
        );
    },
};
