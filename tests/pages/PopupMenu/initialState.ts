import { PopupMenuPageState } from './types.ts';
import { getMenuItemProps } from './utils.ts';

const getDefaultMenuItems = () => ([
    getMenuItemProps({ id: 'selectBtnItem', title: 'Button item' }),
    getMenuItemProps({ id: 'linkItem', title: 'Link item', type: 'link' }),
    getMenuItemProps({ id: 'noIconItem', title: 'No icon item' }),
    getMenuItemProps({
        id: 'checkboxItem',
        title: 'Checkbox item',
        type: 'checkbox',
        selectable: true,
        selected: true,
    }),
]);

const defaultButtonState = {
    title: '',
    visible: true,
    enabled: true,
    type: 'button',
};

export const initialState: PopupMenuPageState = {
    defaultPopupMenu: {
        id: 'defaultPopupMenu',
        visible: false,
        allowActiveGroupHeader: false,
        hideOnScroll: true,
        hideOnSelect: true,
        items: getDefaultMenuItems(),
        filteredItems: [],
    },
    defaultMenuButton: { ...defaultButtonState },

    absPositionPopupMenu: {
        id: 'absPositionPopupMenu',
        visible: false,
        allowActiveGroupHeader: false,
        hideOnScroll: true,
        hideOnSelect: true,
        items: getDefaultMenuItems(),
        filteredItems: [],
    },
    absPositionMenuButton: { ...defaultButtonState },

    hideOnScrollPopupMenu: {
        id: 'hideOnScrollPopupMenu',
        visible: false,
        allowActiveGroupHeader: false,
        hideOnScroll: false,
        hideOnSelect: true,
        items: getDefaultMenuItems(),
        filteredItems: [],
    },
    hideOnScrollMenuButton: { ...defaultButtonState },

    hideOnSelectPopupMenu: {
        id: 'hideOnSelectPopupMenu',
        visible: false,
        allowActiveGroupHeader: false,
        hideOnScroll: true,
        hideOnSelect: false,
        items: getDefaultMenuItems(),
        filteredItems: [],
    },

    hideOnSelectMenuButton: { ...defaultButtonState },

    nestedParentPopupMenu: {
        id: 'nestedParentPopupMenu',
        visible: false,
        allowActiveGroupHeader: false,
        hideOnScroll: true,
        hideOnSelect: true,
        items: [
            ...getDefaultMenuItems(),
        ],
        filteredItems: [],
    },
    nestedParentMenuButton: { ...defaultButtonState },
};
