// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { useState } from 'react';
import { Offcanvas } from '@jezvejs/react';

import { usePortalElement } from '../../hooks/usePortalElement.jsx';
import { ActionButton } from '../../Components/ActionButton/ActionButton.jsx';

import './Offcanvas.stories.scss';

export default {
    title: 'Components/Offcanvas',
    component: Offcanvas,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

const OpenOffcanvas = (args) => {
    const portalElement = usePortalElement();
    const [state, setState] = useState({
        visible: false,
    });

    const showOffcanvas = (visible) => setState((prev) => ({ ...prev, visible }));

    return (
        <>
            <ActionButton title='Show' onClick={() => showOffcanvas(true)} />
            <Offcanvas
                {...args}
                closed={!state.visible}
                onClosed={() => showOffcanvas(false)}
                container={portalElement}
            />
        </>
    );
};

export const Default = {
    args: {
        children: 'Offcanvas value',
    },
    render: OpenOffcanvas,
};

export const Right = {
    args: {
        children: 'Offcanvas value',
        placement: 'right',
    },
    render: OpenOffcanvas,
};

export const Top = {
    args: {
        children: 'Offcanvas value',
        placement: 'top',
    },
    render: OpenOffcanvas,
};

export const Bottom = {
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
export const Scroll = {
    args: {
        children: 'Offcanvas value',
        useScrollLock: false,
    },
    render: OpenOffcanvas,
};
