// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { PopupMenu } from '@jezvejs/react';
import { useMemo, useState } from 'react';

import SelectIcon from '../assets/icons/select.svg';
import SearchIcon from '../assets/icons/search.svg';
import { MenuButton } from '../components/MenuButton/MenuButton.jsx';

import './PopupMenu.stories.scss';

export default {
    title: 'Components/PopupMenu',
    component: PopupMenu,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

const getDefaultItems = () => ([{
    id: 'selectBtnItem',
    icon: SelectIcon,
    title: 'Button item',
}, {
    id: 'separator1',
    type: 'separator',
}, {
    id: 'linkItem',
    type: 'link',
    title: 'Link item',
    icon: SearchIcon,
    url: '#123',
}, {
    id: 'noIconItem',
    title: 'No icon item',
}, {
    id: 'checkboxItem',
    type: 'checkbox',
    title: 'Checkbox item',
    selected: true,
}]);

const PopupMenuDemo = (args) => {
    const portalElement = useMemo(() => (
        document.getElementById('custom-root')
    ), []);
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
    },
    render: PopupMenuDemo,
};

export const AbsolutePosition = {
    args: {
        items: getDefaultItems(),
        fixed: false,
    },
    decorators: [heightDecorator],
    render: PopupMenuDemo,
};

export const HideOnScroll = {
    args: {
        items: getDefaultItems(),
        hideOnScroll: false,
    },
    decorators: [heightDecorator],
    render: PopupMenuDemo,
};

export const HideOnSelect = {
    args: {
        items: getDefaultItems(),
        hideOnSelect: false,
    },
    decorators: [heightDecorator],
    render: PopupMenuDemo,
};
