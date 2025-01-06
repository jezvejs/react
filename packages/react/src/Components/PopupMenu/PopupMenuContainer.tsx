import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
} from 'react';
import { createPortal } from 'react-dom';

import {
    Menu,
    MenuHelpers,
    MenuDefProps,
} from '../Menu/Menu.tsx';

import { useEmptyClick } from '../../hooks/useEmptyClick/useEmptyClick.ts';
import { usePopupPosition } from '../../hooks/usePopupPosition/usePopupPosition.ts';

import { MenuItemProps, MenuListProps, MultiMenuState } from '../Menu/types.ts';
import { useMenuStore } from '../Menu/hooks/useMenuStore.ts';

import { PopupMenuParentItem } from './components/ChildItemContainer/PopupMenuParentItem.tsx';
import { PopupMenuProps, PopupMenuState } from './types.ts';
import * as PopupMenuHelpers from './helpers.ts';
import './PopupMenu.scss';

type PopupMenuRef = HTMLDivElement | null;

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

/**
 * Popup menu container component
 */
export const PopupMenuContainer = forwardRef<PopupMenuRef, PopupMenuProps>((p, ref) => {
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

    const { getState, setState } = useMenuStore<PopupMenuState, PopupMenuProps>(props);
    const state = getState();

    useEffect(() => {
        if (!props.id) {
            return;
        }

        setState({ ...props });
    }, []);

    const setActive = (itemId: string | null, parentId?: string | null) => {
        const updater = (prev: PopupMenuState) => MenuHelpers.setActiveItemById(prev, itemId);

        setState(updater);
        setState(updater, parentId);
    };

    const openItemMenu = (itemId: string | null) => {
        if (itemId === null) {
            return;
        }

        setState((prev: PopupMenuState) => PopupMenuHelpers.openItemMenu(prev, itemId));
        setState(
            (prev: MultiMenuState<PopupMenuState>) => MenuHelpers.openMenu(prev, itemId),
            null,
        );
    };

    const closeItemMenu = (itemId: string | null) => {
        if (itemId === null) {
            return;
        }

        setState((prev: PopupMenuState) => PopupMenuHelpers.closeItemMenu(prev, itemId));
        setState(
            (prev: MultiMenuState<PopupMenuState>) => MenuHelpers.closeMenu(prev, itemId),
            null,
        );
    };

    const onToggle = () => {
        setState((prev: PopupMenuState) => ({
            ...prev,
            open: !prev.open,
        }));

        setTimeout(() => {
            setActive(null);
        });
    };

    const openMenu = () => {
        setState((prev: PopupMenuState) => ({
            ...prev,
            open: true,
        }));

        setTimeout(() => {
            setActive(null);
        });

        props.onOpen?.();
    };

    const closeMenu = () => {
        const st = getState();
        const activeItem = MenuHelpers.getActiveItem(st);

        setState((prev: PopupMenuState) => ({
            ...prev,
            open: false,
        }));
        closeItemMenu(activeItem?.parentId ?? props.id ?? null);

        setTimeout(() => {
            setActive(null);
        });

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

    useImperativeHandle<PopupMenuRef, PopupMenuRef>(ref, () => (
        elem?.current as HTMLDivElement
    ));

    const onClosed = (id?: string, parentId?: string | null) => {
        if (!id) {
            return;
        }

        const updater = (prev: PopupMenuState) => PopupMenuHelpers.closeItemMenu(prev, id);

        setState(updater);
        setState(updater, parentId);

        setActive(id, parentId ?? undefined);
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
        const itemId = item?.id;

        if (MenuHelpers.isCheckbox(item)) {
            setState((prev: PopupMenuState) => MenuHelpers.toggleSelectItem(prev, itemId));
        }

        handleHideOnSelect(item);

        // Schedule a restoration of active item at parent menu after child menu opened
        if (item.type === 'parent') {
            setTimeout(() => {
                setActive(itemId);
            }, 50);
        }
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

    useEmptyClick(
        closeMenu,
        [elem, reference],
        state.open && state.hideOnEmptyClick,
    );

    const container = props.container ?? document.body;

    const containerProps = useMemo(() => ({
        useParentContext: true,

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
            const st = getState();
            const activeItem = MenuHelpers.getActiveItem(st);

            if (e.code === 'ArrowLeft') {
                e.preventDefault();
                e.stopPropagation();

                if (st.parentId) {
                    closeMenu();
                }

                return true;
            }

            if (e.code === 'ArrowRight') {
                e.preventDefault();
                e.stopPropagation();

                if (st.activeItem && activeItem?.type === 'parent') {
                    openItemMenu(activeItem.id);
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
        if (state.parentId) {
            openMenu();
            return;
        }

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
});

PopupMenuContainer.displayName = 'PopupMenuContainer';
