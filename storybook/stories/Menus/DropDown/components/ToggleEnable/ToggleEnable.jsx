import { useState } from 'react';
import { DropDown } from '@jezvejs/react';
import { ActionButton } from '../../../../../Components/ActionButton/ActionButton.jsx';
import { SectionControls } from '../../../../../Components/SectionControls/SectionControls.jsx';

export const ToggleEnable = (args) => {
    const [state, setState] = useState({
        ...args,
    });

    const onToggle = () => {
        setState((prev) => ({ ...prev, disabled: !prev.disabled }));
    };

    return (
        <>
            <DropDown {...args} disabled={state.disabled} />
            <SectionControls>
                <ActionButton
                    title={(state.disabled ? 'Enable' : 'Disable')}
                    onClick={onToggle}
                />
            </SectionControls>
        </>
    );
};
