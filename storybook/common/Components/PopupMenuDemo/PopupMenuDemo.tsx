import { PopupMenu, PopupMenuProps } from '@jezvejs/react';
import { useState } from 'react';

import { usePortalElement } from '../../hooks/usePortalElement.tsx';

import { MenuButton } from '../MenuButton/MenuButton.tsx';

export const PopupMenuDemo = (args: PopupMenuProps) => {
    const portalElement = usePortalElement();
    const [state, setState] = useState({
        ...args,
        open: false,
    });

    const toggleMenu = () => (
        setState((prev) => ({ ...prev, open: !prev.open }))
    );

    return (
        <PopupMenu {...state} container={portalElement}>
            <MenuButton onClick={toggleMenu} />
        </PopupMenu>
    );
};
