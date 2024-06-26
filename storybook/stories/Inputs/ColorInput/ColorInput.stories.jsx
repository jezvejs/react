// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { ColorInput } from '@jezvejs/react';
import { useState } from 'react';

// Common components
import { ActionButton } from '../../../Components/ActionButton/ActionButton.jsx';
import { SectionControls } from '../../../Components/SectionControls/SectionControls.jsx';

export default {
    title: 'Input/ColorInput',
    component: ColorInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    render: function Render(args) {
        const [state, setState] = useState({
            ...args,
        });

        const setValue = (e) => {
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

export const Disabled = {
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

        const setValue = (e) => {
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
