import {
    Button,
    ButtonState,
    Menu,
    MenuState,
} from '@jezvejs/react-test';

export type PopupMenuPageId =
    | 'default'
    | 'absolute-position'
    | 'hide-on-scroll'
    | 'hide-on-select'
    | 'nested-menus'
    | 'docs';

export type PopupMenuId =
    | 'defaultPopupMenu'
    | 'absPositionPopupMenu'
    | 'hideOnScrollPopupMenu'
    | 'hideOnSelectPopupMenu'
    | 'nestedParentPopupMenu';

export type PopupMenuButtonId =
    | 'defaultMenuButton'
    | 'absPositionMenuButton'
    | 'hideOnScrollMenuButton'
    | 'hideOnSelectMenuButton'
    | 'nestedParentMenuButton';

export type PopupMenuPageComponentsIds =
    PopupMenuId
    | PopupMenuButtonId;

export type PopupMenuComponents = Record<PopupMenuId, Menu | null>;

export type PopupMenuPageComponents =
    PopupMenuComponents
    & Record<PopupMenuButtonId, Button | null>;

export interface PopupMenuState extends MenuState {
    hideOnScroll: boolean;
    hideOnSelect: boolean;
}

export type PopupMenuPageState =
    Record<PopupMenuId, PopupMenuState | null>
    & Record<PopupMenuButtonId, ButtonState | null>;
