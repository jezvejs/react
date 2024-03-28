// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { Radio } from '@jezvejs/react';

export default {
    title: 'Components/Radio',
    component: Radio,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
        label: 'Radio 1',
        name: 'radio1',
    },
};

export const Checked = {
    args: {
        label: 'Radio 2',
        checked: true,
        name: 'radio1',
    },
};

export const Disabled = {
    args: {
        label: 'Disabled radio',
        disabled: true,
        name: 'radio1',
    },
};
