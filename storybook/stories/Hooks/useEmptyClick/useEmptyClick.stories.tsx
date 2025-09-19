import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { useEmptyClick } from '@jezvejs/react';
import { useRef, useState } from 'react';
import classNames from 'classnames';

import { ActionButton } from 'common/Components/ActionButton/ActionButton.tsx';

import './useEmptyClick.stories.scss';

const ExcludedBox: React.FC = () => {
    const ref = useRef(null);
    const [clicks, setClicks] = useState(0);

    const handleClick = () => {
        setClicks((prev) => (prev + 1));
    };

    useEmptyClick(handleClick, ref, true);

    return (
        <div>
            <div ref={ref} className="excluded-box">Not here</div>
            <div className="click-counter">{clicks}</div>
        </div>
    );
};

function MenuDemo() {
    const ref = useRef(null);
    const [state, setState] = useState({
        open: false,
    });

    const closeMenu = () => {
        setState((prev) => ({ ...prev, open: false }));
    };

    const openMenu = () => {
        setState((prev) => ({ ...prev, open: true }));
    };

    useEmptyClick(closeMenu, ref, state.open);

    return (
        <div className="menu-container">
            <ActionButton title="Open" onClick={openMenu} />
            <ul
                id="menu"
                ref={ref}
                className={classNames(
                    'test-menu',
                    { 'test-menu_open': state.open },
                )}
            >
                <li>Item 1</li>
                <li>Item 2</li>
                <li>Item 3</li>
                <li>Item 4</li>
                <li>Item 5</li>
            </ul>
        </div>
    );
}

type Story = StoryObj<typeof ExcludedBox>;

const meta: Meta<typeof ExcludedBox> = {
    title: 'Hooks/useEmptyClick',
    component: ExcludedBox,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};
export default meta;

export const Default: Story = {
    args: {
    },
};

type MenuStory = StoryObj<typeof MenuDemo>;

export const Menu: MenuStory = {
    args: {
    },
    render: MenuDemo,
};
