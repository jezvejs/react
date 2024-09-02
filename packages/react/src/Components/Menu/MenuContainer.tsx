import {
    useRef,
    forwardRef,
    useImperativeHandle,
    useEffect,
    useMemo,
    useCallback,
} from 'react';
import classNames from 'classnames';

import { useStore } from '../../utils/Store/StoreProvider.tsx';

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
    mapItems,
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
} = MenuHelpers;

const defaultProps = MenuDefProps.getDefaultProps();

/**
 * Menu container component
 */
// eslint-disable-next-line react/display-name
export const MenuContainer = forwardRef<MenuRef, MenuProps>((p, ref) => {
    const props = {
        ...defaultProps,
        ...p,
        components: {
            ...defaultProps.components,
            ...(p?.components ?? {}),
        },
    };

    const store = useStore()!;
    const { getState, setState } = store;

    const innerRef = useRef<HTMLDivElement | null>(null);
    useImperativeHandle<MenuRef, MenuRef>(ref, () => innerRef?.current);

    const disableTouch = () => (
        setState((prev: MenuState) => ({ ...prev, ignoreTouch: true }))
    );

    const enableTouch = () => (
        setState((prev: MenuState) => ({ ...prev, ignoreTouch: false }))
    );

    const setActive = (itemId: string | null) => {
        setState((prev: MenuState) => (
            (prev.activeItem === itemId)
                ? prev
                : {
                    ...prev,
                    items: mapItems(
                        prev.items ?? [],
                        (item) => (
                            (item.active !== (item.id === itemId))
                                ? { ...item, active: !item.active }
                                : item
                        ),
                        { includeGroupItems: prev.allowActiveGroupHeader },
                    ),
                    activeItem: itemId,
                }
        ));
    };

    /**
     * Captured 'focus' event handler
     * @param {React.FocusEvent} e
     */
    const onFocus = (e: React.FocusEvent) => {
        const target = e?.target as HTMLElement;
        if (innerRef?.current === target) {
            return;
        }

        const st = getState() as MenuState;
        const selector = getItemSelector(st);
        const closestElem = getClosestItemElement(target, selector);
        const itemId = closestElem?.dataset?.id ?? null;

        setActive(itemId);
    };

    /**
     * Captured 'blur' event handler
     * @param {React.FocusEvent} e
     */
    const onBlur = (e: React.FocusEvent) => {
        if (!innerRef?.current) {
            return;
        }
        if (e?.relatedTarget && innerRef.current.contains(e.relatedTarget as HTMLElement)) {
            return;
        }

        setActive(null);
    };

    /**
     * Captured 'touchstart' event handler
     * @param {React.FocusEvent} e
     */
    const onTouchStart = (e: React.TouchEvent) => {
        if (e.touches) {
            disableTouch();
        }
    };

    const activateItem = (itemId: string | null) => {
        if (!innerRef?.current) {
            return;
        }

        const st = getState() as MenuState;
        const item = getItemById(itemId, st.items ?? []);
        if (!item) {
            return;
        }

        const focusOptions = { preventScroll: true };

        const itemEl = innerRef.current.querySelector(`.menu-item[data-id="${itemId}"]`) as HTMLElement;
        if (!itemEl) {
            return;
        }

        if (item.type === 'group' && st.allowActiveGroupHeader) {
            const { GroupHeader } = st.components ?? {};
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

    /**
     * 'mouseenter' and 'mouseover' events handler
     * @param {string | null} itemId
     * @param {React.MouseEvent} e
     */
    const onMouseEnter = useCallback((itemId: string | null, e: React.MouseEvent) => {
        const st = getState() as MenuState;
        if (
            st.ignoreTouch
            || !st.focusItemOnHover
        ) {
            return;
        }

        if (itemId === null || itemId === st.activeItem) {
            return;
        }

        const item = getItemById(itemId, st.items ?? []);
        if (item?.type === 'group') {
            if (!st.allowActiveGroupHeader) {
                return;
            }

            const target = e?.target as HTMLElement;

            const { GroupHeader } = st.components ?? {};
            if (
                GroupHeader
                && GroupHeader?.selector
                && !target.closest(GroupHeader?.selector)
            ) {
                return;
            }
        }

        setActive(itemId);

        activateItem(itemId);
    }, []);

    /**
     * 'mouseleave' and 'mouseout' events handler
     * @param relItemId
     */
    const onMouseLeave = useCallback((relItemId?: string | null) => {
        const st = getState() as MenuState;
        if (
            st.activeItem === null
            || (st.activeItem === relItemId)
        ) {
            return;
        }

        setActive(null);

        if (!innerRef?.current) {
            return;
        }

        const focused = document.activeElement;
        if (innerRef.current.contains(focused)) {
            innerRef.current.focus({ preventScroll: true });
        }
    }, []);

    const cancelClick = () => {
        const st = getState() as MenuState;
        if (st.ignoreTouch) {
            setTimeout(() => {
                onMouseLeave();
                enableTouch();
            });
        }
    };

    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        cancelClick();
    };

    const finishClick = (callback: () => void) => {
        const st = getState() as MenuState;
        if (st.ignoreTouch) {
            setTimeout(() => {
                onMouseLeave();
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

        setState((prev: MenuState) => toggleSelectItem(prev, itemId));
    };

    /**
     * Item click event handler
     * @param itemId
     * @param e
     */
    const onItemClick = useCallback((
        itemId: string | null,
        e: React.MouseEvent | React.KeyboardEvent<Element>,
    ) => {
        e?.stopPropagation();

        const st = getState() as MenuState;
        const clickedItem = getItemById(itemId, st.items ?? []);
        if (!clickedItem) {
            return;
        }

        const type = clickedItem.type ?? null;

        if (
            st.activeItem
            && st.activeItem !== itemId
            && !st.ignoreTouch
        ) {
            setActive(itemId);
        }

        // Prevent navigation by link if needed
        if (
            st.preventNavigation
            && (type === 'link' || type === 'checkbox-link')
        ) {
            e?.preventDefault();
        }

        // Handle clicks by group header
        if (type === 'group') {
            const { GroupHeader } = st.components ?? {};
            const selector = GroupHeader?.selector ?? null;
            const target = e?.target as HTMLElement;
            if (selector !== null && !target.closest(selector)) {
                return;
            }

            finishClick(() => {
                const clickParams: OnGroupHeaderClickParam = {
                    item: clickedItem,
                    e,
                    state: st,
                    setState,
                };

                return props.onGroupHeaderClick?.(clickParams);
            });
            return;
        }

        toggleItem(itemId);

        finishClick(() => props.onItemClick?.(clickedItem, e));
    }, []);

    const onKeyDown = (e: React.KeyboardEvent) => {
        const st = getState() as MenuState;

        const availCallback = (item: MenuItemProps): boolean => (
            props.isAvailableItem?.(item, st) ?? true
        );

        const options = {
            includeGroupItems: st.allowActiveGroupHeader,
        };

        const menuItems = st.items ?? [];

        if (e.code === 'ArrowDown' || e.code === 'ArrowRight') {
            const activeItem = getActiveItem(st);
            let nextItem = (activeItem)
                ? getNextItem(activeItem.id, menuItems, availCallback, options)
                : findMenuItem(menuItems, availCallback);

            if (st.loopNavigation && activeItem && !nextItem) {
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
            const activeItem = getActiveItem(st);
            let nextItem = (activeItem)
                ? getPreviousItem(activeItem.id, menuItems, availCallback, options)
                : findLastMenuItem(menuItems, availCallback);

            if (st.loopNavigation && activeItem && !nextItem) {
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
            if (st.activeItem) {
                onItemClick(st.activeItem, e);
            }

            e.preventDefault();
        }
    };

    const onScroll = () => {
    };

    useEffect(() => {
        setState((prev: MenuState) => ({
            ...prev,
            items: mapItems(
                createItems(props.items, prev),
                (item) => (
                    (item.active !== (item.id === props.activeItem))
                        ? { ...item, active: !item.active }
                        : item
                ),
                { includeGroupItems: prev.allowActiveGroupHeader },
            ),
            activeItem: props.activeItem,
        }));
    }, [props.items, props.activeItem]);

    // Prepare alignment before and after item content
    const columns = useMemo(() => {
        const st = getState() as MenuState;
        const res = {
            beforeContent: false,
            afterContent: false,
        };

        const flatItems = toFlatList(st.items ?? [], {
            includeGroupItems: st.allowActiveGroupHeader,
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

            const isLeftCheckbox = (st.checkboxSide === 'left' || item.checkboxSide === 'left');
            const isLeftIcon = (st.iconAlign === 'left' || item.iconAlign === 'left');
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

    const { Header, Footer, List } = (getState() as MenuState).components ?? {};

    const menuHeader = Header && (
        <Header {...(props.header ?? {})} />
    );

    const state = getState() as MenuState;
    const menuList = useMemo(() => {
        const st = getState() as MenuState;

        const { ...rest } = st;
        delete rest.className;

        const listProps = {
            ...rest,
            ...columns,
            id: st.id!,
            items: st.items ?? [],
            getItemProps: MenuHelpers.getItemProps,
            onItemClick,
            onMouseEnter,
            onMouseLeave,
        };

        listProps.itemSelector = listProps.components?.ListItem?.selector ?? null;

        return List && (
            <List {...listProps} />
        );
    }, [state.items, state.activeItem]);

    const menuFooter = Footer && (
        <Footer {...(props.footer ?? {})} />
    );

    const menuProps = useMemo(() => {
        const st = getState() as MenuState;
        const { disabled } = props;
        let tabIndex: number | null = (props.tabThrough) ? -1 : (props.tabIndex ?? null);
        if (disabled) {
            tabIndex = null;
        }

        const res: MenuAttrs = {
            id: props.id,
            className: classNames('menu', st.className),
            disabled,
            onFocusCapture: onFocus,
            onBlurCapture: onBlur,
            onTouchStartCapture: onTouchStart,
            onKeyDownCapture: onKeyDown,
            onScrollCapture: onScroll,
            onContextMenuCapture: onContextMenu,
            tabIndex: tabIndex ?? -1,
        };

        if (props.parentId) {
            res['data-parent'] = props.parentId;
        }

        return res;
    }, [props.tabThrough, props.tabIndex, props.id, props.disabled, props.parentId]);

    return (
        <div {...menuProps} ref={innerRef} >
            {menuHeader}
            {menuList}
            {menuFooter}
        </div>
    );
});
