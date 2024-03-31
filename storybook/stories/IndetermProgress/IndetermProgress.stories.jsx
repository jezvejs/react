// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { IndetermProgress } from '@jezvejs/react';
import './IndetermProgress.stories.scss';

export default {
    title: 'Components/IndetermProgress',
    component: IndetermProgress,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
    },
};

export const Styled = {
    args: {
        className: 'pb-style',
    },
};

export const CirclesCount = {
    args: {
        circlesCount: 3,
        className: 'circles-style',
    },
};
