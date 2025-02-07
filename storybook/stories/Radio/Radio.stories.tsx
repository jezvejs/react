import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { Radio } from '@jezvejs/react';

export type Story = StoryObj<typeof Radio>;

const meta: Meta<typeof Radio> = {
    title: 'Components/Radio',
    component: Radio,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

export const Default: Story = {
    args: {
        label: 'Radio 1',
        name: 'radio1',
    },
};

export const Checked: Story = {
    args: {
        label: 'Radio 2',
        checked: true,
        name: 'radio1',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Disabled radio',
        disabled: true,
        name: 'radio1',
    },
};
