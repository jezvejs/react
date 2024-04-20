import { removeEvents, setEvents, getCursorPos } from '@jezvejs/dom';
import { isFunction } from '@jezvejs/types';
import {
    useRef,
    useEffect,
    forwardRef,
    useImperativeHandle,
    useReducer,
} from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { px } from '../../utils/common.js';

// Common components
import { MenuCheckbox, MenuHelpers } from '../Menu/Menu.jsx';
// Common hooks
import { useDebounce } from '../../hooks/useDebounce/useDebounce.js';
import { useEmptyClick } from '../../hooks/useEmptyClick/useEmptyClick.js';
import { usePopupPosition } from '../../hooks/usePopupPosition/usePopupPosition.js';

// Local components
import { DropDownInput } from './components/Input/Input.jsx';
// Local components - Combo box
import { DropDownComboBox } from './components/Combo/ComboBox/ComboBox.jsx';
import { DropDownComboBoxControls } from './components/Combo/ComboBoxControls/ComboBoxControls.jsx';
import { DropDownSingleSelection } from './components/Combo/SingleSelection/SingleSelection.jsx';
import { DropDownMultipleSelection } from './components/Combo/MultipleSelection/MultipleSelection.jsx';
import { DropDownMultiSelectionItem } from './components/Combo/MultiSelectionItem/MultiSelectionItem.jsx';
import { DropDownPlaceholder } from './components/Combo/Placeholder/Placeholder.jsx';
import { DropDownClearButton } from './components/Combo/ClearButton/ClearButton.jsx';
import { DropDownToggleButton } from './components/Combo/ToggleButton/ToggleButton.jsx';
// Local components - Menu
import { DropDownMenu } from './components/Menu/Menu/Menu.jsx';
import { DropDownMenuHeader } from './components/Menu/MenuHeader/MenuHeader.jsx';
import { DropDownMenuList } from './components/Menu/MenuList/MenuList.jsx';
import { DropDownListItem } from './components/Menu/ListItem/ListItem.jsx';
import { DropDownGroupItem } from './components/Menu/GroupItem/GroupItem.jsx';
import { DropDownGroupHeader } from './components/Menu/GroupHeader/GroupHeader.jsx';
import { DropDownListPlaceholder } from './components/Menu/ListPlaceholder/ListPlaceholder.jsx';

import {
    isEditable,
    getInitialState,
    componentPropType,
    getAvailableItems,
    getPrevAvailableItem,
    getNextAvailableItem,
    getActiveItem,
    getSelectedItems,
    getVisibleItems,
} from './helpers.js';
import { actions, reducer } from './reducer.js';
import { SHOW_LIST_SCROLL_TIMEOUT } from './constants.js';
import './DropDown.scss';

export {
    // Child components
    // Combobox
    DropDownComboBox,
    DropDownInput,
    DropDownPlaceholder,
    DropDownSingleSelection,
    DropDownMultipleSelection,
    DropDownMultiSelectionItem,
    DropDownComboBoxControls,
    DropDownToggleButton,
    DropDownClearButton,
    // Menu
    DropDownMenu,
    DropDownMenuList,
    DropDownListItem,
    DropDownGroupItem,
    DropDownGroupHeader,
    DropDownListPlaceholder,
};

/**
 * DropDown component
 */
