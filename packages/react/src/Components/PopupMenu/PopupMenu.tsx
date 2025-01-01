import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { createPortal } from 'react-dom';

import {
    Menu,
    MenuHelpers,
    MenuDefProps,
} from '../Menu/Menu.tsx';

import { useEmptyClick } from '../../hooks/useEmptyClick/useEmptyClick.ts';
import { usePopupPosition } from '../../hooks/usePopupPosition/usePopupPosition.ts';

import { MenuItemProps, MenuListProps } from '../Menu/types.ts';
import { useMenuStore } from '../Menu/hooks/useMenuStore.ts';

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
        scrollOnOverflow: false,
        allowResize: false,
        updateProps: {
            scrollOnOverflow: false,
            allowResize: false,
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

    const menuStore = useMenuStore({ ...props, id: props.parentId });

    const onToggle = () => {
        setState((prev: PopupMenuState) => ({
            ...prev,
            open: !prev.open,
            activeItem: (!prev.open && prev.parentId) ? prev.items[0].id : null,
        }));
    };

    const closeMenu = () => {
        setState((prev: PopupMenuState) => ({
            ...prev,
            open: false,
            activeItem: null,
        }));

        props.onClose?.();
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

    const onClosed = (id?: string) => {
        if (!id) {
            return;
        }

        setState((prev: PopupMenuState) => MenuHelpers.closeItemMenu(prev, id!));
        menuStore?.setState?.((prev: PopupMenuState) => MenuHelpers.closeItemMenu(prev, id!));

        setState((prev: PopupMenuState) => ({
            ...prev,
            activeItem: id ?? null,
        }));
    };

    const onScroll = (e: Event) => {
        if (!state.hideOnScroll) {
            e.stopPropagation();
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

    const onItemClick = useCallback((item: MenuItemProps) => {
        if (MenuHelpers.isCheckbox(item)) {
            setState((prev) => MenuHelpers.toggleSelectItem(prev, item.id));
        }

        handleHideOnSelect(item);
    }, []);

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
            open: props.open ?? false,
        }));
    }, [props.open]);

    const container = props.container ?? document.body;

    const containerProps = useMemo(() => ({
        getItemComponent: (item: MenuItemProps) => {
            if (item.type === 'parent') {
                return PopupMenuParentItem;
            }

            return null;
        },

        getItemProps: (item: MenuItemProps, st: MenuListProps) => ({
            ...MenuHelpers.getItemProps(item, st),
            container,
            position: (st as PopupMenuProps).position,
            handleHideOnSelect: () => handleHideOnSelect(),
            onClose: onClosed,
        }),

        onKeyDown: (e: React.KeyboardEvent) => {
            if (e.code === 'ArrowLeft') {
                e.preventDefault();
                e.stopPropagation();

                if (state.parentId) {
                    closeMenu();
                }

                return true;
            }

            if (e.code === 'Escape') {
                closeMenu();

                const target = e.target as HTMLElement;
                target?.blur();

                e.preventDefault();
                e.stopPropagation();

                return true;
            }

            return false;
        },
    }), []);

    const popup = useMemo(() => (
        <Menu
            {...state}
            {...containerProps}
            className="popup-menu-list"
            onItemClick={onItemClick}
            ref={elementRef}
        />
    ), [state, containerProps]);

    const onRefClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        onToggle();
    }, []);

    if (!props.children) {
        return null;
    }

    return (
        <>
            <div ref={referenceRef} onClickCapture={onRefClick} >
                {props.children}
            </div>
            {state.open && !state.fixed && popup}
            {state.open && state.fixed && (
                createPortal(popup, container)
            )}
        </>
    );
};
