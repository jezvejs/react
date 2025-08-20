import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { Button, Header } from '@jezvejs/react';

import MenuIcon from 'common/assets/icons/menu.svg';

import './Header.stories.scss';

type Story = StoryObj<typeof Header>;

const meta: Meta<typeof Header> = {
    title: 'Components/Header',
    component: Header,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

export const Default: Story = {
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
