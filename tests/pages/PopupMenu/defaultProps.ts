import { MenuItemState } from '@jezvejs/react-test';
import { PopupMenuComponents, PopupMenuPageComponents } from './types.ts';

export const defaultMenuItemProps: MenuItemState = {
    id: '',
    title: '',
    type: 'button',
    visible: true,
    disabled: false,
    active: false,
    selected: false,
    selectable: false,
};

export const initialPopupMenuComponents: PopupMenuComponents = {
    defaultPopupMenu: null,
    absPositionPopupMenu: null,
    hideOnScrollPopupMenu: null,
    hideOnSelectPopupMenu: null,
    nestedParentPopupMenu: null,
};

export const initialComponents: PopupMenuPageComponents = {
    ...initialPopupMenuComponents,
    defaultMenuButton: null,
    absPositionMenuButton: null,
    hideOnScrollMenuButton: null,
    hideOnSelectMenuButton: null,
    nestedParentMenuButton: null,
};
