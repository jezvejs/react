import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { useState } from 'react';
import { Tags, TagsHelpers } from '@jezvejs/react';

import { defaultItems } from './data.ts';
import './Tags.stories.scss';

export type Story = StoryObj<typeof Tags>;

const meta: Meta<typeof Tags> = {
    title: 'Components/Tags',
    component: Tags,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

export const Default: Story = {
    args: {
        items: defaultItems(),
    },
};

export const Styled: Story = {
    args: {
        className: 'styled',
        items: defaultItems(),
    },
};

export const ActiveItem: Story = {
    args: {
        className: 'styled',
        items: defaultItems(),
    },
    render: function Render(args) {
        const [state, setState] = useState({
            ...args,
        });

        const onItemClick = (itemId: string) => {
            setState((prev) => ({
                ...prev,
                activeItemId: itemId,
            }));
        };

        return (
            <Tags
                {...state}
                onItemClick={onItemClick}
            />
        );
    },
};

export const Closeable: Story = {
    args: {
        className: 'styled',
        closeable: true,
        items: defaultItems().map((item) => (
            (item.id === '4')
                ? { ...item, closeable: false }
                : item
        )),
    },
    render: function Render(args) {
        const [state, setState] = useState({
            ...args,
        });

        const onCloseItem = (itemId: string) => {
            setState((prev) => (
                TagsHelpers.removeItemsById(prev, itemId)
            ));
        };

        return (
            <Tags
                {...state}
                onCloseItem={onCloseItem}
            />
        );
    },
};

export const DisabledItem: Story = {
    args: {
        className: 'styled',
        items: defaultItems().map((item) => (
            (item.id === '2')
                ? { ...item, disabled: true }
                : item
        )),
    },
};
