import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { useState } from 'react';
import { Offcanvas, OffcanvasProps } from '@jezvejs/react';

import { usePortalElement } from '../../common/hooks/usePortalElement.tsx';
import { ActionButton } from '../../common/Components/ActionButton/ActionButton.tsx';

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

const OpenOffcanvas = (args: OffcanvasProps) => {
    const portalElement = usePortalElement();
    const [state, setState] = useState({
        visible: false,
    });

    const showOffcanvas = (visible: boolean) => setState((prev) => ({ ...prev, visible }));

    return (
        <div className="page">
            <ActionButton title='Show' onClick={() => showOffcanvas(true)} />
            <Offcanvas
                {...args}
                closed={!state.visible}
                onClosed={() => showOffcanvas(false)}
                container={portalElement}
            />
        </div>
    );
};

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
