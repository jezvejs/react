// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { Button, Header } from '@jezvejs/react';

import MenuIcon from '../../common/assets/icons/menu.svg';

import './Header.stories.scss';

export default {
    title: 'Components/Header',
    component: Header,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
        className: 'full-width',
        children: (
            <>
                <Button
                    className="header-menu-btn"
                    icon={MenuIcon}
                />
                <Button
                    className="nav-header__logo"
                    type="link"
                    url="#"
                    title="Header component"
                />
            </>
        ),
    },
    parameters: {
        layout: 'fullscreen',
    },
};
