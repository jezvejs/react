import { Button } from '@jezvejs/react';

import PlusIcon from './assets/icons/plus.svg';
import EditIcon from './assets/icons/edit.svg';
import DeleteIcon from './assets/icons/del.svg';
import CalendarIcon from './assets/icons/calendar.svg';

import './Button.stories.scss';

export default {
    title: 'Components/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
        title: 'Create',
        icon: PlusIcon,
    },
};

export const Link = {
    args: {
        title: 'Link',
        type: 'link',
        href: '#',
        icon: EditIcon,
    },
};

export const Static = {
    args: {
        title: 'Static',
        type: 'static',
    },
};

export const CircleButton = {
    args: {
        title: 'Icon button',
        icon: EditIcon,
        className: 'circle-icon',
    },
};

export const StyledBorderButton = {
    args: {
        title: 'Border',
        className: 'btn-border',
    },
};

export const RightAlignIconButton = {
    args: {
        title: 'Border',
        className: 'btn-border',
        iconAlign: 'right',
        icon: DeleteIcon,
    },
};

export const BackgroundButton = {
    args: {
        title: 'Button title',
        className: 'bg-btn',
        icon: CalendarIcon,
    },
};

export const FullWidthButton = {
    args: {
        title: 'Button title',
        className: 'bg-btn fullwidth',
        icon: CalendarIcon,
    },
    parameters: {
        layout: 'fullscreen',
    },
};

export const DisabledButton = {
    args: {
        title: 'Disabled button',
        icon: PlusIcon,
        disabled: true,
    },
};

export const DisabledLink = {
    args: {
        title: 'Disabled link',
        icon: PlusIcon,
        type: 'link',
        href: '#',
        disabled: true,
    },
};
