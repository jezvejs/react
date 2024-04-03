import { Button } from '@jezvejs/react';
import { forwardRef } from 'react';

import MenuIcon from '../../assets/icons/menu.svg';
import './MenuButton.scss';

// eslint-disable-next-line react/display-name
export const MenuButton = forwardRef((props, ref) => (
    <Button
        className="menu-btn"
        icon={MenuIcon}
        ref={ref}
        {...props}
    />
));
