import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { Button } from '@jezvejs/react';

import PlusIcon from 'common/assets/icons/plus.svg';
import EditIcon from 'common/assets/icons/edit.svg';
import DeleteIcon from 'common/assets/icons/del.svg';
import CalendarIcon from 'common/assets/icons/calendar.svg';

import './Button.stories.scss';

type Story = StoryObj<typeof Button>;

const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

export const Default: Story = {
    args: {
        title: 'Create',
        icon: PlusIcon,
    },
};

export const Link: Story = {
    args: {
        title: 'Link',
        type: 'link',
        url: '#',
        icon: EditIcon,
    },
};

export const Static: Story = {
    args: {
        title: 'Static',
        type: 'static',
    },
};

export const CircleButton: Story = {
    args: {
        title: 'Icon button',
        icon: EditIcon,
        className: 'circle-icon',
    },
};

export const StyledBorderButton: Story = {
    args: {
        title: 'Border',
        className: 'btn-border',
    },
};

export const RightAlignIconButton: Story = {
    args: {
        title: 'Border',
        className: 'btn-border',
        iconAlign: 'right',
        icon: DeleteIcon,
    },
};

export const BackgroundButton: Story = {
    args: {
        title: 'Button title',
        className: 'bg-btn',
        icon: CalendarIcon,
    },
};

export const FullWidthButton: Story = {
    args: {
        title: 'Button title',
        className: 'bg-btn fullwidth',
        icon: CalendarIcon,
    },
    parameters: {
        layout: 'fullscreen',
    },
};

export const DisabledButton: Story = {
    args: {
        title: 'Disabled button',
        icon: PlusIcon,
        disabled: true,
    },
};

export const DisabledLink: Story = {
    args: {
        title: 'Disabled link',
        icon: PlusIcon,
        type: 'link',
        url: '#',
        disabled: true,
    },
};
