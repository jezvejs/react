import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';

import { getDefaultItems, getNestedMenuItems } from 'common/assets/data/popupMenuData.ts';

import { PopupMenuDemo } from 'common/Components/PopupMenuDemo/PopupMenuDemo.tsx';

import './PopupMenu.stories.scss';

export type Story = StoryObj<typeof PopupMenuDemo>;

const meta: Meta<typeof PopupMenuDemo> = {
    title: 'Menu/PopupMenu',
    component: PopupMenuDemo,
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
        id: 'defaultPopupMenu',
        buttonProps: { id: 'defaultMenuButton' },
        items: getDefaultItems(),
        multiple: true,
    },
};

export const AbsolutePosition: Story = {
    args: {
        id: 'absPositionPopupMenu',
        buttonProps: { id: 'absPositionMenuButton' },
        items: getDefaultItems(),
        multiple: true,
        fixed: false,
    },
    decorators: [heightDecorator],
};

export const HideOnScroll: Story = {
    args: {
        id: 'hideOnScrollPopupMenu',
        buttonProps: { id: 'hideOnScrollMenuButton' },
        items: getDefaultItems(),
        multiple: true,
        hideOnScroll: false,
    },
    decorators: [heightDecorator],
};

export const HideOnSelect: Story = {
    args: {
        id: 'hideOnSelectPopupMenu',
        buttonProps: { id: 'hideOnSelectMenuButton' },
        items: getDefaultItems(),
        multiple: true,
        hideOnSelect: false,
    },
    decorators: [heightDecorator],
};

export const NestedMenus: Story = {
    args: {
        id: 'nestedParentPopupMenu',
        buttonProps: { id: 'nestedParentMenuButton' },
        items: getNestedMenuItems(),
        multiple: true,
        hideOnScroll: false,
        position: {
            position: 'right-start',
            margin: 2,
        },
    },
    decorators: [heightDecorator],
};
