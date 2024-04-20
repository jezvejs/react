import { usePopupPosition } from '@jezvejs/react';
import { useState } from 'react';

import { MenuButton } from '../../../../../Components/MenuButton/MenuButton.jsx';
import { PopupContainer } from '../PopupContainer/PopupContainer.jsx';

export const MenuPopup = (props) => {
    const [open, setOpen] = useState(false);

    const onToggle = () => {
        setOpen((prev) => !prev);
    };

    const { referenceRef, elementRef } = usePopupPosition({
        open,
        ...props,
    });

    return (
        <>
            <MenuButton ref={referenceRef} onClick={onToggle} />
            {open && (<PopupContainer ref={elementRef} />)}
        </>
    );
};
