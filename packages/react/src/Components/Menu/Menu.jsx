import {
    useState,
    useRef,
    forwardRef,
    useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { MenuCheckbox } from './components/Checkbox/MenuCheckbox.jsx';
import { MenuList } from './components/List/MenuList.jsx';
import { MenuSeparator } from './components/Separator/MenuSeparator.jsx';
import { MenuGroupHeader } from './components/GroupHeader/MenuGroupHeader.jsx';
import { MenuGroupItem } from './components/GroupItem/MenuGroupItem.jsx';
import { MenuItem } from './components/ListItem/MenuItem.jsx';

import * as MenuHelpers from './helpers.js';
import './Menu.scss';

export {
    MenuList,
    MenuItem,
    MenuSeparator,
    MenuCheckbox,
    MenuGroupHeader,
    MenuGroupItem,
    // utils
    MenuHelpers,
};

const {
    findLastMenuItem,
    findMenuItem,
    forItems,
    getActiveItem,
    getClosestItemElement,
    getItemById,
    getNextItem,
    getPreviousItem,
    isAvailableItem,
    isCheckbox,
    toggleSelectItem,
} = MenuHelpers;

/**
 * Menu component
 */
// eslint-disable-next-line react/display-name
export const Menu = forwardRef((props, ref) => {
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

    const innerRef = useRef(null);
    useImperativeHandle(ref, () => innerRef.current);

    const disableTouch = () => (
        setState((prev) => ({ ...prev, ignoreTouch: true }))
    );

    const enableTouch = () => (
        setState((prev) => ({ ...prev, ignoreTouch: false }))
    );

    const handleFocus = (e) => {
        if (innerRef?.current === e?.target) {
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
        if (!innerRef?.current) {
            return;
        }
        if (e?.relatedTarget && innerRef.current.contains(e.relatedTarget)) {
            return;
        }

        setState((prev) => ({
            ...prev,
            activeItem: null,
        }));
    };

    const handleTouchStart = (e) => {
        if (e.touches) {
            disableTouch();
        }
    };

    const activateItem = (itemId) => {
        if (!innerRef?.current) {
            return;
        }

        const item = getItemById(itemId, state.items);
        if (!item) {
            return;
        }

        const focusOptions = { preventScroll: true };

        const itemEl = innerRef.current.querySelector(`.menu-item[data-id="${itemId}"]`);
        if (!itemEl) {
            return;
        }

        if (item.type === 'group' && state.allowActiveGroupHeader) {
            const { GroupHeader } = state.components;
            const groupHeader = itemEl?.querySelector(GroupHeader?.selector);
            groupHeader?.focus(focusOptions);
        } else {
            itemEl.focus(focusOptions);
        }
    };

    const scrollToItem = () => {
        if (!innerRef?.current) {
            return;
        }

        const focused = document.activeElement;
        if (innerRef.current.contains(focused)) {
            focused.scrollIntoView({
                behavior: 'instant',
                block: 'nearest',
            });
        }
    };

    const handleMouseEnter = (itemId, e) => {
        if (state.ignoreTouch) {
            return;
        }

        if (itemId === null || itemId === state.activeItem) {
            return;
        }

        const item = getItemById(itemId, state.items);
        if (item.type === 'group') {
            if (!state.allowActiveGroupHeader) {
                return;
            }

            const { GroupHeader } = state.components;
            if (!e?.target.closest(GroupHeader?.selector)) {
                return;
            }
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

        if (!innerRef?.current) {
            return;
        }

        const focused = document.activeElement;
        if (innerRef.current.contains(focused)) {
            innerRef.current.focus({ preventScroll: true });
        }
    };

    const finishClick = (callback) => {
        if (state.ignoreTouch) {
            setTimeout(() => {
                handleMouseLeave();
                callback();
            });
        } else {
            enableTouch();
            callback();
        }
    };

    const toggleItem = (itemId) => {
        setState(toggleSelectItem(itemId));
    };

    const handleItemClick = (itemId, e) => {
        e?.stopPropagation();

        const clickedItem = getItemById(itemId, state.items);
        const type = clickedItem?.type ?? null;

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

        // Prevent navigation by link if needed
        if (
            state.preventNavigation
            && (type === 'link' || type === 'checkbox-link')
        ) {
            e?.preventDefault();
        }

        // Handle clicks by group header
        if (type === 'group') {
            const { GroupHeader } = state.components;
            if (!e?.target.closest(GroupHeader?.selector)) {
                return;
            }

            finishClick(() => (
                props.onGroupHeaderClick?.({
                    item: clickedItem,
                    e,
                    state,
                    setState,
                })
            ));
            return;
        }

        if (isCheckbox(clickedItem)) {
            toggleItem(itemId);
        }

        finishClick(() => props.onItemClick?.(clickedItem, e));
    };

    const handleKey = (e) => {
        const availCallback = (item) => props.isAvailableItem(item, state);
        const options = {
            includeGroupItems: state.allowActiveGroupHeader,
        };

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
                scrollToItem();

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
                scrollToItem();

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

    const { disabled } = props;
    let tabIndex = (props.tabThrough) ? -1 : (props.tabIndex ?? null);
    if (disabled) {
        tabIndex = null;
    }

    return (
        <div
            id={props.id}
            className={classNames('menu', className)}
            disabled={disabled}
            tabIndex={tabIndex}
            onFocusCapture={handleFocus}
            onBlurCapture={handleBlur}
            onTouchStartCapture={handleTouchStart}
            onKeyDownCapture={handleKey}
            onScrollCapture={handleScroll}
            ref={innerRef}
        >
            {menuHeader}
            {menuList}
            {menuFooter}
        </div>
    );
});

Menu.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    defaultItemType: PropTypes.string,
    iconAlign: PropTypes.oneOf(['left', 'right']),
    checkboxSide: PropTypes.oneOf(['left', 'right']),
    disabled: PropTypes.bool,
    tabThrough: PropTypes.bool,
    tabIndex: PropTypes.number,
    loopNavigation: PropTypes.bool,
    preventNavigation: PropTypes.bool,
    header: PropTypes.object,
    footer: PropTypes.object,
    onItemClick: PropTypes.func,
    isAvailableItem: PropTypes.func,
    onGroupHeaderClick: PropTypes.func,
    onItemActivate: PropTypes.func,
    allowActiveGroupHeader: PropTypes.bool,
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
        GroupHeader: PropTypes.func,
        GroupItem: PropTypes.func,
        Footer: PropTypes.func,
    }),
};

Menu.defaultProps = {
    defaultItemType: 'button',
    iconAlign: 'left',
    checkboxSide: 'left',
    disabled: false,
    tabThrough: true,
    tabIndex: 0,
    loopNavigation: true,
    preventNavigation: false,
    header: null,
    footer: null,
    onItemClick: null,
    isAvailableItem,
    onGroupHeaderClick: null,
    renderNotSelected: false,
    allowActiveGroupHeader: false,
    items: [],
    components: {
        Header: null,
        List: MenuList,
        ListItem: MenuItem,
        ListPlaceholder: null,
        Check: MenuCheckbox,
        Separator: MenuSeparator,
        GroupHeader: MenuGroupHeader,
        GroupItem: MenuGroupItem,
        Footer: null,
    },
};
