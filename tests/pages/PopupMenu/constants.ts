import { PopupMenuButtonId, PopupMenuId, PopupMenuPageId } from './types.ts';

export const popupMenuPageIds: Record<PopupMenuId, PopupMenuPageId> = {
    defaultPopupMenu: 'default',
    absPositionPopupMenu: 'absolute-position',
    hideOnScrollPopupMenu: 'hide-on-scroll',
    hideOnSelectPopupMenu: 'hide-on-select',
    nestedParentPopupMenu: 'nested-menus',
};

export const popupMenuButtonIds: Record<PopupMenuId, PopupMenuButtonId> = {
    defaultPopupMenu: 'defaultMenuButton',
    absPositionPopupMenu: 'absPositionMenuButton',
    hideOnScrollPopupMenu: 'hideOnScrollMenuButton',
    hideOnSelectPopupMenu: 'hideOnSelectMenuButton',
    nestedParentPopupMenu: 'nestedParentMenuButton',
};
