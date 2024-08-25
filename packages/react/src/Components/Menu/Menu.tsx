import {
    useState,
    useRef,
    forwardRef,
    useImperativeHandle,
    useEffect,
    useMemo,
} from 'react';
import classNames from 'classnames';

import { MenuCheckbox } from './components/Checkbox/MenuCheckbox.tsx';
import { MenuList } from './components/List/MenuList.tsx';
import { MenuSeparator } from './components/Separator/MenuSeparator.tsx';
import { MenuGroupHeader } from './components/GroupHeader/MenuGroupHeader.tsx';
import { MenuGroupItem } from './components/GroupItem/MenuGroupItem.tsx';
import { MenuItem } from './components/ListItem/MenuItem.tsx';

import * as MenuDefProps from './defaultProps.ts';
import * as MenuHelpers from './helpers.ts';
import {
    MenuAttrs,
    MenuItemProps,
    MenuProps,
    MenuState,
    OnGroupHeaderClickParam,
} from './types.ts';
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
    MenuDefProps,
};

type MenuRef = HTMLDivElement | null;

const {
    findLastMenuItem,
    findMenuItem,
    toFlatList,
    getActiveItem,
    getItemSelector,
    getClosestItemElement,
    getItemById,
    getNextItem,
    getPreviousItem,
    isCheckbox,
    toggleSelectItem,
    createItems,
    getInitialState,
} = MenuHelpers;

const defaultProps = MenuDefProps.getDefaultProps();

/**
 * Menu component
 */
