import { removeEvents, setEvents, getCursorPos } from '@jezvejs/dom';
import { isFunction } from '@jezvejs/types';
import {
    useRef,
    useEffect,
    forwardRef,
    useImperativeHandle,
    useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { px } from '../../utils/common.ts';
import { useStore } from '../../utils/Store/StoreProvider.tsx';

// Common components
import { MenuHelpers } from '../Menu/Menu.tsx';
// Common hooks
import { useDebounce } from '../../hooks/useDebounce/useDebounce.ts';
import { useEmptyClick } from '../../hooks/useEmptyClick/useEmptyClick.ts';
import { usePopupPosition } from '../../hooks/usePopupPosition/usePopupPosition.ts';

// Local components - Menu
import { DropDownMenuHeader } from './components/Menu/MenuHeader/MenuHeader.tsx';

import {
    isEditable,
    componentPropType,
    getAvailableItems,
    getPrevAvailableItem,
    getNextAvailableItem,
    getActiveItem,
    getSelectedItems,
    getVisibleItems,
} from './helpers.ts';
import { actions } from './reducer.ts';
import { SHOW_LIST_SCROLL_TIMEOUT } from './constants.ts';

/**
 * DropDown component
 */
// eslint-disable-next-line react/display-name
export const DropDownContainer = forwardRef((props, ref) => {
    const { state, getState, dispatch } = useStore();

    const innerRef = useRef(null);
    useImperativeHandle(ref, () => innerRef.current);

    const inputElem = useRef(null);
    const focusedElem = useRef(null);
    const selectElem = useRef(null);

    const allowScrollAndResize = !state?.isTouch || !isEditable(state);

    let viewportEvents = null;
    let windowEvents = null;
    let showListHandler = null;

    /** Returns true if fullscreen mode is enabled and active */
    const isFullScreen = () => (
        props.fullScreen
        && innerRef?.current
        && !innerRef.current.offsetParent
    );

    const setFullScreenContainerHeight = () => {
        const screenHeight = window.visualViewport.height;
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
        onWindowScroll: (e) => onUpdatePosition(e),
        onViewportResize: (e) => onUpdatePosition(e),
    });

    /** Return index of selected item contains specified element */
    const getSelectedItemIndex = (el) => {
        const SelectionItemComponent = state.components.MultiSelectionItem;
        const selItemElem = el?.closest(SelectionItemComponent.selector);
        if (!selItemElem) {
            return -1;
        }

        const selectedItems = getSelectedItems(getState());
        if (!Array.isArray(selectedItems)) {
            return -1;
        }

        return selectedItems.findIndex((item) => item.id === selItemElem.dataset.id);
    };

    /** Returns menu element if exists */
    const getContainer = () => innerRef?.current;

    /** Returns menu element if exists */
    const getMenu = () => elem?.current;

    /** Returns current input element if exists */
    const getInput = () => inputElem?.current;

    /** Returns current select element if exists */
    const getSelect = () => selectElem?.current;

    /** Returns true if element is child of component */
    const isChildTarget = (target) => (
        target && (getContainer())?.contains(target)
    );

    /** Returns true if element is list or its child */
    const isMenuTarget = (target) => {
        const menuEl = getMenu();
        return target && (target === menuEl || menuEl?.contains(target));
    };

    /** Returns true if element is clear button or its child */
    const isClearButtonTarget = (target) => {
        const refEl = reference?.current;

        const btn = refEl?.closest?.('.dd__clear-btn');
        return target && (target === btn || btn?.contains(target));
    };

    /** Returns true if element is delete selection item button or its child */
    const isSelectionItemDeleteButtonTarget = (target) => {
        const { MultiSelectionItem } = state.components;
        return target?.closest(`.${MultiSelectionItem.buttonClass}`);
    };

    /** Returns true if element is allowed to toggle menu list */
    const isValidToggleTarget = (target) => (
        !isFunction(props.isValidToggleTarget)
        || props.isValidToggleTarget(target)
    );

    /**
     * Returns true if component is containing specified element
     *
     * @param {Element} elem
     * @returns {Boolean}
     */
    const isChildElement = (target) => (
        !!target
        && (
            isChildTarget(target)
            || isMenuTarget(target)
        )
    );

    /**
     * Returns true if focus moved outside of component
     *
     * @param {Event} e event object
     * @returns {Boolean}
     */
    const isLostFocus = (e) => (
        !isChildElement(e.relatedTarget)
    );

    /** Return selected items data for 'itemselect' and 'change' events */
    const getSelectionData = () => {
        const selectedItems = getSelectedItems(getState())
            .map((item) => ({ id: item.id, value: item.title }));

        if (state.multiple) {
            return selectedItems;
        }

        return (selectedItems.length > 0) ? selectedItems[0] : null;
    };

    /** Send current selection data to 'itemselect' event handler */
    const sendItemSelectEvent = () => {
        if (isFunction(props.onItemSelect)) {
            const data = getSelectionData();
            props.onItemSelect(data);
        }
    };

    /**
     * Send current selection data to 'change' event handler
     * 'change' event occurs after user finnished selection of item(s) and menu was hidden
     */
    const sendChangeEvent = () => {
        if (!state.changed) {
            return;
        }

        if (isFunction(props.onChange)) {
            const data = getSelectionData();
            props.onChange(data);
        }

        dispatch(actions.changeEventSent());
    };

    /** Sets changed flag */
    const setChanged = () => dispatch(actions.setChanged());

    /** Shows or hides drop down menu */
    const showMenu = (val) => dispatch(actions.showMenu(val));

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
    const addItem = (item) => dispatch(actions.addItem(item));

    const removeCreatableMenuItem = () => (
        dispatch(actions.removeCreatableMenuItem())
    );

    /** Toggle item selected status */
    const toggleItem = (item) => {
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

    const getItem = (itemId) => (
        MenuHelpers.getItemById(itemId, state.items)
    );

    /** Deselect specified item */
    const deselectItem = (itemId) => {
        if (!state.multiple) {
            return;
        }

        const strId = itemId?.toString();
        const itemToDeselect = getItem(strId);
        if (!itemToDeselect?.selected) {
            return;
        }

        dispatch(actions.deselectItem(strId));
    };

    /** Show all list items */
    const showAllItems = (resetInput = true) => {
        dispatch(actions.showAllItems(resetInput));
    };

    /** Show only items containing specified string */
    const filter = (inputString) => {
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
    const setActive = (itemId) => {
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

    const focusInputIfNeeded = (keepActiveItem = false, activeItemId = null) => {
        const inputEl = getInput();
        if (!inputEl) {
            return;
        }

        if (
            props.enableFilter
            && focusedElem?.current !== inputEl
            && state.actSelItemIndex === -1
        ) {
            inputEl.focus();

            if (keepActiveItem && activeItemId) {
                setActive(activeItemId);
            }
        }
    };

    /** Activate or deactivate component */
    const activate = (val) => {
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
    const activateSelectedItem = (index) => {
        const current = getState();
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
        const selectedItems = getSelectedItems(getState());
        if (!selectedItems.length) {
            return;
        }

        activateSelectedItem(selectedItems.length - 1);
    };

    /** Starts to listen events of visual viewport and window */
    const listenWindowEvents = () => {
        if (state.visible && state.listeningWindow) {
            setEvents(window.visualViewport, viewportEvents);
            setEvents(window, windowEvents);
        }
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
            || !(inputString?.length > 0)
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
    const handleGroupItemSelect = (item) => {
        props.onGroupHeaderClick?.({
            item,
            state,
            dispatch,
        });
    };

    /** Handles user item select event */
    const handleItemSelect = (item) => {
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

    const onClick = (e) => {
        if (e.type === 'touchstart') {
            dispatch(actions.confirmTouch());
            return;
        }

        const validTarget = isValidToggleTarget(e.target);

        if (
            state.waitForScroll
            || isMenuTarget(e.target)
            || isClearButtonTarget(e.target)
            || isSelectionItemDeleteButtonTarget(e.target)
            || !validTarget
        ) {
            if (!validTarget) {
                e.stopPropagation();
            }
            return;
        }

        toggleMenu();

        if (!props.openOnFocus) {
            setTimeout(() => focusInputIfNeeded());
        }
    };

    const scrollToItem = () => {
        const menuEl = getMenu();
        if (!menuEl) {
            return;
        }

        const focused = document.activeElement;
        if (menuEl.contains(focused)) {
            focused.scrollIntoView({
                behavior: 'instant',
                block: 'nearest',
            });
        }
    };

    /** 'focus' event handler */
    const onFocus = (e) => {
        e?.stopPropagation();

        if (props.disabled) {
            return;
        }

        activate(true);
        const inputEl = getInput();

        const index = getSelectedItemIndex(e.target);
        if (index !== -1) {
            activateSelectedItem(index);
        } else if (e.target === inputEl) {
            activateInput();
        }

        const focusedBefore = !!focusedElem?.current;
        if (focusedElem) {
            focusedElem.current = e.target;
        }

        if (
            !state.multiple
            && props.blurInputOnSingleSelect
            && e.target === innerRef?.current
        ) {
            return;
        }

        listenWindowEvents();
        if (state.openOnFocus && !state.visible && !focusedBefore) {
            showMenu(true);
            startScrollWaiting();
            showListHandler?.();
        }

        const closestElem = MenuHelpers.getClosestItemElement(e?.target, {
            ...state,
            itemSelector: '.menu-item',
        });
        const itemId = closestElem?.dataset?.id ?? null;

        if (itemId) {
            scrollToItem();
        }

        if (
            index === -1
            && !isClearButtonTarget(e.target)
            && e.target !== inputEl
        ) {
            focusInputIfNeeded(true, itemId);
        }
    };

    /** 'blur' event handler */
    const onBlur = (e) => {
        e?.stopPropagation();

        if (isLostFocus(e)) {
            if (focusedElem) {
                focusedElem.current = null;
            }
            stopScrollWaiting();
            activate(false);
        }

        const selectEl = getSelect();
        if (selectEl && e.target === selectEl) {
            sendChangeEvent();
        }
    };

    const onToggle = () => {
        toggleMenu();
    };

    const onItemClick = (target) => {
        handleItemSelect(target);
    };

    /** Click by delete button of selected item event handler */
    const onDeleteSelectedItem = ({ e }) => {
        const current = getState();
        if (!state.multiple || !e) {
            return;
        }

        const isClick = (e.type === 'click');
        if (isClick && !isSelectionItemDeleteButtonTarget(e.target)) {
            return;
        }

        const index = (isClick)
            ? getSelectedItemIndex(e.target)
            : current.actSelItemIndex;
        if (index === -1) {
            return;
        }

        const selectedItems = getSelectedItems(current);
        if (!selectedItems.length) {
            return;
        }

        e.stopPropagation();

        const isBackspace = (e.type === 'keydown' && e.code === 'Backspace');
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
    const onSelectionNavigate = (e) => {
        const current = getState();
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
            const itemToActivate = (index === selectedItems.length - 1) ? -1 : index + 1;
            activateSelectedItem(itemToActivate);
        }
    };

    const activateItem = (itemId) => {
        const menuElem = getMenu();
        if (!menuElem) {
            return;
        }

        const item = getItem(itemId);
        if (!item) {
            return;
        }

        const focusOptions = { preventScroll: true };

        const itemEl = menuElem.querySelector(`.menu-item[data-id="${itemId}"]`);
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

    const onKey = (e) => {
        e.stopPropagation();

        const editable = isEditable(state);
        const { multiple, showMultipleSelection, listAttach } = props;
        const inputEl = getInput();
        let newItem = null;

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
            focusInputIfNeeded(true, newItem.id);
        }
    };

    /** Handler for 'input' event of text field  */
    const onInput = (e) => {
        if (props.enableFilter) {
            filter(e.target.value);
        }

        props?.onInput?.(e, dispatch);
    };

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

    const onItemActivate = (itemId) => {
        setActive(itemId);
    };

    const onGroupHeaderClick = ({ item }) => {
        handleGroupItemSelect(item);
    };

    const onViewportResize = () => {
        updateListPosition();
    };

    const onWindowScroll = () => {
        updateListPosition();
    };

    viewportEvents = { resize: (e) => onViewportResize(e) };
    windowEvents = {
        scroll: {
            listener: (e) => onWindowScroll(e),
            options: { passive: true, capture: true },
        },
    };

    showListHandler = useDebounce(
        stopScrollWaiting,
        SHOW_LIST_SCROLL_TIMEOUT,
    );

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

    useEmptyClick(closeMenuCached, [elem, reference], state.visible);

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
        items: MenuHelpers.toFlatList(state.items),
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
    const menuProps = {
        ...state,
        inputRef: inputElem,
        disabled: props.disabled,
        className: classNames({
            dd__list_fixed: !!state.fixedMenu,
            dd__list_open: !!state.fixedMenu && !!state.visible,
        }),
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
            inputString: state.inputString,
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

    let tabIndex = null;
    let selectTabIndex = null;
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
    const nativeSelect = props.useNativeSelect && (
        <NativeSelect
            id={props.id}
            disabled={props.disabled}
            multiple={props.multiple}
            tabIndex={selectTabIndex}
            items={state.items}
        />
    );

    const style = {};
    if (state.visible && state.fullScreenHeight) {
        style.height = px(state.fullScreenHeight);
    }

    return (
        <div
            id={props.id}
            className={classNames(
                {
                    dd__container: !attachedTo,
                    dd__container_attached: !!attachedTo,
                    dd__container_static: !props.listAttach && props.static,
                    dd__container_multiple: !!state.multiple,
                    dd__container_active: !!state.active,
                    dd__open: !state.fixedMenu && !!state.visible,
                    dd__editable: isEditable(state),
                    dd__list_active: isEditable(state),
                    dd__fullscreen: !!state.fullScreen,
                    dd__container_native: !!state.useNativeSelect,
                },
                props.className,
            )}
            tabIndex={tabIndex}
            onClickCapture={onClick}
            onFocusCapture={onFocus}
            onBlurCapture={onBlur}
            onKeyDownCapture={onKey}
            disabled={props.disabled}
            data-value={selectedIds}
            ref={innerRef}
            style={style}
        >
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

DropDownContainer.propTypes = {
    /* DropDown container element 'id' property */
    id: PropTypes.string,
    /* Select element 'name' property */
    name: PropTypes.string,
    /* Select element 'form' property */
    form: PropTypes.string,
    /* Additional CSS classes */
    className: PropTypes.string,
    /* Content to attach DropDown component to */
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
    /* allow to select multiple items */
    multiple: PropTypes.bool,
    /* attach menu to element and don't create combo box */
    listAttach: PropTypes.bool,
    /* If enabled component container will use static position */
    static: PropTypes.bool,
    /* Callback to verity element to toggle menu list popup */
    isValidToggleTarget: PropTypes.func,
    /* If enabled menu will use fixed position or absolute otherwise */
    fixedMenu: PropTypes.bool,
    /* Enables filtering items by text input */
    enableFilter: PropTypes.bool,
    /* If enabled menu will be opened on component receive focus */
    openOnFocus: PropTypes.bool,
    /* If enabled then after last item will be activated first and vice versa */
    loopNavigation: PropTypes.bool,
    /* Title for empty menu list placeholder */
    noResultsMessage: PropTypes.string,
    /* Enables create new items from filter input value */
    allowCreate: PropTypes.bool,
    /* Enabled activation of group headers and includes its to item iterations */
    allowActiveGroupHeader: PropTypes.bool,
    /* Callback returning title for 'Create from filter' menu item */
    addItemMessage: PropTypes.func,
    /* Disabled any interactions with component */
    disabled: PropTypes.bool,
    /* If enabled component will use native select element on
       small devices(less 768px width) to view list and edit selection */
    useNativeSelect: PropTypes.bool,
    /* if set true component will show fullscreen popup */
    fullScreen: PropTypes.bool,
    /* Placeholder text for component */
    placeholder: PropTypes.string,
    /* Additional reducers */
    reducers: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func),
    ]),
    /* If enabled single select component will move focus from input to container
       after select item */
    blurInputOnSingleSelect: PropTypes.bool,
    /* If enabled single select component will use title of selected item as placeholder */
    useSingleSelectionAsPlaceholder: PropTypes.bool,
    /* If enabled multiple select component will clear filter input after select item */
    clearFilterOnMultiSelect: PropTypes.bool,
    /* Enables render multiple selection inside combo box */
    showMultipleSelection: PropTypes.bool,
    /* Enables render 'clear multiple selection' button inside combo box */
    showClearButton: PropTypes.bool,
    /* Enables render 'toggle' button inside combo box */
    showToggleButton: PropTypes.bool,
    /* group header click event handler */
    onGroupHeaderClick: PropTypes.func,
    /* item selected event handler */
    onItemSelect: PropTypes.func,
    /* selection changed event handler */
    onChange: PropTypes.func,
    /* filer input event handler */
    onInput: PropTypes.func,
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
        Input: componentPropType,
        NativeSelect: componentPropType,
        Placeholder: componentPropType,
        SingleSelection: componentPropType,
        ComboBox: componentPropType,
        Menu: componentPropType,
        MenuList: componentPropType,
        ListItem: componentPropType,
        Check: componentPropType,
        GroupItem: componentPropType,
        GroupHeader: componentPropType,
        ListPlaceholder: componentPropType,
        MultipleSelection: componentPropType,
        MultiSelectionItem: componentPropType,
        ComboBoxControls: componentPropType,
        ToggleButton: componentPropType,
        ClearButton: componentPropType,
    }),
    container: PropTypes.object,
};
