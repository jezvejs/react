import { isFunction } from '@jezvejs/types';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import { Menu, MenuHelpers, MenuProps } from '../Menu/Menu.tsx';

import { useEmptyClick } from '../../hooks/useEmptyClick/useEmptyClick.ts';
import { usePopupPosition } from '../../hooks/usePopupPosition/usePopupPosition.ts';
import { PopupPosition } from '../../hooks/usePopupPosition/PopupPosition.ts';

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

const menuProps = MenuProps.getDefaultProps();

export const PopupMenu = (p) => {
    const props = {
        ...menuProps,
        ...defaultProps,
        ...p,
        position: {
            ...menuProps.position,
            ...defaultProps.position,
            ...(p?.position ?? {}),
            updateProps: {
                ...(menuProps.position?.updateProps ?? {}),
                ...(defaultProps.position?.updateProps ?? {}),
                ...(p?.position?.updateProps ?? {}),
            },
        },
    };

    const [state, setState] = useState({
        ...props,
        open: false,
        listenScroll: false,
    });

    const onToggle = () => {
        setState((prev) => ({
            ...prev,
            open: !prev.open,
        }));
    };

    const closeMenu = () => {
        setState((prev) => ({ ...prev, open: false }));
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
            setState((prev) => ({
                ...prev,
                listenScroll: true,
            }));
        },
    });

    function onScroll(e) {
        if (!state.hideOnScroll) {
            return;
        }

        if (!e.target.contains(elem.current)) {
            return;
        }

        // Ignore scroll of menu itself
        const listElem = isFunction(e.target.closest)
            ? e.target.closest('.popup-menu-list')
            : null;
        if (listElem === elem.current) {
            return;
        }

        closeMenu();
    }

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

        window.removeEventListener('scroll', onScroll, { passive: true, capture: true });
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
                elem.current.focus();
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

PopupMenu.propTypes = {
    ...Menu.propTypes,
    toggleOnClick: PropTypes.bool,
    hideOnScroll: PropTypes.bool,
    hideOnSelect: PropTypes.bool,
    position: PropTypes.shape({
        ...PopupPosition.propTypes,
    }),
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
    container: PropTypes.object,
};
