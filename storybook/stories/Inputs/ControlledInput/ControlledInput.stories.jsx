// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { ControlledInput } from '@jezvejs/react';

// Hooks
import { useInputState } from '../../../common/hooks/useInputState.js';

// Common components
import { ActionButton } from '../../../common/Components/ActionButton/ActionButton.jsx';
import { SectionControls } from '../../../common/Components/SectionControls/SectionControls.jsx';

const InputWithState = (props) => {
    const { inputProps } = useInputState(props);

    return (
        <ControlledInput {...inputProps} />
    );
};

export default {
    title: 'Input/ControlledInput',
    component: InputWithState,
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
