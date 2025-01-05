import { ReactNode } from 'react';
import { PopupPositionProps } from '../../hooks/usePopupPosition/types.ts';
import { MenuItemProps, MenuProps } from '../Menu/types.ts';

export interface PopupMenuProps extends MenuProps {
    open?: boolean;
    fixed?: boolean;
    toggleOnClick?: boolean;
    hideOnScroll?: boolean;
    hideOnSelect?: boolean;
    hideOnEmptyClick?: boolean;
    position?: PopupPositionProps;
    children?: ReactNode;
    container?: Element | DocumentFragment;

    handleHideOnSelect?: ((item?: MenuItemProps | null) => void) | null;
    onOpen?: (() => void) | null;
    onClose?: (() => void) | null;
}

export interface PopupMenuState extends PopupMenuProps {
    open: boolean;
    listenScroll: boolean;
    ignoreTouch: boolean;
}

export interface PopupMenuParentItemProps extends MenuItemProps {
    open?: boolean;
    position?: PopupPositionProps;
    container?: Element | DocumentFragment;

    handleHideOnSelect?: ((item?: MenuItemProps | null) => void) | null;
    onOpen?: (() => void) | null;
    onClose?: ((id?: string, parentId?: string | null) => void) | null;
}

type WithSelector = {
    selector?: string;
};

export type PopupMenuParentItemComponent = React.FC<PopupMenuParentItemProps> & WithSelector;
