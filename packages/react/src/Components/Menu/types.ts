import {
    ComponentType,
    Dispatch,
    ReactNode,
    SetStateAction,
} from 'react';
import { StoreDispatchFunction } from '../../utils/Store/Store.ts';

export type MenuItemContentAlign = 'left' | 'right';

export type NativeButtonType = 'button' | 'submit' | 'reset';

export type MenuItemButtonType =
    NativeButtonType
    | 'link'
    | 'checkbox'
    | 'checkbox-link';

export type MenuItemType =
    MenuItemButtonType
    | 'separator'
    | 'group';

export interface MenuItemCallback<T extends MenuItemProps = MenuItemProps, R = boolean> {
    (item: T, index?: number, arr?: T[]): R;
}

/**
 * toFlatList() function params
 */
export interface ToFlatListParam {
    disabled?: boolean;
    includeGroupItems?: boolean;
}

/**
 * forItems() function params
 */
export interface MenuLoopParam<T extends MenuItemProps = MenuItemProps> {
    includeGroupItems?: boolean;
    group?: T | null;
}

/**
 * .onGroupHeaderClick() method params
 */
export interface OnGroupHeaderClickParam<T = MenuState> {
    item: MenuItemProps;
    e?: React.MouseEvent | React.KeyboardEvent<Element>;

    state: T;
    setState: Dispatch<SetStateAction<T>>;
    dispatch?: StoreDispatchFunction;
}

/**
 * Base menu item props
 */
export interface MenuItemProps {
    id: string;
    type: MenuItemType;
    group?: string | null;

    className: string;
    title: string;
    url?: string;

    active?: boolean;
    selectable?: boolean;
    selected?: boolean;
    disabled?: boolean;
    hidden?: boolean;

    matchFilter?: boolean;

    tabThrough?: boolean;
    activeItem?: string | null;
    iconAlign?: MenuItemContentAlign;
    checkboxSide?: MenuItemContentAlign;
    renderNotSelected?: boolean;

    before?: ReactNode;
    beforeContent?: boolean;
    after?: ReactNode;
    afterContent?: boolean;

    icon?: ComponentType;
    items?: MenuItemProps[];

    components?: {
        Check: ComponentType | null;
    };
}

/**
 * Separator menu item props
 */
export interface MenuSeparatorProps {
    id: string;
    type: string;
    className?: string;
}

/**
 * Menu group item props
 */
export interface MenuGroupItemProps {
    id: string;
    title: string;
    items: MenuItemProps[];

    className: string;
    header: MenuGroupHeaderProps;
    list: MenuListProps;

    beforeContent?: boolean;
    afterContent?: boolean;

    getItemProps?: (
        (item: MenuItemProps, state: MenuListProps) => MenuItemProps
    ) | null;

    components: MenuCommonComponents;
}

/**
 * MenuList component props
 */
export interface MenuListProps {
    id?: string;
    parentId?: string;
    items: MenuItemProps[];

    className?: string | null;
    itemSelector?: string | null;

    activeItem?: string | null;
    disabled?: boolean;
    defaultItemType?: string;
    renderNotSelected?: boolean;
    tabThrough?: boolean;

    iconAlign?: MenuItemContentAlign;
    checkboxSide?: MenuItemContentAlign;
    beforeContent?: boolean;
    afterContent?: boolean;

    onItemClick?: (itemId: string | null, e: React.MouseEvent) => void;
    onMouseEnter?: (itemId: string | null, e: React.MouseEvent) => void;
    onMouseLeave?: (itemId: string | null, e: React.MouseEvent) => void;

    getItemProps?: (
        (item: MenuItemProps, state: MenuListProps) => MenuItemProps
    ) | null;

    getItemDefaultProps?: (() => Partial<MenuItemProps>) | null;

    components: MenuCommonComponents;
}

/**
 * 'ListPlaceholder' component props
 */
export interface MenuPlaceholderProps {
    className?: string;
}

export type MenuPlaceholderComponent = ComponentType<MenuPlaceholderProps>;

