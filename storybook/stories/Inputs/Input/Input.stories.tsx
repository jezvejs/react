import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { Input } from '@jezvejs/react';

import { withInputState } from '../../../common/utils/withInputState.tsx';

import './Input.stories.scss';

const InputWithState = withInputState(Input);

type Story = StoryObj<typeof InputWithState>;

const meta: Meta<typeof InputWithState> = {
    title: 'Input/Input',
    component: InputWithState,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

export const Default: Story = {
    args: {
        value: '',
    },
};

export const Placeholder: Story = {
    args: {
        placeholder: 'Input value',
    },
};

export const Password: Story = {
    args: {
        placeholder: 'Input password',
        type: 'password',
    },
};

export const FullWidth: Story = {
    args: {
        className: 'full-width',
    },
    parameters: {
        layout: 'fullscreen',
    },
};

export const Styled: Story = {
    args: {
        className: 'styled',
        placeholder: 'Input correct value',
    },
};

export const Disabled: Story = {
    args: {
        title: 'Disabled input',
        disabled: true,
    },
};
