import { removeEvents, setEvents } from '@jezvejs/dom';
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

// Common components
import { MenuCheckbox, MenuHelpers } from '../Menu/Menu.jsx';
// Common hooks
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
} from './helpers.js';
import { getSelectedItems } from './utils.js';
import {
    actions,
    reducer,
} from './reducer.js';
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

    const allowScrollAndResize = !state.isTouch || !isEditable(state);

    const {
        referenceRef,
        elementRef,
        elem,
        reference,
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

    /** Returns true if element is list or its child */
    const isMenuTarget = (target) => {
        const menuEl = elem?.current;
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

    /** Handles user item select event */
    const handleItemSelect = (item) => {
        if (!item || item.disabled) {
            return;
        }

        toggleItem(item);
    };

    const toggleMenu = () => dispatch(actions.toggleShowMenu());

    const closeMenu = () => {
        if (state.visible) {
            toggleMenu();
        }
    };

    const focusInputIfNeeded = () => {
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
            focusInputIfNeeded();
        }
    };

    const onFocus = () => {
    };

    const onBlur = () => {
    };

    const onToggle = () => {
        toggleMenu();
    };

    const onItemClick = (target) => {
        handleItemSelect(target);

        closeMenu();
    };

    const onKey = () => {
    };

    const onInput = () => {
    };

    const onDeleteSelectedItem = () => {
    };

    const onClearSelection = () => {
    };

    const onViewportResize = () => {
    };

    const onWindowScroll = () => {
    };

    const viewportEvents = { resize: (e) => onViewportResize(e) };
    const windowEvents = {
        scroll: {
            listener: (e) => onWindowScroll(e),
            options: { passive: true, capture: true },
        },
    };

    const listenWindowEvents = () => {
        if (state.visible && state.listeningWindow) {
            setEvents(window.visualViewport, viewportEvents);
            setEvents(window, windowEvents);
        }
    };

    const stopWindowEvents = () => {
        if (!state.listeningWindow) {
            return;
        }

        dispatch(actions.stopWindowListening());

        removeEvents(window.visualViewport, viewportEvents);
        removeEvents(window, windowEvents);
    };

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

    useEmptyClick(closeMenu, [elem, reference], state.visible);

    const { Menu, ComboBox } = state.components;

    const attachedTo = props.listAttach && props.children;
    const editable = isEditable(state);

    const comboBoxProps = {
        ...state,
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

    const menuProps = {
        ...state,
        className: classNames({
            dd__list_fixed: !!state.fixedMenu,
            dd__list_open: !!state.fixedMenu && !!state.visible,
        }),
        editable,
        onItemClick,
        onInput,
        onDeleteSelectedItem,
        onClearSelection,
        components: {
            ...props.components,
            Header: (showInput) ? DropDownMenuHeader : null,
        },
    };
    const menu = state.visible && (
        <Menu
            {...menuProps}
            ref={elementRef}
        />
    );

    const container = props.container ?? document.body;

    const selected = getSelectedItems(state);
    const selectedIds = selected.map((item) => item.id).join();

    let tabIndex = null;
    let selectTabIndex = null;
    if (!state.disabled) {
        const nativeSelectVisible = false; // isVisible(this.selectElem, true);

        selectTabIndex = (nativeSelectVisible) ? 0 : -1;

        const disableContainerTab = (
            nativeSelectVisible
            || (editable && !props.listAttach)
            || state.active
        );

        tabIndex = (disableContainerTab) ? -1 : 0;
    }

    const select = (<select tabIndex={selectTabIndex}></select>);

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
            disabled={state.disabled}
            data-value={selectedIds}
            ref={innerRef}
        >
            <div ref={referenceRef} >
                {attachedTo}
            </div>
            {comboBox}

            {select}

            {state.visible && !state.fixedMenu && menu}
            {state.visible && state.fixedMenu && (
                createPortal(menu, container)
            )}
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