export type MenuItemComponent = React.FC<MenuItemProps> & { selector: string; };

export type MenuGroupItemComponent = React.FC<MenuGroupItemProps> & { selector: string; };

/**
 * Menu group header component
 */
export interface MenuGroupHeaderProps {
    title: string;
    className?: string;
}

export type MenuGroupHeaderComponent = React.FC<MenuGroupHeaderProps> & { selector: string; };

export interface MenuCommonComponents {
    List?: ComponentType<MenuListProps>;
    ListItem?: MenuItemComponent;
    ListPlaceholder?: MenuPlaceholderComponent | null;
    Check?: ComponentType | null;
    Separator?: ComponentType<MenuSeparatorProps>;
    GroupHeader?: MenuGroupHeaderComponent;
    GroupItem?: MenuGroupItemComponent;
}

export interface MenuComponents<
    HeaderProps = object,
    FooterProps = object,
> extends MenuCommonComponents {
    Header?: ComponentType<HeaderProps> | null;
    Footer?: ComponentType<FooterProps> | null;
}

export type MenuRef = HTMLDivElement | null;

/**
 * Menu component props.
 *
 * @param HeaderProps - Header props type
 * @param FooterProps - Footer props type
 */
export interface MenuProps<
    HeaderProps = object,
    FooterProps = object,
> {
    id?: string;
    /* Optional identifier of parent */
    parentId?: string;
    /* Children menu items */
    items: MenuItemProps[];
    /* Additional CSS class names */
    className?: string | null;
    /* CSS selector for menu item element */
    itemSelector?: string | null;
    /* Default type of menu item */
    defaultItemType?: string;
    /* Alignment of icon component inside menu item */
    iconAlign?: MenuItemContentAlign;
    /* Select alignment of checkbox component inside menu item */
    checkboxSide?: MenuItemContentAlign;
    /* Allows to select multiple items */
    multiple?: boolean;
    /* Disables all interactions with component */
    disabled?: boolean;
    /* Allows navigate between menu items using Tab key */
    tabThrough?: boolean;
    /* Sets tabIndex property */
    tabIndex?: number;
    /* Enables activation of first/last item on reach end/beginning of menu */
    loopNavigation?: boolean;
    /* Prevents navigation by link on click */
    preventNavigation?: boolean;
    /* Enables focus and activate menu item on hover  */
    focusItemOnHover?: boolean;
    /* Enables render checkbox component even if menu item is not selected */
    renderNotSelected?: boolean;
    /* Enables activation of menu group header */
    allowActiveGroupHeader: boolean;
    /* Identified or active menu item */
    activeItem: string | null;

    /* Props to pass to Header component */
    header?: HeaderProps | null;
    /* Props to pass to Footer component */
    footer?: FooterProps | null;

    onItemClick: (
        (
            item: MenuItemProps,
            e: React.MouseEvent | React.KeyboardEvent<Element>,
        ) => void
    ) | null;

    isAvailableItem?: ((item: MenuItemProps, state: MenuState) => void) | null;

    getItemProps?: (
        (item: MenuItemProps, state: MenuListProps) => MenuItemProps
    ) | null;

    getItemDefaultProps?: (() => Partial<MenuItemProps>) | null;

    onGroupHeaderClick?: ((params: OnGroupHeaderClickParam) => void) | null;

    onItemActivate?: ((itemId: string | null) => void) | null;

    components: MenuComponents<HeaderProps, FooterProps>;
}

export interface MenuState extends MenuProps {
    ignoreTouch: boolean;
}

/**
 * Attributes of Menu component root element
 */
export interface MenuAttrs {
    id?: string;
    className?: string;
    disabled?: boolean;
    tabIndex?: number;
    'data-parent'?: string;

    onFocusCapture: (e: React.FocusEvent) => void;
    onBlurCapture: (e: React.FocusEvent) => void;
    onTouchStartCapture: (e: React.TouchEvent) => void;
    onKeyDownCapture: (e: React.KeyboardEvent) => void;
    onScrollCapture: (e: React.UIEvent) => void;
}
