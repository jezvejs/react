import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { Spinner } from '@jezvejs/react';

export type Story = StoryObj<typeof Spinner>;

const meta: Meta<typeof Spinner> = {
    title: 'Components/Spinner',
    component: Spinner,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

export const Default: Story = {
    args: {
    },
};
