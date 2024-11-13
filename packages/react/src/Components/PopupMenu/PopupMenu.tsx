import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import {
    Menu,
    MenuHelpers,
    MenuDefProps,
} from '../Menu/Menu.tsx';

import { useEmptyClick } from '../../hooks/useEmptyClick/useEmptyClick.ts';
import { usePopupPosition } from '../../hooks/usePopupPosition/usePopupPosition.ts';

import { MenuItemProps, MenuListProps } from '../Menu/types.ts';

import { PopupMenuParentItem } from './components/ChildItemContainer/PopupMenuParentItem.tsx';
import { PopupMenuProps, PopupMenuState } from './types.ts';
import './PopupMenu.scss';

const defaultProps = {
    toggleOnClick: true,
    hideOnScroll: true,
    hideOnSelect: true,
    hideOnEmptyClick: true,
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
        ignoreTouch: false,
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

    const handleHideOnSelect = (item: MenuItemProps | null = null) => {
        if (
            !props.hideOnSelect
            || (item && item.type === 'parent')
        ) {
            return;
        }

        removeScrollListener();
        closeMenu();

        props?.handleHideOnSelect?.();
    };

    const onItemClick = (item: MenuItemProps) => {
        if (MenuHelpers.isCheckbox(item)) {
            setState((prev) => MenuHelpers.toggleSelectItem(prev, item.id));
        }

        handleHideOnSelect(item);
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

    const closeMenuCached = useCallback(() => {
        closeMenu();
    }, []);

    useEmptyClick(
        closeMenuCached,
        [elem, reference],
        state.open && state.hideOnEmptyClick,
    );

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

    const containerProps = {
        getItemComponent: (item: MenuItemProps) => {
            if (item.type === 'parent') {
                return PopupMenuParentItem;
            }

            return null;
        },

        getItemProps: (item: MenuItemProps, st: MenuListProps) => {
            return {
                ...MenuHelpers.getItemProps(item, st),
                handleHideOnSelect: () => handleHideOnSelect(),
            };
        },

        onKeyDown: (e: React.KeyboardEvent) => {
            if (e.code === 'Escape') {
                closeMenu();

                const target = e.target as HTMLElement;
                target?.blur();

                return true;
            }

            return false;
        },
    };

    const popup = <Menu
        {...state}
        {...containerProps}
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
