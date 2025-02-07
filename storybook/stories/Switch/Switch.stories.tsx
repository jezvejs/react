import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { Switch } from '@jezvejs/react';
import './Switch.stories.scss';

export type Story = StoryObj<typeof Switch>;

const meta: Meta<typeof Switch> = {
    title: 'Components/Switch',
    component: Switch,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

export const Default: Story = {
    args: {
        label: 'Switch',
    },
};

export const Styled: Story = {
    args: {
        className: 'blue-switch',
        label: 'Switch component',
        tooltip: 'Custom tooltip',
    },
};

export const Large: Story = {
    args: {
        className: 'large-switch',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Disabled Switch',
        disabled: true,
    },
};
