import { Popup, PopupProps } from '@jezvejs/react';
import { useState } from 'react';
import { usePortalElement } from '../../hooks/usePortalElement.tsx';
import { ActionButton } from '../ActionButton/ActionButton.tsx';

export const LaunchPopup = (args: PopupProps) => {
    const portalElement = usePortalElement();
    const [state, setState] = useState({
        visible: false,
    });

    const showPopup = (visible: boolean) => setState((prev) => ({ ...prev, visible }));

    return (
        <>
            <ActionButton title='Show popup' onClick={() => showPopup(true)} />
            {state.visible && (
                <Popup
                    {...args}
                    show={true}
                    onClose={() => showPopup(false)}
                    container={portalElement}
                />
            )}
        </>
    );
};
