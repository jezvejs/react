import { isFunction } from '@jezvejs/types';
import PropTypes from 'prop-types';
import { MenuHelpers } from '../Menu/Menu.jsx';

/** Returns array of selected items */
export const getSelectedItems = (state) => (
    MenuHelpers.toFlatList(state?.items ?? [], {
        includeGroupItems: state.allowActiveGroupHeader,
    }).filter((item) => item?.selected)
);

/** Returns true is item is visible */
export const isVisibleItem = (item, state) => (
    (state?.filtered)
        ? (item?.matchFilter && !item.hidden)
        : (item && !item.hidden)
);

/** Returns array of visible items */
export const getVisibleItems = (state) => (
    MenuHelpers.toFlatList(state?.items ?? [], {
        includeGroupItems: state.allowActiveGroupHeader,
    }).filter((item) => (
        (item.type === 'group' && getVisibleItems(item).length > 0)
        || (item.type !== 'group' && isVisibleItem(item, state))
    ))
);

/**
 * Returns list items of specified group
 * @param {Object} group - group object
 * @param {Object} state - state object
 */
export const getGroupItems = (group, state) => (
    MenuHelpers.getItemById(group?.id, state.items)?.items ?? []
);

/**
 * Returns visible list items of specified group
 * @param {Object} group - group object
 * @param {Object} state - state object
 */
export const getVisibleGroupItems = (group, state) => (
    getGroupItems(group, state).filter((item) => (
        isVisibleItem(item, state)
    ))
);

/** Returns true if filter input is available and enabled */
export const isEditable = (state) => (
    state.enableFilter
    && !state.disabled
    && (!state.fullScreen || state.visible)
);

export const isAvailableItem = (item, state) => (
    !!item
    && !item.hidden
    && !item.disabled
    && ((state.filtered) ? item.matchFilter : true)
    && (
        item.type !== 'group'
        || state.allowActiveGroupHeader
    )
);

/** Return array of visible and enabled list items */
export const getAvailableItems = (state) => {
    const options = {
        includeGroupItems: state.allowActiveGroupHeader,
    };

    const filterCallback = isFunction(state.isAvailableItem)
        ? (item) => state.isAvailableItem(item, state)
        : (item) => isAvailableItem(item, state);

    return MenuHelpers.toFlatList(state.items, options).filter(filterCallback);
};

export const getInitialState = (props, defaultProps) => {
    const res = {
        ...(defaultProps ?? {}),
        ...props,
        active: false,
        changed: false,
        visible: false,
        inputString: null,
        filtered: false,
        items: [],
        actSelItemIndex: -1,
        menuId: MenuHelpers.generateItemId([]),
        isTouch: false,
        listeningWindow: false,
        waitForScroll: false,
        fullScreenHeight: null,
        renderTime: Date.now(),
        position: {
        },
        createItem: (item, state) => MenuHelpers.createMenuItem(item, state),
        isAvailableItem: (item, state) => isAvailableItem(item, state),
        components: {
            ...(defaultProps?.components ?? {}),
            ...props.components,
        },
    };

    res.items = props.items.map((item) => (
        MenuHelpers.createMenuItem(item, res)
    ));

    const [selectedItem] = getSelectedItems(res);
    if (!selectedItem && !res.multiple) {
        const itemToSelect = MenuHelpers.toFlatList(res.items).find((item) => (
            isAvailableItem(item, res)
        ));

        if (itemToSelect) {
            res.items = MenuHelpers.mapItems(res.items, (item) => (
                (item.selected !== (item.id === itemToSelect.id))
                    ? { ...item, selected: !item.selected }
                    : item
            ));
        }
    }

    return res;
};

/**
 * Return list item available to select prior to specified item
 * @returns null in case specified list item is not found or on first position
 * @param {number} itemId - identifier of item to start looking from
 */
export const getPrevAvailableItem = (itemId, state) => (
    MenuHelpers.getPreviousItem(
        itemId,
        state.items,
        (item) => isAvailableItem(item, state),
        { includeGroupItems: state.allowActiveGroupHeader },
    )
);

/**
 * Return list item available to select next to specified item
 * @returns null in case specified list item is not found or on last position
 * @param {number} itemId - identifier of item to start looking from
 */
export const getNextAvailableItem = (itemId, state) => (
    MenuHelpers.getNextItem(
        itemId,
        state.items,
        (item) => isAvailableItem(item, state),
        { includeGroupItems: state.allowActiveGroupHeader },
    )
);

/** Returns active list item */
export const getActiveItem = (state) => (
    MenuHelpers.findMenuItem(state.items, (item) => item.active)
);

export const componentPropType = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
]);
