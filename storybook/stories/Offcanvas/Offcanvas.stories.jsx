// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { Offcanvas } from '@jezvejs/react';
import './Offcanvas.stories.scss';
import { useMemo, useState } from 'react';
import { ActionButton } from '../../Components/ActionButton/ActionButton.jsx';

export default {
    title: 'Components/Offcanvas',
    component: Offcanvas,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

const OpenOffcanvas = (args) => {
    const portalElement = useMemo(() => (
        document.getElementById('custom-root')
    ), []);
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
