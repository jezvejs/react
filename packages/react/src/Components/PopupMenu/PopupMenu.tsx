import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import {
    Menu,
    MenuHelpers,
    MenuDefProps,
} from '../Menu/Menu.tsx';

import { useEmptyClick } from '../../hooks/useEmptyClick/useEmptyClick.ts';
import { usePopupPosition } from '../../hooks/usePopupPosition/usePopupPosition.ts';

import { PopupMenuProps, PopupMenuState } from './types.ts';
import './PopupMenu.scss';

const defaultProps = {
    toggleOnClick: true,
    hideOnScroll: true,
    hideOnSelect: true,
    fixed: true,
    position: {
        allowChangeAxis: true,
        updateProps: {
            scrollOnOverflow: false,
        },
    },
};

const menuProps = MenuDefProps.getDefaultProps();

export const PopupMenu = (p: PopupMenuProps) => {
    const props = {
        ...menuProps,
        ...defaultProps,
        ...p,
        position: {
            ...defaultProps.position,
            ...(p?.position ?? {}),
            updateProps: {
                ...(defaultProps.position?.updateProps ?? {}),
                ...(p?.position?.updateProps ?? {}),
            },
        },
    };

    const [state, setState] = useState<PopupMenuState>({
        ...props,
        open: false,
        listenScroll: false,
    });

    const onToggle = () => {
        setState((prev: PopupMenuState) => ({
            ...prev,
            open: !prev.open,
        }));
    };

    const closeMenu = () => {
        setState((prev: PopupMenuState) => ({ ...prev, open: false }));
    };

    const {
        referenceRef,
        elementRef,
        elem,
        reference,
    } = usePopupPosition({
        ...state.position,
        open: state.open,
        onScrollDone: () => {
            setState((prev: PopupMenuState) => ({
                ...prev,
                listenScroll: true,
            }));
        },
    });

    const onScroll = (e: Event) => {
        if (!state.hideOnScroll) {
            return;
        }

        const target = e.target as HTMLElement;
        if (!target.contains(elem.current as HTMLElement)) {
            return;
        }

        // Ignore scroll of menu itself
        const listElem = (typeof target.closest === 'function')
            ? target.closest('.popup-menu-list')
            : null;
        if (listElem === elem.current) {
            return;
        }

        closeMenu();
    };

    const addScrollListener = () => {
        if (state.open && state.listenScroll) {
            window.addEventListener('scroll', onScroll, { passive: true, capture: true });
        }
    };

    const removeScrollListener = () => {
        if (!state.listenScroll) {
            return;
        }

        setState((prev) => ({
            ...prev,
            listenScroll: false,
        }));

        window.removeEventListener('scroll', onScroll, { capture: true });
    };

    const onItemClick = (item) => {
        if (MenuHelpers.isCheckbox(item)) {
            setState(MenuHelpers.toggleSelectItem(item.id));
        }

        if (props.hideOnSelect) {
            removeScrollListener();
            closeMenu();
        }
    };

    useEffect(() => {
        if (state.open) {
            addScrollListener();

            if (state.listenScroll) {
                elem.current?.focus();
            }
        } else {
            removeScrollListener();
        }

        return () => {
            removeScrollListener();
        };
    }, [state.open, state.listenScroll]);

    useEmptyClick(() => {
        closeMenu();
    }, [elem, reference], state.open);

    useEffect(() => {
        setState((prev) => ({
            ...prev,
            items: MenuHelpers.createItems(props.items, prev),
            activeItem: props.activeItem,
        }));
    }, [props.items, props.activeItem]);

    if (!props.children) {
        return null;
    }

    const container = props.container ?? document.body;

    const popup = <Menu
        {...state}
        className="popup-menu-list"
        onItemClick={onItemClick}
        ref={elementRef}
    />;

    return (
        <>
            <div ref={referenceRef} onClick={onToggle} >
                {props.children}
            </div>
            {state.open && !state.fixed && popup}
            {state.open && state.fixed && (
                createPortal(popup, container)
            )}
        </>
    );
};
