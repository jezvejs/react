import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { IndetermProgress } from '@jezvejs/react';
import './IndetermProgress.stories.scss';

type Story = StoryObj<typeof IndetermProgress>;

const meta: Meta<typeof IndetermProgress> = {
    title: 'Components/IndetermProgress',
    component: IndetermProgress,
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

export const Styled: Story = {
    args: {
        className: 'pb-style',
    },
};

export const CirclesCount: Story = {
    args: {
        circlesCount: 3,
        className: 'circles-style',
    },
};
