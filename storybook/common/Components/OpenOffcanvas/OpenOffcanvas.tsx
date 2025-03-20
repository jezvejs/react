import { useState } from 'react';
import { Offcanvas, OffcanvasProps } from '@jezvejs/react';

import { usePortalElement } from '../../hooks/usePortalElement.tsx';
import { ActionButton } from '../ActionButton/ActionButton.tsx';

import './OpenOffcanvas.scss';

export const OpenOffcanvas = (args: OffcanvasProps) => {
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
                className="offcanvas-demo"
                closed={!state.visible}
                onClosed={() => showOffcanvas(false)}
                container={portalElement}
            />
        </div>
    );
};
