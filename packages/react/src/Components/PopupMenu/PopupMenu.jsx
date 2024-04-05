import { isFunction } from '@jezvejs/types';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import { Menu } from '../Menu/Menu.jsx';
import { usePopupPosition } from '../../hooks/usePopupPosition/usePopupPosition.js';
import { PopupPosition } from '../../hooks/usePopupPosition/PopupPosition.js';

import './PopupMenu.scss';

export const PopupMenu = (props) => {
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

    const { referenceRef, elementRef, elem } = usePopupPosition({
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

        setState((prev) => ({
            ...prev,
            open: false,
        }));
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

    useEffect(() => {
        if (state.open) {
            addScrollListener();
        } else {
            removeScrollListener();
        }

        return () => {
            removeScrollListener();
        };
    }, [state.open, state.listenScroll]);

    if (!props.children) {
        return null;
    }

    const container = props.container ?? document.body;

    const popup = <Menu
        {...state}
        className="popup-menu-list"
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

PopupMenu.defaultProps = {
    toggleOnClick: true,
    hideOnScroll: true,
    hideOnSelect: true,
    fixed: true,
    position: {
        ...PopupPosition.defaultProps,
        allowChangeAxis: true,
        updateProps: {
            scrollOnOverflow: false,
        },
    },
};
