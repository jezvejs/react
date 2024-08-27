import { removeEvents, setEvents, getCursorPos } from '@jezvejs/dom';
import React, {
    useRef,
    useEffect,
    forwardRef,
    useImperativeHandle,
    useCallback,
    CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';

// Utils
import { DebounceRunFunction, px } from '../../utils/common.ts';
import { ListenerFunctionsGroup, ListenersGroup } from '../../utils/types.ts';
import { useStore } from '../../utils/Store/StoreProvider.tsx';

// Common components
import { MenuHelpers } from '../Menu/Menu.tsx';
import { MenuItemProps, OnGroupHeaderClickParam } from '../Menu/types.ts';

// Common hooks
import { useDebounce } from '../../hooks/useDebounce/useDebounce.ts';
import { useEmptyClick } from '../../hooks/useEmptyClick/useEmptyClick.ts';
import { usePopupPosition } from '../../hooks/usePopupPosition/usePopupPosition.ts';

// Local components - Menu
import { DropDownMenuHeader } from './components/Menu/MenuHeader/MenuHeader.tsx';

import {
    isEditable,
    getAvailableItems,
    getPrevAvailableItem,
    getNextAvailableItem,
    getActiveItem,
    getSelectedItems,
    getVisibleItems,
} from './helpers.ts';
import { actions } from './reducer.ts';
import { SHOW_LIST_SCROLL_TIMEOUT } from './constants.ts';
import {
    DropDownMenuItemProps,
    DropDownMenuProps,
    DropDownNativeSelectProps,
    DropDownProps,
    DropDownSelectedItem,
    DropDownState,
} from './types.ts';

type DropDownRef = HTMLDivElement | null;

/**
 * DropDown component
 */
// eslint-disable-next-line react/display-name
export const DropDownContainer = forwardRef<
    DropDownRef,
    DropDownProps
>((props, ref) => {
    const store = useStore()!;
    const { getState, dispatch, setState } = store;
    const state = store.state as DropDownState;

    const innerRef = useRef<HTMLDivElement>(null);
    useImperativeHandle<DropDownRef, DropDownRef>(ref, () => (
        innerRef?.current
    ));

    const inputElem = useRef<HTMLInputElement | null>(null);
    const focusedElem = useRef<HTMLElement | null>(null);
    const selectElem = useRef<HTMLSelectElement | null>(null);

    const allowScrollAndResize = !state?.isTouch || !isEditable(state);

    let viewportEvents: ListenerFunctionsGroup | null = null;
    let windowEvents: ListenersGroup | null = null;
    let showListHandler: DebounceRunFunction | null = null;

    /** Returns true if fullscreen mode is enabled and active */
    const isFullScreen = () => (
        props.fullScreen
        && innerRef?.current
        && !innerRef.current.offsetParent
    );

    const setFullScreenContainerHeight = () => {
        const screenHeight = window.visualViewport?.height ?? 0;
        dispatch(actions.setFullScreenHeight(screenHeight));
    };

    /** Handles window 'scroll' and viewport 'resize' events */
    const onUpdatePosition = () => {
        if (state.waitForScroll) {
            showListHandler?.();
            return false;
        }

        if (
            !state.visible
            // || isVisible(selectElem, true)
        ) {
            return false;
        }

        if (isFullScreen()) {
            setFullScreenContainerHeight();
            return false;
        }

        return true;
    };

    const {
        referenceRef,
        elementRef,
        elem,
        reference,
        updatePosition,
    } = usePopupPosition({
        ...state?.position,

        margin: 5,
        screenPadding: 5,
        useRefWidth: true,
        scrollOnOverflow: allowScrollAndResize,
        allowResize: allowScrollAndResize,
        allowFlip: true,
        updateProps: () => ({
            scrollOnOverflow: false,
            allowResize: false,
        }),

        open: state.visible && !state.fullScreen,
        onScrollDone: () => dispatch(actions.startWindowListening()),
        onWindowScroll: () => onUpdatePosition(),
        onViewportResize: () => onUpdatePosition(),
    });

    /** Return index of selected item contains specified element */
    const getSelectedItemIndex = (el: HTMLElement) => {
        const SelectionItemComponent = state.components.MultiSelectionItem;
        const selector = SelectionItemComponent.selector ?? null;
        const selItemElem = (selector) ? (el?.closest(selector) as HTMLElement) : null;
        if (!selItemElem) {
            return -1;
        }

        const selectedItems = getSelectedItems(getState() as DropDownState);
        if (!Array.isArray(selectedItems)) {
            return -1;
        }

        return selectedItems.findIndex((item) => item.id === selItemElem.dataset.id);
    };

    /** Returns menu element if exists */
    const getContainer = () => innerRef?.current;

    /** Returns menu element if exists */
    const getMenu = (): HTMLElement | null => elem?.current ?? null;

    /** Returns current input element if exists */
    const getInput = (): HTMLElement | null => inputElem?.current;

    /** Returns current select element if exists */
    const getSelect = (): HTMLElement | null => selectElem?.current;

    /** Returns true if element is child of component */
    const isChildTarget = (target: HTMLElement): boolean => (
        !!target && !!((getContainer())?.contains(target))
    );

    /** Returns true if element is list or its child */
    const isMenuTarget = (target: HTMLElement): boolean => {
        const menuEl = getMenu();
        return (
            !!target
            && (
                target === menuEl
                || (menuEl?.contains(target) ?? false)
            )
        );
    };

    /** Returns true if element is input */
    const isInputTarget = (target: HTMLElement | null) => (
        target === getInput()
    );

    /** Returns true if element is main container */
    const isContainer = (target: HTMLElement | null) => (
        target === innerRef?.current
    );

    /** Returns true if element is clear button or its child */
    const isClearButtonTarget = (target: HTMLElement) => {
        const refEl = reference?.current ?? null;

        const btn = refEl?.closest?.('.dd__clear-btn');
        return target && (target === btn || btn?.contains(target));
    };

    /** Returns true if element is delete selection item button or its child */
    const isSelectionItemDeleteButtonTarget = (target: HTMLElement) => {
        const { MultiSelectionItem } = state.components;
        return target?.closest(`.${MultiSelectionItem.buttonClass}`);
    };

    /** Returns true if element is allowed to toggle menu list */
    const isValidToggleTarget = (target: HTMLElement) => (
        (typeof props.isValidToggleTarget !== 'function')
        || props.isValidToggleTarget(target)
    );

    /**
     * Returns true if component is containing specified element
     *
     * @param {Element} target
     * @returns {boolean}
     */
    const isChildElement = (target: Element): boolean => (
        !!target
        && (
            isChildTarget(target as HTMLElement)
            || isMenuTarget(target as HTMLElement)
        )
    );

    /**
     * Returns true if focus moved outside of component
     *
     * @param {FocusEvent} e event object
     * @returns {boolean}
     */
    const isLostFocus = (e: React.FocusEvent): boolean => (
        !isChildElement(e.relatedTarget as HTMLElement)
    );

    /** Returns selected items data for 'itemselect' and 'change' events */
    const getSelectionData = (): DropDownSelectedItem[] | DropDownSelectedItem | null => {
        const selectedItems = getSelectedItems(getState() as DropDownState)
            .map((item) => ({ id: item.id, value: item.title }));

        if (state.multiple) {
            return selectedItems;
        }

        return (selectedItems.length > 0) ? selectedItems[0] : null;
    };

    /** Returns value for NativeSelect component */
    const getNativeSelectValue = (): string | string[] | undefined => {
        const selectedItems = getSelectedItems(getState() as DropDownState)
            .map((item) => item.id);

        if (state.multiple) {
            return selectedItems;
        }

        return (selectedItems.length > 0) ? selectedItems[0] : undefined;
    };

    /** Send current selection data to 'itemselect' event handler */
    const sendItemSelectEvent = () => {
        if (typeof props.onItemSelect === 'function') {
            const data = getSelectionData();
            props.onItemSelect?.(data);
        }
    };

    /**
     * Send current selection data to 'change' event handler
     * 'change' event occurs after user finnished selection of item(s) and menu was hidden
     */
    const sendChangeEvent = () => {
        const { changed } = getState() as DropDownState;
        if (!changed) {
            return;
        }

        if (typeof props.onChange === 'function') {
            const data = getSelectionData();
            props.onChange?.(data);
        }

        dispatch(actions.changeEventSent());
    };

    /** Sets changed flag */
    const setChanged = () => dispatch(actions.setChanged());

    /** Shows or hides drop down menu */
    const showMenu = (val: boolean) => dispatch(actions.showMenu(val));

    /** Toggle shows/hides menu */
    const toggleMenu = () => dispatch(actions.toggleShowMenu());

    /** Hides menu if visible and send 'change' event */
    const closeMenu = () => {
        showMenu(false);
        sendChangeEvent();
    };

    const updateListPosition = () => {
        const updateRequired = onUpdatePosition();
        if (updateRequired) {
            updatePosition();
        }
    };

    const startScrollWaiting = () => dispatch(actions.startScrollWaiting());

    const stopScrollWaiting = () => {
        dispatch(actions.stopScrollWaiting());
        updateListPosition();
    };

    /** Creates new item and add it to the list */
    const addItem = (item: Partial<DropDownMenuItemProps>) => dispatch(actions.addItem(item));

    const removeCreatableMenuItem = () => (
        dispatch(actions.removeCreatableMenuItem())
    );

    /** Toggle item selected status */
    const toggleItem = (item: MenuItemProps | null) => {
        if (!item) {
            return;
        }

        const strId = item.id?.toString();

        if (item.selected && state.multiple) {
            dispatch(actions.deselectItem(strId));
        } else {
            dispatch(actions.selectItem(strId));
        }
    };

    const getItem = (itemId: string | null) => (
        MenuHelpers.getItemById(itemId, state.items ?? [])
    );

    /** Deselect specified item */
    const deselectItem = (itemId: string | null) => {
        if (itemId === null || !state.multiple) {
            return;
        }

        const itemToDeselect = getItem(itemId);
        if (!itemToDeselect?.selected) {
            return;
        }

        dispatch(actions.deselectItem(itemId));
    };

    /** Show all list items */
    const showAllItems = (resetInput = true) => {
        dispatch(actions.showAllItems(resetInput));
    };

    /** Show only items containing specified string */
    const filter = (inputString: string) => {
        if (state.inputString === inputString) {
            return;
        }

        if (inputString.length === 0) {
            showAllItems(false);
            return;
        }

        dispatch(actions.filter(inputString));
    };

    const focusContainer = () => {
        innerRef?.current?.focus();
    };

    /** Set active state for specified list item */
    const setActive = (itemId: string | null) => {
        const itemToActivate = getItem(itemId);
        const activeItem = getActiveItem(state);
        if (
            (activeItem && itemToActivate && activeItem.id === itemToActivate.id)
            || (!activeItem && !itemToActivate)
        ) {
            return;
        }

        const strId = itemToActivate?.id?.toString() ?? null;
        dispatch(actions.setActive(strId));
    };

    const focusInputIfNeeded = (
        keepActiveItem: boolean = false,
        activeItemId: string | null = null,
    ) => {
        const inputEl = getInput();
        if (!inputEl) {
            return;
        }

        if (
            props.enableFilter
            && !isInputTarget(focusedElem?.current)
            && state.actSelItemIndex === -1
        ) {
            inputEl.focus();

            if (keepActiveItem && activeItemId) {
                setActive(activeItemId);
            }
        }
    };

    /** Activate or deactivate component */
    const activate = (val: boolean) => {
        if (state.active === val) {
            return;
        }

        if (!val) {
            showMenu(false);
        }

        removeCreatableMenuItem();
        dispatch(actions.toggleActivate());
    };

    const activateInput = () => dispatch(actions.activateInput());

    /** Activate specified selected item */
    const activateSelectedItem = (index: number) => {
        const current = getState() as DropDownState;
        if (
            props.disabled
            || !state.multiple
            || (current.actSelItemIndex === index)
        ) {
            return;
        }

        // Check correctness of index
        if (index !== -1) {
            const selectedItems = getSelectedItems(current);
            if (index < 0 || index >= selectedItems.length) {
                return;
            }
        }

        dispatch(actions.activateSelectionItem(index));

        if (state.actSelItemIndex === -1) {
            setTimeout(() => {
                if (props.enableFilter) {
                    focusInputIfNeeded();
                } else {
                    focusContainer();
                }
            });
        }
    };

    /** Activate last(right) selected item */
    const activateLastSelectedItem = () => {
        const selectedItems = getSelectedItems(getState() as DropDownState);
        if (!selectedItems.length) {
            return;
        }

        activateSelectedItem(selectedItems.length - 1);
    };

    /** Starts to listen events of visual viewport and window */
    const listenWindowEvents = () => {
        if (state.listeningWindow) {
            return;
        }

        setEvents(window.visualViewport, viewportEvents);
        setEvents(window, windowEvents);

        dispatch(actions.startWindowListening());
    };

    /** Stops listening events of visual viewport and window */
    const stopWindowEvents = () => {
        if (!state.listeningWindow) {
            return;
        }

        dispatch(actions.stopWindowListening());

        removeEvents(window.visualViewport, viewportEvents);
        removeEvents(window, windowEvents);
    };

    const handlePlaceholderSelect = () => {
        const { allowCreate, inputString } = state;

        if (
            !allowCreate
            || (inputString === null)
            || !((inputString?.length ?? 0) > 0)
        ) {
            return;
        }

        removeCreatableMenuItem();
        addItem({
            id: MenuHelpers.generateItemId(state?.items ?? [], 'item'),
            title: inputString,
            selected: true,
        });

        activateSelectedItem(-1);
        sendItemSelectEvent();
        setChanged();

        closeMenu();
        if (props.enableFilter && state.filtered) {
            showAllItems();
        }
    };

    /** Handles group item select event */
    const handleGroupItemSelect = (item: MenuItemProps) => {
        const params: OnGroupHeaderClickParam<DropDownState> = {
            item,
            state,
            setState,
            dispatch,
        };

        props.onGroupHeaderClick?.(params);
    };

    /** Handles user item select event */
    const handleItemSelect = (item: DropDownMenuItemProps) => {
        if (!item || item.disabled) {
            return;
        }

        if (item.id === state.createFromInputItemId) {
            handlePlaceholderSelect();
            return;
        }

        activateSelectedItem(-1);

        // Handle clicks by group header
        if (item.type === 'group') {
            handleGroupItemSelect(item);
            return;
        }

        toggleItem(item);
        sendItemSelectEvent();
        setChanged();

        if (!state.multiple) {
            closeMenu();
            if (props.enableFilter && state.filtered) {
                showAllItems();
            }

            focusContainer();
        } else if (props.enableFilter) {
            if (state.filtered) {
                const visibleItems = getVisibleItems(state);
                if (
                    props.clearFilterOnMultiSelect
                    || visibleItems.length === 1
                ) {
                    showAllItems();
                }
            }

            setTimeout(() => focusInputIfNeeded());
        }
    };

    const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const target = e.target as HTMLElement;
        const validTarget = isValidToggleTarget(target);

        if (
            state.waitForScroll
            || isMenuTarget(target)
            || isClearButtonTarget(target)
            || (state.visible && isInputTarget(target))
            || isSelectionItemDeleteButtonTarget(target)
            || !validTarget
        ) {
            if (!validTarget) {
                e.stopPropagation();
            }
            return;
        }

        toggleMenu();

        if (!props.openOnFocus) {
            focusInputIfNeeded();
        }
    };

    const scrollToItem = () => {
        const menuEl = getMenu();
        if (!menuEl) {
            return;
        }

        const focused = document.activeElement;
        if (focused && menuEl.contains(focused)) {
            focused.scrollIntoView({
                behavior: 'instant',
                block: 'nearest',
            });
        }
    };

    /** 'focus' event handler */
    const onFocus = (e: React.FocusEvent) => {
        e?.stopPropagation();

        if (props.disabled) {
            return;
        }

        activate(true);

        const target = e.target as HTMLElement;
        const isInput = isInputTarget(target);
        const index = getSelectedItemIndex(target);
        if (index !== -1) {
            activateSelectedItem(index);
        } else if (isInput) {
            activateInput();
        }

        const focusedBefore = !!focusedElem?.current;
        if (focusedElem) {
            focusedElem.current = target;
        }

        if (
            !state.multiple
            && props.blurInputOnSingleSelect
            && isContainer(target)
        ) {
            return;
        }

        listenWindowEvents();
        if (state.openOnFocus && !state.visible && !focusedBefore) {
            showMenu(true);
            startScrollWaiting();
            showListHandler?.();
        }

        const closestElem = MenuHelpers.getClosestItemElement(target, '.menu-item');
        const itemId = closestElem?.dataset?.id ?? null;
        if (itemId) {
            scrollToItem();
        }

        if (
            index === -1
            && !isClearButtonTarget(target)
            && !isInput
        ) {
            focusInputIfNeeded(true, itemId);
        }
    };

    /** 'blur' event handler */
    const onBlur = (e: React.FocusEvent) => {
        e?.stopPropagation();

        if (isLostFocus(e)) {
            if (focusedElem) {
                focusedElem.current = null;
            }
            stopScrollWaiting();
            activate(false);
        }

        const target = e.target as HTMLElement;
        const selectEl = getSelect();
        if (selectEl && target === selectEl) {
            sendChangeEvent();
        }
    };

    const onToggle = () => {
        toggleMenu();
    };

    const onItemClick = (target: DropDownMenuItemProps) => {
        handleItemSelect(target);
    };

    /** Native select 'change' event handler */
    const onNativeSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions);
        const ids = selected.map((option) => option.value);

        dispatch(actions.setSelection(ids));
    };

    /** Click by delete button of selected item event handler */
    const onDeleteSelectedItem = ({ e }: { e: React.MouseEvent | React.KeyboardEvent; }) => {
        const current = getState() as DropDownState;
        if (!state.multiple || !e) {
            return;
        }

        const target = e.target as HTMLElement;
        const isClick = (e.type === 'click');
        if (isClick && !isSelectionItemDeleteButtonTarget(target)) {
            return;
        }

        const index = (isClick)
            ? getSelectedItemIndex(target)
            : current.actSelItemIndex;
        if (index === -1) {
            return;
        }

        const selectedItems = getSelectedItems(current);
        if (!selectedItems.length) {
            return;
        }

        e.stopPropagation();

        const ke = e as React.KeyboardEvent;
        const isBackspace = (e.type === 'keydown' && ke.code === 'Backspace');
        let itemToActivate;
        if (isBackspace) {
            if (index === 0) {
                // Activate first selected item if available or focus host input otherwise
                itemToActivate = (selectedItems.length > 1) ? 0 : -1;
            } else {
                // Activate previous selected item
                itemToActivate = index - 1;
            }
        } else {
            // Focus input or container if deselect last(right) selected item
            // Activate next selected item otherwise
            itemToActivate = (isClick || index === selectedItems.length - 1) ? -1 : index;
        }
        activateSelectedItem(itemToActivate);

        const item = selectedItems[index];
        if (!item) {
            return;
        }

        deselectItem(item.id);
        sendItemSelectEvent();
        setChanged();
        sendChangeEvent();
    };

    /** Handler for left or right arrow keys */
    const onSelectionNavigate = (e: React.KeyboardEvent) => {
        const current = getState() as DropDownState;
        if (!state.multiple) {
            return;
        }

        const selectedItems = getSelectedItems(current);
        if (!selectedItems.length) {
            return;
        }

        const index = current.actSelItemIndex;
        if (e.code === 'ArrowLeft') {
            if (index === 0) {
                return;
            }
            if (index === -1) {
                activateLastSelectedItem();
                return;
            }

            activateSelectedItem(index - 1);
        } else {
            const itemToActivate = (index === selectedItems.length - 1) ? -1 : (index + 1);
            activateSelectedItem(itemToActivate);
        }
    };

    const activateItem = (itemId: string | null) => {
        const menuElem = getMenu();
        if (!menuElem) {
            return;
        }

        const item = getItem(itemId);
        if (!item) {
            return;
        }

        const focusOptions = { preventScroll: true };
        const itemSelector = `.menu-item[data-id="${itemId}"]`;
        const itemEl = menuElem.querySelector(itemSelector) as HTMLElement;
        if (!itemEl) {
            return;
        }

        if (item.type === 'group' && state.allowActiveGroupHeader) {
            const { GroupHeader } = state.components;
            const selector = GroupHeader?.selector ?? null;
            const groupHeader = itemEl?.querySelector(selector) as HTMLElement;
            groupHeader?.focus(focusOptions);
        } else {
            itemEl.focus(focusOptions);
        }
    };

    const onKey = (e: React.KeyboardEvent) => {
        e.stopPropagation();

        const editable = isEditable(state);
        const { multiple, showMultipleSelection, listAttach } = props;
        const inputEl = getInput();
        let newItem: MenuItemProps | null = null;

        let allowSelectionNavigate = multiple && showMultipleSelection && !listAttach;
        if (allowSelectionNavigate && editable && e.target === inputEl) {
            // Check cursor is at start of input
            const cursorPos = getCursorPos(inputEl);
            if (cursorPos?.start !== 0 || cursorPos.start !== cursorPos.end) {
                allowSelectionNavigate = false;
            }
        }

        // Backspace or Arrow Left key on container or text input
        // Activate last multiple selection item
        if (
            allowSelectionNavigate
            && (e.code === 'Backspace' || e.code === 'ArrowLeft')
            && (state.actSelItemIndex === -1)
        ) {
            activateLastSelectedItem();
            return;
        }

        if (allowSelectionNavigate && (e.code === 'Backspace' || e.code === 'Delete')) {
            if (e.code === 'Delete' && state.actSelItemIndex === -1) {
                return;
            }

            onDeleteSelectedItem({ e });
            e.preventDefault();
            return;
        }

        if (allowSelectionNavigate && (e.code === 'ArrowLeft' || e.code === 'ArrowRight')) {
            if (e.code === 'ArrowRight' && state.actSelItemIndex === -1) {
                return;
            }

            onSelectionNavigate(e);
            e.preventDefault();
            return;
        }

        const activeItem = getActiveItem(state);
        let focusInput = false;

        if (e.code === 'Space' && !editable) {
            toggleMenu();
            e.preventDefault();
        } else if (e.code === 'ArrowDown') {
            const availItems = getAvailableItems(state);

            if (!state.visible && !activeItem) {
                showMenu(true);
                focusInput = true;
                [newItem] = availItems;
            } else if (state.visible) {
                if (activeItem) {
                    newItem = getNextAvailableItem(activeItem.id, state);
                    if (props.loopNavigation && !newItem) {
                        [newItem] = availItems;
                    }
                } else if (availItems.length > 0) {
                    [newItem] = availItems;
                }
            }
        } else if (e.code === 'ArrowUp') {
            const availItems = getAvailableItems(state);
            if (state.visible && activeItem) {
                newItem = getPrevAvailableItem(activeItem.id, state);
                if (props.loopNavigation && !newItem) {
                    newItem = availItems[availItems.length - 1];
                }
            }
        } else if (e.code === 'Home') {
            const availItems = getAvailableItems(state);
            if (availItems.length > 0) {
                [newItem] = availItems;
            }
        } else if (e.code === 'End') {
            const availItems = getAvailableItems(state);
            if (availItems.length > 0) {
                newItem = availItems[availItems.length - 1];
            }
        } else if (e.key === 'Enter') {
            if (activeItem) {
                handleItemSelect(activeItem);
            }

            e.preventDefault();
        } else if (e.code === 'Escape') {
            showMenu(false);
            focusContainer();
        } else {
            return;
        }

        if (newItem) {
            e.preventDefault();

            activateItem(newItem.id);
            setActive(newItem.id);
        }

        if (focusInput) {
            focusInputIfNeeded(true, newItem?.id ?? null);
        }
    };

    /** Handler for 'input' event of text field  */
    const onInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (props.enableFilter) {
            const target = e?.target as HTMLInputElement;
            filter(target?.value);
        }

        props.onInput?.(e);
    }, [props.enableFilter, props.onInput]);

    /** Handler for 'clear selection' button click */
    const onClearSelection = () => {
        if (!state.multiple) {
            return;
        }

        dispatch(actions.deselectAll());
        sendChangeEvent();

        if (props.enableFilter) {
            focusInputIfNeeded();
        } else {
            focusContainer();
        }
    };

    const onItemActivate = (itemId: string | null) => {
        setActive(itemId);
    };

    const onGroupHeaderClick = ({ item }: { item: DropDownMenuItemProps; }) => {
        handleGroupItemSelect(item);
    };

    const onViewportResize = () => {
        updateListPosition();
    };

    const onWindowScroll = (e: Event) => {
        const target = e.target as HTMLElement;
        if (
            reference.current
            && !target?.contains(reference.current)
            && !target?.contains(elem.current)
        ) {
            return;
        }

        updateListPosition();
    };

    viewportEvents = { resize: onViewportResize };
    windowEvents = {
        scroll: {
            listener: onWindowScroll,
            options: { passive: true, capture: true },
        },
    };

    showListHandler = useDebounce(
        stopScrollWaiting,
        SHOW_LIST_SCROLL_TIMEOUT,
    ) as DebounceRunFunction;

    useEffect(() => {
        if (state.visible) {
            listenWindowEvents();
        } else {
            stopWindowEvents();
        }

        return () => {
            stopWindowEvents();
        };
    }, [state.visible, state.listeningWindow]);

    useEffect(() => {
        if (state.visible) {
            setTimeout(() => updateListPosition());
        }
    }, [state.visible, state.items, state.inputString]);

    const closeMenuCached = useCallback(() => {
        closeMenu();
    }, []);

    useEmptyClick(
        closeMenuCached,
        [elem, reference],
        state.visible,
    );

    const { Menu, ComboBox } = state.components;

    const attachedTo = props.listAttach && props.children;
    const editable = isEditable({
        ...state,
        disabled: props.disabled,
    });

    // Combo box
    const comboBoxProps = {
        ...state,
        inputRef: inputElem,
        disabled: props.disabled,
        editable,
        items: MenuHelpers.toFlatList<DropDownMenuItemProps>(state.items ?? []),
        onInput,
        onToggle,
        onDeleteSelectedItem,
        onClearSelection,
    };
    const comboBox = !props.listAttach && (
        <ComboBox
            {...comboBoxProps}
            ref={referenceRef}
        />
    );

    const showInput = props.listAttach && props.enableFilter;

    // Menu
    const menuProps: DropDownMenuProps = {
        ...state,
        items: state.items ?? [],
        inputRef: inputElem,
        disabled: props.disabled,
        className: classNames({
            dd__list_fixed: !!state.fixedMenu,
            dd__list_open: !!state.fixedMenu && !!state.visible,
        }),
        itemSelector: '.menu-item',
        tabThrough: false,
        activeItem: null,
        editable,
        onItemClick,
        onInput,
        onDeleteSelectedItem,
        onClearSelection,
        onItemActivate,
        onGroupHeaderClick,
        components: {
            ...state.components,
            Header: (showInput) ? DropDownMenuHeader : null,
        },
    };

    if (showInput) {
        menuProps.header = {
            inputRef: inputElem,
            disabled: props.disabled,
            inputString: state.inputString ?? '',
            inputPlaceholder: props.placeholder,
            useSingleSelectionAsPlaceholder: props.useSingleSelectionAsPlaceholder,
            multiple: props.multiple,
            onInput,
            components: {
                Input: props.components.Input,
            },
        };
    }

    const menu = state.visible && (
        <Menu {...menuProps} ref={elementRef} />
    );

    // Menu popup
    const container = props.container ?? document.body;
    const menuPopup = (state.fixedMenu)
        ? createPortal(menu, container)
        : menu;

    const selected = getSelectedItems(state);
    const selectedIds = selected.map((item) => item.id).join();

    let tabIndex: number | undefined;
    let selectTabIndex: number | null = null;
    if (!props.disabled) {
        const nativeSelectVisible = false; // isVisible(selectElem, true);

        selectTabIndex = (nativeSelectVisible) ? 0 : -1;

        const disableContainerTab = (
            nativeSelectVisible
            || (editable && !props.listAttach)
            || state.active
        );

        tabIndex = (disableContainerTab) ? -1 : 0;
    }

    // Native select
    const { NativeSelect } = state.components;

    const nativeSelectProps: DropDownNativeSelectProps = {
        id: props.id,
        disabled: props.disabled,
        multiple: props.multiple,
        items: state.items ?? [],
        value: getNativeSelectValue(),
        onChange: onNativeSelectChange,
    };
    if (selectTabIndex !== null) {
        nativeSelectProps.tabIndex = selectTabIndex;
    }

    const nativeSelect = props.useNativeSelect && NativeSelect && (
        <NativeSelect {...nativeSelectProps} ref={selectElem} />
    );

    const style: CSSProperties = {};
    if (state.visible && state.fullScreenHeight) {
        style.height = px(state.fullScreenHeight);
    }

    const containerProps = {
        id: props.id,
        className: classNames(
            {
                dd__container: !attachedTo,
                dd__container_attached: !!attachedTo,
                dd__container_static: !props.listAttach && props.static,
                dd__container_multiple: !!state.multiple,
                dd__container_active: !!state.active,
                dd__open: !state.fixedMenu && !!state.visible,
                dd__editable: isEditable(getState() as DropDownState),
                dd__list_active: isEditable(getState() as DropDownState),
                dd__fullscreen: !!state.fullScreen,
                dd__container_native: !!state.useNativeSelect,
                dd__container_disabled: !!props.disabled,
            },
            props.className,
        ),
        tabIndex,
        onClickCapture: onClick,
        onClick: () => focusInputIfNeeded(),
        onFocusCapture: onFocus,
        onBlurCapture: onBlur,
        onKeyDownCapture: onKey,
        'data-value': selectedIds,
        style,
    };

    return (
        <div {...containerProps} ref={innerRef}>
            {props.listAttach && (
                <div ref={referenceRef} >
                    {attachedTo}
                </div>
            )}
            {comboBox}
            {nativeSelect}
            {menuPopup}
        </div>
    );
});
