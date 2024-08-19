import { asArray } from '@jezvejs/types';
import { MenuHelpers } from '../Menu/Menu.tsx';
import { DropDownMenuItemProps, DropDownProps, DropDownState } from './types.ts';
import { MenuState } from '../Menu/types.ts';

/** Returns array of selected items */
export const getSelectedItems = (state: DropDownState) => (
    MenuHelpers.toFlatList<DropDownMenuItemProps>(state?.items ?? [], {
        includeGroupItems: state.allowActiveGroupHeader,
    }).filter((item) => item?.selected)
);

/** Returns true is item is visible */
export const isVisibleItem = (item: DropDownMenuItemProps, state: DropDownState) => (
    (state?.filtered)
        ? (item?.matchFilter && !item.hidden)
        : (item && !item.hidden)
);

/** Returns array of visible items */
export const getVisibleItems = (state: DropDownState | DropDownMenuItemProps) => (
    MenuHelpers.toFlatList<DropDownMenuItemProps>(state?.items ?? [], {
        includeGroupItems: (state as DropDownState).allowActiveGroupHeader,
    }).filter((item: DropDownMenuItemProps) => (
        (item.type === 'group' && getVisibleItems(item).length > 0)
        || (item.type !== 'group' && isVisibleItem(item, state as DropDownState))
    ))
);

/**
 * Returns list items of specified group
 * @param {Object} group - group object
 * @param {Object} state - state object
 */
export const getGroupItems = (group, state: DropDownState) => (
    MenuHelpers.getItemById<DropDownMenuItemProps>(
        group?.id,
        state.items ?? [],
    )?.items ?? []
);

/**
 * Returns visible list items of specified group
 * @param {Object} group - group object
 * @param {Object} state - state object
 */
export const getVisibleGroupItems = (group, state: DropDownState) => (
    getGroupItems(group, state).filter((item) => (
        isVisibleItem(item, state)
    ))
);

/** Returns true if filter input is available and enabled */
export const isEditable = (state: DropDownState): boolean => !!(
    state.enableFilter
    && !state.disabled
    && (!state.fullScreen || state.visible)
);

export const defaultIsAvailableItem = (
    item: DropDownMenuItemProps,
    state: DropDownState,
): boolean => !!(
    item
    && !item.hidden
    && !item.disabled
    && ((state.filtered) ? item.matchFilter : true)
    && (
        item.type !== 'group'
        || state.allowActiveGroupHeader
    )
);

export const isAvailableItem = (item: DropDownMenuItemProps, state: DropDownState): boolean => (
    (state.isAvailableItem)
        ? state.isAvailableItem?.(item, (state as object) as MenuState)
        : defaultIsAvailableItem(item, state)
);

/** Return array of visible and enabled list items */
export const getAvailableItems = (state: DropDownState): DropDownMenuItemProps[] => {
    const options = {
        includeGroupItems: state.allowActiveGroupHeader,
    };

    const customCallback = (item: DropDownMenuItemProps) => (
        state.isAvailableItem!(item, (state as object) as MenuState)
    );

    const filterCallback = (typeof state.isAvailableItem === 'function')
        ? customCallback
        : defaultIsAvailableItem;

    const flatList = MenuHelpers.toFlatList<DropDownMenuItemProps>(
        state.items ?? [],
        options,
    );
    return flatList.filter((item: DropDownMenuItemProps) => filterCallback(item, state));
};

/** Returns new item object */
export const createMenuItem = (
    props: DropDownMenuItemProps,
    state: DropDownState,
): DropDownMenuItemProps => {
    const defaultItemProps = {
        selectable: true,
        selected: false,
        hidden: false,
        disabled: false,
        group: null,
    };

    const res = {
        ...defaultItemProps,
        ...props,
        id: props.id.toString(),
        active: false,
    };

    return (typeof state.createItem === 'function')
        ? state.createItem(res, state)
        : res;
};

/**
 * Create items from specified array
 * @param {Object|Object[]} items
 * @param {Object} state
 */
export const createItems = (
    items: DropDownMenuItemProps | DropDownMenuItemProps[],
    state: DropDownState,
): DropDownMenuItemProps[] => (
    MenuHelpers.mapItems(
        asArray(items),
        (item) => createMenuItem(item, state),
        { includeGroupItems: state.allowActiveGroupHeader },
    )
);

export const generateGroupId = (state: DropDownState) => (
    MenuHelpers.generateItemId(state.items ?? [], 'group')
);

/**
 * Create new group
 * @param {string} label
 */
export const createGroup = (options, state) => {
    const {
        title,
        disabled = false,
        items = [],
        ...rest
    } = options;

    const group = {
        id: options.id?.toString() ?? generateGroupId(state),
        type: 'group',
        title,
        disabled,
        items,
        ...rest,
    };

    return group;
};

export const getInitialState = (
    props: Partial<DropDownProps>,
    defaultProps: DropDownProps,
): DropDownState => {
    const res: DropDownState = {
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
        createItem: createMenuItem,
        components: {
            ...(defaultProps?.components ?? {}),
            ...props.components,
        },
    };

    res.isAvailableItem = (typeof props.isAvailableItem === 'function')
        ? (item, state) => !!props.isAvailableItem?.(item, state)
        : (item, state) => defaultIsAvailableItem(item, (state as object) as DropDownState);

    res.items = (props.items ?? []).map((item: DropDownMenuItemProps) => (
        createMenuItem(item, res)
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
 * @param {string} itemId - identifier of item to start looking from
 */
export const getPrevAvailableItem = (itemId: string, state: DropDownState) => (
    MenuHelpers.getPreviousItem<DropDownMenuItemProps>(
        itemId,
        state.items ?? [],
        (item) => isAvailableItem(item, state),
        { includeGroupItems: state.allowActiveGroupHeader },
    )
);

/**
 * Return list item available to select next to specified item
 * @returns null in case specified list item is not found or on last position
 * @param {string} itemId - identifier of item to start looking from
 */
export const getNextAvailableItem = (itemId: string, state: DropDownState) => (
    MenuHelpers.getNextItem<DropDownMenuItemProps>(
        itemId,
        state.items ?? [],
        (item) => isAvailableItem(item, state),
        { includeGroupItems: state.allowActiveGroupHeader },
    )
);

/** Returns active list item */
export const getActiveItem = (state: DropDownState) => (
    MenuHelpers.findMenuItem<DropDownMenuItemProps>(
        state.items ?? [],
        (item: DropDownMenuItemProps) => !!item?.active,
    )
);