// eslint-disable-next-line react/display-name
export const Menu = forwardRef<MenuRef, MenuProps>((p, ref) => {
    const props = {
        ...defaultProps,
        ...p,
        components: {
            ...defaultProps.components,
            ...(p?.components ?? {}),
        },
    };

    const initial = getInitialState(props, defaultProps);
    const [state, setState] = useState<MenuState>(initial);

    const innerRef = useRef<HTMLDivElement | null>(null);
    useImperativeHandle<MenuRef, MenuRef>(ref, () => innerRef?.current);

    const disableTouch = () => (
        setState((prev: MenuState) => ({ ...prev, ignoreTouch: true }))
    );

    const enableTouch = () => (
        setState((prev: MenuState) => ({ ...prev, ignoreTouch: false }))
    );

    const handleFocus = (e: React.FocusEvent) => {
        const target = e?.target as HTMLElement;
        if (innerRef?.current === target) {
            return;
        }

        const selector = getItemSelector(state);
        const closestElem = getClosestItemElement(target, selector);
        const itemId = closestElem?.dataset?.id ?? null;

        if (state.activeItem === itemId) {
            return;
        }

        setState((prev: MenuState) => ({
            ...prev,
            activeItem: itemId,
        }));
    };

    const handleBlur = (e: React.FocusEvent) => {
        if (!innerRef?.current) {
            return;
        }
        if (e?.relatedTarget && innerRef.current.contains(e.relatedTarget as HTMLElement)) {
            return;
        }

        setState((prev: MenuState) => ({
            ...prev,
            activeItem: null,
        }));
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches) {
            disableTouch();
        }
    };

    const activateItem = (itemId: string | null) => {
        if (!innerRef?.current) {
            return;
        }

        const item = getItemById(itemId, state.items ?? []);
        if (!item) {
            return;
        }

        const focusOptions = { preventScroll: true };

        const itemEl = innerRef.current.querySelector(`.menu-item[data-id="${itemId}"]`) as HTMLElement;
        if (!itemEl) {
            return;
        }

        if (item.type === 'group' && state.allowActiveGroupHeader) {
            const { GroupHeader } = state.components ?? {};
            const selector = GroupHeader?.selector ?? null;
            const groupHeader = (selector)
                ? (itemEl?.querySelector(selector) as HTMLElement ?? null)
                : null;
            groupHeader?.focus(focusOptions);
        } else {
            itemEl.focus(focusOptions);
        }

        props.onItemActivate?.(itemId);
    };

    const scrollToItem = () => {
        if (!innerRef?.current) {
            return;
        }

        const focused = document.activeElement;
        if (innerRef.current.contains(focused)) {
            focused?.scrollIntoView?.({
                behavior: 'instant',
                block: 'nearest',
            });
        }
    };

    const handleMouseEnter = (itemId: string | null, e: React.MouseEvent) => {
        if (
            state.ignoreTouch
            || !state.focusItemOnHover
        ) {
            return;
        }

        if (itemId === null || itemId === state.activeItem) {
            return;
        }

        const item = getItemById(itemId, state.items ?? []);
        if (item?.type === 'group') {
            if (!state.allowActiveGroupHeader) {
                return;
            }

            const target = e?.target as HTMLElement;

            const { GroupHeader } = state.components ?? {};
            if (GroupHeader && !target.closest(GroupHeader?.selector)) {
                return;
            }
        }

        setState((prev: MenuState) => ({
            ...prev,
            activeItem: itemId,
        }));

        activateItem(itemId);
    };

    const handleMouseLeave = (relItemId?: string | null) => {
        if (
            state.activeItem === null
            || (state.activeItem === relItemId)
        ) {
            return;
        }

        setState((prev: MenuState) => ({
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

    const cancelClick = () => {
        if (state.ignoreTouch) {
            setTimeout(() => {
                handleMouseLeave();
                enableTouch();
            });
        }
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        cancelClick();
    };

    const finishClick = (callback: () => void) => {
        if (state.ignoreTouch) {
            setTimeout(() => {
                handleMouseLeave();
                enableTouch();
                callback();
            });
        } else {
            callback();
        }
    };

    const toggleItem = (itemId: string | null) => {
        if (itemId === null) {
            return;
        }

        setState((prev) => toggleSelectItem(prev, itemId));
    };

    const handleItemClick = (
        itemId: string | null,
        e: React.MouseEvent | React.KeyboardEvent<Element>,
    ) => {
        e?.stopPropagation();

        const clickedItem = getItemById(itemId, state.items ?? []);
        if (!clickedItem) {
            return;
        }

        const type = clickedItem.type ?? null;

        if (
            state.activeItem
            && state.activeItem !== itemId
            && !state.ignoreTouch
        ) {
            setState((prev: MenuState) => ({
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
            const { GroupHeader } = state.components ?? {};
            const selector = GroupHeader?.selector ?? null;
            const target = e?.target as HTMLElement;
            if (selector !== null && !target.closest(selector)) {
                return;
            }

            finishClick(() => {
                const clickParams: OnGroupHeaderClickParam = {
                    item: clickedItem,
                    e,
                    state,
                    setState,
                };

                return props.onGroupHeaderClick?.(clickParams);
            });
            return;
        }

        toggleItem(itemId);

        finishClick(() => props.onItemClick?.(clickedItem, e));
    };

    const handleKey = (e: React.KeyboardEvent) => {
        const availCallback = (item: MenuItemProps): boolean => (
            props.isAvailableItem?.(item, state) ?? true
        );

        const options = {
            includeGroupItems: state.allowActiveGroupHeader,
        };

        const menuItems = state.items ?? [];

        if (e.code === 'ArrowDown' || e.code === 'ArrowRight') {
            const activeItem = getActiveItem(state);
            let nextItem = (activeItem)
                ? getNextItem(activeItem.id, menuItems, availCallback, options)
                : findMenuItem(menuItems, availCallback);

            if (state.loopNavigation && activeItem && !nextItem) {
                nextItem = findMenuItem(menuItems, availCallback);
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
                ? getPreviousItem(activeItem.id, menuItems, availCallback, options)
                : findLastMenuItem(menuItems, availCallback);

            if (state.loopNavigation && activeItem && !nextItem) {
                nextItem = findLastMenuItem(menuItems, availCallback);
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

    useEffect(() => {
        setState((prev: MenuState) => ({
            ...prev,
            items: createItems(props.items, prev),
            activeItem: props.activeItem,
        }));
    }, [props.items, props.activeItem]);

    // Prepare alignment before and after item content
    const columns = useMemo(() => {
        const res = {
            beforeContent: false,
            afterContent: false,
        };

        const flatItems = toFlatList(state.items ?? [], {
            includeGroupItems: state.allowActiveGroupHeader,
        });

        for (let index = 0; index < flatItems.length; index += 1) {
            const item = flatItems[index];
            const checkbox = isCheckbox(item);
            if (item.before) {
                res.beforeContent = true;
            }
            if (item.after) {
                res.afterContent = true;
            }
            if (!item.icon && !checkbox) {
                continue;
            }

            const isLeftCheckbox = (state.checkboxSide === 'left' || item.checkboxSide === 'left');
            const isLeftIcon = (state.iconAlign === 'left' || item.iconAlign === 'left');
            if (
                (checkbox && isLeftCheckbox)
                || (item.icon && isLeftIcon)
            ) {
                res.beforeContent = true;
            } else {
                res.afterContent = true;
            }

            if (res.beforeContent && res.afterContent) {
                break;
            }
        }

        return res;
    }, [props.items]);

    const { Header, Footer, List } = state.components ?? {};

    const menuHeader = Header && (
        <Header {...(props.header ?? {})} />
    );

    const { className, ...rest } = state;
    const listProps = {
        ...rest,
        ...columns,
        id: state.id!,
        items: state.items ?? [],
        getItemProps: MenuHelpers.getItemProps,
        onItemClick: handleItemClick,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
    };

    listProps.itemSelector = listProps.components?.ListItem?.selector ?? null;

    const menuList = useMemo(() => (
        List && (
            <List {...listProps} />
        )
    ), [state.items, state.activeItem]);

    const menuFooter = Footer && (
        <Footer {...(props.footer ?? {})} />
    );

    const { disabled } = props;
    let tabIndex: number | null = (props.tabThrough) ? -1 : (props.tabIndex ?? null);
    if (disabled) {
        tabIndex = null;
    }

    const menuProps: MenuAttrs = {
        id: props.id,
        className: classNames('menu', className),
        disabled,

        onFocusCapture: handleFocus,
        onBlurCapture: handleBlur,
        onTouchStartCapture: handleTouchStart,
        onKeyDownCapture: handleKey,
        onScrollCapture: handleScroll,
        onContextMenuCapture: handleContextMenu,
    };

    if (tabIndex !== null) {
        menuProps.tabIndex = tabIndex;
    }

    if (props.parentId) {
        menuProps['data-parent'] = props.parentId;
    }

    return (
        <div {...menuProps} ref={innerRef} >
            {menuHeader}
            {menuList}
            {menuFooter}
        </div>
    );
});
