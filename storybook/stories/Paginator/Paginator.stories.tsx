import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { Paginator } from '@jezvejs/react';

import './Paginator.stories.scss';

export type Story = StoryObj<typeof Paginator>;

const meta: Meta<typeof Paginator> = {
    title: 'Components/Paginator',
    component: Paginator,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

export const Default: Story = {
    args: {
        pagesCount: 5,
    },
};

export const Styled: Story = {
    args: {
        className: 'styled',
        breakLimit: 3,
        pagesCount: 12,
    },
};

export const Arrows: Story = {
    args: {
        className: 'styled',
        pagesCount: 10,
        arrows: true,
    },
};

export const ActiveLink: Story = {
    args: {
        pagesCount: 10,
        allowActiveLink: true,
    },
};

export const CustomURL: Story = {
    args: {
        pagesCount: 10,
        url: 'https://test.url/content/',
        pageParam: 'p',
    },
};

export const DisabledURL: Story = {
    args: {
        pagesCount: 10,
    },
};

export const ShowSingleItem: Story = {
    args: {
        pagesCount: 1,
        showSingleItem: true,
    },
};

export const HideSingleItem: Story = {
    args: {
        pagesCount: 1,
        showSingleItem: false,
    },
};
