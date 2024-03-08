import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { MenuCheckbox } from './components/Checkbox/MenuCheckbox.jsx';
import { MenuList } from './components/List/MenuList.jsx';
import { MenuItem } from './components/ListItem/MenuItem.jsx';
import { MenuSeparator } from './components/Separator/MenuSeparator.jsx';

import {
    findLastMenuItem,
    findMenuItem,
    forItems,
    getActiveItem,
    getClosestItemElement,
    getItemById,
    getNextItem,
    getPreviousItem,
    isCheckbox,
    mapItems,
} from './helpers.js';
import './Menu.scss';

export {
    MenuList,
    MenuItem,
    MenuSeparator,
    MenuCheckbox,
};

/**
 * Menu component
 */
export const Menu = (props) => {
    const [state, setState] = useState({
        ...Menu.defaultProps,
        ...props,
        activeItem: null,
        ignoreTouch: false,
        components: {
            ...Menu.defaultProps.components,
            ...(props.components ?? {}),
        },
    });

    const ref = useRef(null);

    const handleFocus = (e) => {
        if (ref.current === e?.target) {
            return;
        }

        const closestElem = getClosestItemElement(e?.target, state);
        const itemId = closestElem?.dataset?.id ?? null;

        if (state.activeItem === itemId) {
            return;
        }

        setState((prev) => ({
            ...prev,
            activeItem: itemId,
        }));
    };

    const handleBlur = (e) => {
        if (e?.relatedTarget && ref.current.contains(e.relatedTarget)) {
            return;
        }

        setState((prev) => ({
            ...prev,
            activeItem: null,
        }));
    };

    const handleTouchStart = (e) => {
        if (e.touches) {
            setState((prev) => ({
                ...prev,
                ignoreTouch: true,
            }));
        }
    };

    const activateItem = (itemId) => {
        const itemEl = ref.current.querySelector(`.menu-item[data-id="${itemId}"]`);
        if (itemEl) {
            itemEl.focus({ preventScroll: true });
        }
    };

    const toggleSelectItem = (itemId) => {
        setState((prev) => ({
            ...prev,
            items: mapItems(state.items, (item) => ({
                ...item,
                selected: (
                    (item.id === itemId)
                        ? (!item.selected)
                        : item.selected
                ),
            })),
        }));
    };

    const handleMouseEnter = (itemId) => {
        if (state.ignoreTouch) {
            return;
        }

        if (itemId === null || itemId === state.activeItem) {
            return;
        }

        setState((prev) => ({
            ...prev,
            activeItem: itemId,
        }));

        activateItem(itemId);
    };

    const handleMouseLeave = (relItemId) => {
        if (
            state.activeItem === null
            || (state.activeItem === relItemId)
        ) {
            return;
        }

        setState((prev) => ({
            ...prev,
            activeItem: null,
        }));

        const focused = document.activeElement;
        if (ref.current.contains(focused)) {
            ref.current.focus({ preventScroll: true });
        }
    };

    const handleItemClick = (itemId, e) => {
        e?.stopPropagation();

        const clickedItem = getItemById(itemId, state.items);

        if (
            state.activeItem
            && state.activeItem !== itemId
            && !state.ignoreTouch
        ) {
            setState((prev) => ({
                ...prev,
                activeItem: itemId,
            }));
        }

        if (isCheckbox(clickedItem)) {
            toggleSelectItem(itemId);
        }

        if (state.ignoreTouch) {
            setTimeout(() => {
                handleMouseLeave();
                props.onItemClick?.(clickedItem, e);
            });
        } else {
            setState((prev) => ({
                ...prev,
                ignoreTouch: false,
            }));

            props.onItemClick?.(clickedItem, e);
        }
    };

    const isAvailableItem = (item) => (
        item
        && !item.hidden
        && !item.disabled
        && item.type !== 'separator'
    );

    const handleKey = (e) => {
        const availCallback = (item) => isAvailableItem(item, state);
        const options = {};

        if (e.code === 'ArrowDown' || e.code === 'ArrowRight') {
            const activeItem = getActiveItem(state);
            let nextItem = (activeItem)
                ? getNextItem(activeItem.id, state.items, availCallback, options)
                : findMenuItem(state.items, availCallback);

            if (state.loopNavigation && activeItem && !nextItem) {
                nextItem = findMenuItem(state.items, availCallback);
            }

            if (nextItem && (!activeItem || nextItem.id !== activeItem.id)) {
                activateItem(nextItem.id);

                e.preventDefault();
            }

            return;
        }

        if (e.code === 'ArrowUp' || e.code === 'ArrowLeft') {
            const activeItem = getActiveItem(state);
            let nextItem = (activeItem)
                ? getPreviousItem(activeItem.id, state.items, availCallback, options)
                : findLastMenuItem(state.items, availCallback);

            if (state.loopNavigation && activeItem && !nextItem) {
                nextItem = findLastMenuItem(state.items, availCallback);
            }

            if (nextItem && (!activeItem || nextItem.id !== activeItem.id)) {
                activateItem(nextItem.id);

                e.preventDefault();
            }

            return;
        }

        if (e.key === 'Enter') {
            if (state.activeItem) {
                handleItemClick(state.activeItem, e);
            }

            e.preventDefault();
        }
    };

    const handleScroll = () => {
    };

    // Prepare alignment before and after item content
    let beforeContent = false;
    let afterContent = false;

    forItems(state.items, (item) => {
        const checkbox = isCheckbox(item);
        if (!item.icon && !checkbox) {
            return;
        }

        if (
            (checkbox && (state.checkboxSide === 'left' || item.checkboxSide === 'left'))
            || (item.icon && (state.iconAlign === 'left' || item.iconAlign === 'left'))
        ) {
            beforeContent = true;
        } else {
            afterContent = true;
        }
    });

    const { Header, Footer, List } = state.components;
    const menuHeader = Header && <Header {...(state.header ?? {})} components={state.components} />;

    const { className, ...rest } = state;
    const listProps = {
        ...rest,
        beforeContent,
        afterContent,
        onItemClick: handleItemClick,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
    };

    listProps.itemSelector = listProps.components.ListItem.selector;

    const menuList = List && <List {...listProps} components={state.components} />;
    const menuFooter = Footer && <Footer {...(state.footer ?? {})} components={state.components} />;

    return (
        <div
            id={props.id}
            className={classNames('menu', className)}
            tabIndex={-1}
            onFocusCapture={handleFocus}
            onBlurCapture={handleBlur}
            onTouchStartCapture={handleTouchStart}
            onKeyDownCapture={handleKey}
            onScrollCapture={handleScroll}
            ref={ref}
        >
            {menuHeader}
            {menuList}
            {menuFooter}
        </div>
    );
};

Menu.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    iconAlign: PropTypes.oneOf(['left', 'right']),
    checkboxSide: PropTypes.oneOf(['left', 'right']),
    loopNavigation: PropTypes.bool,
    header: PropTypes.object,
    footer: PropTypes.object,
    onItemClick: PropTypes.func,
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        type: PropTypes.string,
        className: PropTypes.string,
        title: PropTypes.string,
        icon: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.elementType,
        ]),
    })),
    components: PropTypes.shape({
        Header: PropTypes.func,
        List: PropTypes.func,
        ListItem: PropTypes.func,
        ListPlaceholder: PropTypes.func,
        Check: PropTypes.func,
        Separator: PropTypes.func,
        Footer: PropTypes.func,
    }),
};

Menu.defaultProps = {
    iconAlign: 'left',
    checkboxSide: 'left',
    loopNavigation: true,
    header: null,
    footer: null,
    onItemClick: null,
    items: [],
    components: {
        Header: null,
        List: MenuList,
        ListItem: MenuItem,
        ListPlaceholder: null,
        Check: MenuCheckbox,
        Separator: MenuSeparator,
        Footer: null,
    },
};
