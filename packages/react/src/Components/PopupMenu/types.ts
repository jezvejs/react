import { ReactNode } from 'react';
import { PopupPositionProps } from '../../hooks/usePopupPosition/types.ts';
import { MenuProps } from '../Menu/types.ts';

export interface PopupMenuProps extends MenuProps {
    fixed: boolean,
    toggleOnClick: boolean,
    hideOnScroll: boolean,
    hideOnSelect: boolean,
    position: PopupPositionProps,
    children: ReactNode,
    container: Element | DocumentFragment,
}

export interface PopupMenuState extends PopupMenuProps {
    open: boolean;
    listenScroll: boolean;
    ignoreTouch: boolean;
}
