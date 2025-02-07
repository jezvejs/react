import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { CloseButton } from '@jezvejs/react';

type Story = StoryObj<typeof CloseButton>;

const meta: Meta<typeof CloseButton> = {
    title: 'Components/CloseButton',
    component: CloseButton,
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

export const Large: Story = {
    args: {
        small: false,
    },
};
