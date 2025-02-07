import { useState } from 'react';
import { DropDown, DropDownProps } from '@jezvejs/react';
import { ActionButton } from '../../../../../common/Components/ActionButton/ActionButton.tsx';
import { SectionControls } from '../../../../../common/Components/SectionControls/SectionControls.tsx';

export const ToggleEnable = (args: Partial<DropDownProps>) => {
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
