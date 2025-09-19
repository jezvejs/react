import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { PopupMenu } from '@jezvejs/react';

import { getDefaultItems, getNestedMenuItems } from 'common/assets/data/popupMenuData.ts';

import { PopupMenuDemo } from 'common/Components/PopupMenuDemo/PopupMenuDemo.tsx';

import './PopupMenu.stories.scss';

export type Story = StoryObj<typeof PopupMenu>;

const meta: Meta<typeof PopupMenu> = {
    title: 'Menu/PopupMenu',
    component: PopupMenu,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

const heightDecorator = (StoryComponent: StoryFn) => (
    <div className="rel-container">
        <StoryComponent />
    </div>
);

export const Default: Story = {
    args: {
        id: 'default',
        items: getDefaultItems(),
        multiple: true,
    },
    render: PopupMenuDemo,
};

export const AbsolutePosition: Story = {
    args: {
        items: getDefaultItems(),
        multiple: true,
        fixed: false,
    },
    decorators: [heightDecorator],
    render: PopupMenuDemo,
};

export const HideOnScroll: Story = {
    args: {
        items: getDefaultItems(),
        multiple: true,
        hideOnScroll: false,
    },
    decorators: [heightDecorator],
    render: PopupMenuDemo,
};

export const HideOnSelect: Story = {
    args: {
        items: getDefaultItems(),
        multiple: true,
        hideOnSelect: false,
    },
    decorators: [heightDecorator],
    render: PopupMenuDemo,
};

export const NestedMenus: Story = {
    args: {
        id: 'nestedParentMenu',
        items: getNestedMenuItems(),
        multiple: true,
        hideOnScroll: false,
        position: {
            position: 'right-start',
            margin: 2,
        },
    },
    decorators: [heightDecorator],
    render: PopupMenuDemo,
};
