import { useState } from 'react';
import { DropDown, DropDownProps } from '@jezvejs/react';
import { ActionButton } from '../../../../../common/Components/ActionButton/ActionButton.tsx';
import { SectionControls } from '../../../../../common/Components/SectionControls/SectionControls.tsx';

export type ToggleEnableProps = Partial<DropDownProps> & {
    btnId?: string;
};

export const ToggleEnable = (args: ToggleEnableProps) => {
    const { btnId, ...props } = args;
    const [state, setState] = useState({
        ...props,
    });

    const onToggle = () => {
        setState((prev) => ({ ...prev, disabled: !prev.disabled }));
    };

    return (
        <>
            <DropDown {...props} disabled={state.disabled} />
            <SectionControls>
                <ActionButton
                    id={btnId}
                    title={(state.disabled ? 'Enable' : 'Disable')}
                    onClick={onToggle}
                />
            </SectionControls>
        </>
    );
};
