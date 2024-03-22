// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { Paginator } from '@jezvejs/react';

import './Paginator.stories.scss';

export default {
    title: 'Components/Paginator',
    component: Paginator,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
        pagesCount: 5,
    },
};

export const Styled = {
    args: {
        className: 'styled',
        breakLimit: 3,
        pagesCount: 12,
    },
};

export const Arrows = {
    args: {
        className: 'styled',
        pagesCount: 10,
        arrows: true,
    },
};

export const ActiveLink = {
    args: {
        pagesCount: 10,
        allowActiveLink: true,
    },
};

export const CustomURL = {
    args: {
        pagesCount: 10,
        url: 'https://test.url/content/',
        pageParam: 'p',
    },
};

export const DisabledURL = {
    args: {
        pagesCount: 10,
        url: null,
    },
};

export const ShowSingleItem = {
    args: {
        url: null,
        pagesCount: 1,
        showSingleItem: true,
    },
};

export const HideSingleItem = {
    args: {
        url: null,
        pagesCount: 1,
        showSingleItem: false,
    },
};
