import { Button } from '@jezvejs/react';
import { forwardRef } from 'react';

import MenuIcon from '../../assets/icons/menu.svg';
import './MenuButton.scss';

export const MenuButton = forwardRef((props, ref) => (
    <Button
        className="menu-btn"
        icon={MenuIcon}
        ref={ref}
        {...props}
    />
));

MenuButton.displayName = 'MenuButton';
