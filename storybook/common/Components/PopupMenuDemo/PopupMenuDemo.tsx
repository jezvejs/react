import { ButtonProps, PopupMenu, PopupMenuProps } from '@jezvejs/react';
import { useCallback, useState } from 'react';

import { usePortalElement } from '../../hooks/usePortalElement.tsx';

import { MenuButton } from '../MenuButton/MenuButton.tsx';

export interface PopupMenuDemoProps extends PopupMenuProps {
    buttonProps?: Partial<ButtonProps>;
}

export const PopupMenuDemo = (args: PopupMenuDemoProps) => {
    const portalElement = usePortalElement();
    const [state, setState] = useState({
        ...args,
        open: false,
    });

    const toggleMenu = useCallback(() => {
        setState((prev) => ({ ...prev, open: !prev.open }));
    }, [setState]);

    return (
        <PopupMenu {...state} container={portalElement}>
            <MenuButton {...(state.buttonProps ?? {})} onClick={toggleMenu} />
        </PopupMenu>
    );
};
