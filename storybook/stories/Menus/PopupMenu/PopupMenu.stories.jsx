// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { PopupMenu } from '@jezvejs/react';
import { useState } from 'react';

import { usePortalElement } from '../../../common/hooks/usePortalElement.jsx';
import { MenuButton } from '../../../common/Components/MenuButton/MenuButton.jsx';

import { getDefaultItems } from './data.js';
import './PopupMenu.stories.scss';

export default {
    title: 'Menu/PopupMenu',
    component: PopupMenu,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

const PopupMenuDemo = (args) => {
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

const heightDecorator = (Story) => (
    <div className="rel-container">
        <Story />
    </div>
);

export const Default = {
    args: {
        items: getDefaultItems(),
        multiple: true,
    },
    render: PopupMenuDemo,
};

export const AbsolutePosition = {
    args: {
        items: getDefaultItems(),
        multiple: true,
        fixed: false,
    },
    decorators: [heightDecorator],
    render: PopupMenuDemo,
};

export const HideOnScroll = {
    args: {
        items: getDefaultItems(),
        multiple: true,
        hideOnScroll: false,
    },
    decorators: [heightDecorator],
    render: PopupMenuDemo,
};

export const HideOnSelect = {
    args: {
        items: getDefaultItems(),
        multiple: true,
        hideOnSelect: false,
    },
    decorators: [heightDecorator],
    render: PopupMenuDemo,
};
