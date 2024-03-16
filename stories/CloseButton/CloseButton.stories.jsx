// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { CloseButton } from '@jezvejs/react';

export default {
    title: 'Components/CloseButton',
    component: CloseButton,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
    },
};

export const Large = {
    args: {
        small: false,
    },
};
