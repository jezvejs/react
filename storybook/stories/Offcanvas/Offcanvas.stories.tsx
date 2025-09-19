import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { Offcanvas } from '@jezvejs/react';

import { OpenOffcanvas } from 'common/Components/OpenOffcanvas/OpenOffcanvas.tsx';

import './Offcanvas.stories.scss';

export type Story = StoryObj<typeof Offcanvas>;

const meta: Meta<typeof Offcanvas> = {
    title: 'Components/Offcanvas',
    component: Offcanvas,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

export const Default: Story = {
    args: {
        children: 'Offcanvas value',
    },
    render: OpenOffcanvas,
};

/**
 * Disable 'usePortal' option to render component in place
 */
export const UsePortal: Story = {
    args: {
        usePortal: false,
        children: 'Offcanvas value',
        placement: 'left',
    },
    render: OpenOffcanvas,
};

export const Right: Story = {
    args: {
        children: 'Offcanvas value',
        placement: 'right',
    },
    render: OpenOffcanvas,
};

export const Top: Story = {
    args: {
        children: 'Offcanvas value',
        placement: 'top',
    },
    render: OpenOffcanvas,
};

export const Bottom: Story = {
    args: {
        children: 'Offcanvas value',
        placement: 'bottom',
    },
    render: OpenOffcanvas,
};

/**
 * In this example scroll lock is disabled, with useScrollLock: false option.
 * Body scroll should be available under backdrop of active component.
 */
export const Scroll: Story = {
    args: {
        children: 'Offcanvas value',
        useScrollLock: false,
    },
    render: OpenOffcanvas,
};
