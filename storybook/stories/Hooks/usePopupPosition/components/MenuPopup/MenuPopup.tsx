import { usePopupPosition, UsePopupPositionProps } from '@jezvejs/react';
import { useState } from 'react';
import { MenuButton } from '../../../../../common/Components/MenuButton/MenuButton.tsx';
import { PopupContainer } from '../PopupContainer/PopupContainer.tsx';

export const MenuPopup: React.FC<UsePopupPositionProps> = (props) => {
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
