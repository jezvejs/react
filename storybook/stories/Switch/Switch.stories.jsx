// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { Switch } from '@jezvejs/react';
import './Switch.stories.scss';

export default {
    title: 'Components/Switch',
    component: Switch,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
        label: 'Switch',
    },
};

export const Styled = {
    args: {
        className: 'blue-switch',
        label: 'Switch component',
        tooltip: 'Custom tooltip',
    },
};

export const Large = {
    args: {
        className: 'large-switch',
    },
};

export const Disabled = {
    args: {
        label: 'Disabled Switch',
        disabled: true,
    },
};
