import { useState } from 'react';
import { DropDown } from '@jezvejs/react';
import { ActionButton } from '../../../../../Components/ActionButton/ActionButton.jsx';

export const ToggleEnable = (args) => {
    const [state, setState] = useState({
        ...args,
    });

    const onToggle = () => {
        setState((prev) => ({ ...prev, disabled: !prev.disabled }));
    };

    return (
        <>
            <div style={{ marginBottom: '1rem' }}>
                <DropDown {...args} disabled={state.disabled} />
            </div>
            <ActionButton
                title={(state.disabled ? 'Enable' : 'Disable')}
                onClick={onToggle}
            />
        </>
    );
};