// eslint-disable-next-line react/display-name
export const DropDown = forwardRef((props, ref) => {
    const [state, dispatch] = useReducer(
        reducer,
        props,
        (initialArg) => getInitialState(initialArg, DropDown.defaultProps),
    );

    const innerRef = useRef(null);
    useImperativeHandle(ref, () => innerRef.current);

    const inputElem = useRef(null);
    const focusedElem = useRef(null);
    const selectElem = useRef(null);

    const allowScrollAndResize = !state.isTouch || !isEditable(state);

    let viewportEvents = null;
    let windowEvents = null;
    let showListHandler = null;

    const {
        referenceRef,
        elementRef,
        elem,
        reference,
        updatePosition,
    } = usePopupPosition({
        ...state.position,

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

        open: state.visible,
        onScrollDone: () => dispatch(actions.startWindowListening()),
    });

    /** Return index of selected item contains specified element */
    const getSelectedItemIndex = (el) => {
        const SelectionItemComponent = props.components.MultiSelectionItem;
        const selItemElem = el?.closest(SelectionItemComponent.selector);
        if (!selItemElem) {
            return -1;
        }

        const selectedItems = getSelectedItems(state);
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
        const { MultiSelectionItem } = props.components;
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
        const selectedItems = getSelectedItems(state)
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
        if (
            props.disabled
            || !state.multiple
            || (state.actSelItemIndex === index)
        ) {
            return;
        }

        // Check correctness of index
        if (index !== -1) {
            const selectedItems = getSelectedItems(state);
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
        const selectedItems = getSelectedItems(state);
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

        const selectEl = selectElem?.current;
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
    const onDeleteSelectedItem = (e) => {
        if (!state.multiple || !e) {
            return;
        }

        const isClick = (e.type === 'click');
        if (isClick && !isSelectionItemDeleteButtonTarget(e.target)) {
            return;
        }

        const index = (isClick)
            ? getSelectedItemIndex(e.target)
            : state.actSelItemIndex;
        if (index === -1) {
            return;
        }

        const selectedItems = getSelectedItems(state);
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
        if (!state.multiple) {
            return;
        }

        const selectedItems = getSelectedItems(state);
        if (!selectedItems.length) {
            return;
        }

        const index = state.actSelItemIndex;
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

            onDeleteSelectedItem(e);
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

        props?.onInput?.(e);
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

    const onViewportResize = () => {
    };

    const onWindowScroll = () => {
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
            setTimeout(() => updatePosition());
        }
    }, [state.visible, state.items, state.inputString]);

    useEmptyClick(closeMenu, [elem, reference], state.visible);

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
        components: {
            ...props.components,
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

    const select = (<select tabIndex={selectTabIndex}></select>);

    const style = {};
    if (state.fullScreenHeight) {
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
            <div ref={referenceRef} >
                {attachedTo}
            </div>
            {comboBox}
            {select}
            {menuPopup}
        </div>
    );
});

DropDown.propTypes = {
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

DropDown.defaultProps = {
    className: null,
    multiple: false,
    listAttach: false,
    static: false,
    isValidToggleTarget: null,
    fixedMenu: false,
    enableFilter: false,
    openOnFocus: false,
    loopNavigation: true,
    noResultsMessage: 'No items',
    allowCreate: false,
    allowActiveGroupHeader: false,
    addItemMessage: (title) => `Add item: '${title}'`,
    disabled: false,
    useNativeSelect: false,
    fullScreen: false,
    placeholder: null,
    reducers: null,
    blurInputOnSingleSelect: true,
    useSingleSelectionAsPlaceholder: true,
    clearFilterOnMultiSelect: false,
    showMultipleSelection: true,
    showClearButton: true,
    showToggleButton: true,
    onItemSelect: null,
    onChange: null,
    onInput: null,
    components: {
        Input: DropDownInput,
        Placeholder: DropDownPlaceholder,
        SingleSelection: DropDownSingleSelection,
        ComboBox: DropDownComboBox,
        Menu: DropDownMenu,
        MenuList: DropDownMenuList,
        ListItem: DropDownListItem,
        Check: MenuCheckbox,
        GroupItem: DropDownGroupItem,
        GroupHeader: DropDownGroupHeader,
        ListPlaceholder: DropDownListPlaceholder,
        MultipleSelection: DropDownMultipleSelection,
        MultiSelectionItem: DropDownMultiSelectionItem,
        ComboBoxControls: DropDownComboBoxControls,
        ToggleButton: DropDownToggleButton,
        ClearButton: DropDownClearButton,
    },
};
