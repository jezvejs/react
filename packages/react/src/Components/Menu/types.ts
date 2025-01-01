import {
    ComponentType,
    Dispatch,
    ReactNode,
    SetStateAction,
} from 'react';
import { StoreDispatchFunction, StoreReducersList } from '../../utils/Store/Store.ts';

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
    | 'group'
    | 'parent';

export interface MenuItemCallback<T extends MenuItemProps = MenuItemProps, R = boolean> {
    (item: T, index?: number, arr?: T[]): R;
}

/**
 * shouldIncludeParentItem() function params
 */
export interface IncludeGroupItemsParam {
    includeGroupItems?: boolean;
    includeChildItems?: boolean;
}

/**
 * toFlatList() function params
 */
export interface ToFlatListParam extends IncludeGroupItemsParam {
    parentId?: string;
    disabled?: boolean;
}

/**
 * forItems() function params
 */
export interface MenuLoopParam<
    T extends MenuItemProps = MenuItemProps,
> extends IncludeGroupItemsParam {
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
    parentId?: string;

    className?: string;
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

    components?: MenuCommonComponents;
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
export interface MenuGroupItemProps extends MenuItemProps {
    items: MenuItemProps[];

    header: MenuGroupHeaderProps;
    list: MenuListProps;

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
    useParentContext?: boolean;
    items: MenuItemProps[];

    className?: string | null;
    menuSelector?: string | null;
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

    placeholder?: MenuPlaceholderProps | null;

    onItemClick?: (itemId: string | null, e: React.MouseEvent) => void;
    onMouseEnter?: (itemId: string | null, e: React.MouseEvent) => void;
    onMouseLeave?: (itemId: string | null, e: React.MouseEvent) => void;

    getItemProps?: (
        (item: MenuItemProps, state: MenuListProps) => MenuItemProps
    ) | null;

    getItemComponent?: (
        (item: MenuItemProps, state: MenuListProps) => (MenuItemComponent | null)
    ) | null;

    getItemDefaultProps?: (() => Partial<MenuItemProps>) | null;

    getPlaceholderProps?: ((state: MenuListProps) => (MenuPlaceholderProps | null)) | null;

    components: MenuCommonComponents;
}

/**
 * 'ListPlaceholder' component props
 */
export interface MenuPlaceholderProps {
    className?: string;
    active?: boolean;
    selectable?: boolean;
    content?: React.ReactNode;
}

export type MenuPlaceholderComponent = React.FC<MenuPlaceholderProps>;

type WithSelector = {
    selector?: string;
};

export type MenuItemComponent = (
    (React.FC<MenuItemProps> & WithSelector)
    | (React.MemoExoticComponent<React.FC<MenuItemProps>> & WithSelector)
);

export type MenuGroupItemComponent = React.FC<MenuGroupItemProps> & WithSelector;

/**
 * Menu group header component
 */
export type MenuGroupHeaderProps = MenuItemProps;

export type MenuGroupHeaderComponent = React.FC<MenuGroupHeaderProps> & WithSelector;

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
    /* If enabled component will use parent store provider */
    useParentContext?: boolean;
    /* Children menu items */
    items: MenuItemProps[];
    /* Additional CSS class names */
    className?: string | null;
    /* CSS selector for menu element */
    menuSelector?: string | null;
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
    allowActiveGroupHeader?: boolean;
    /* Identified of active menu */
    activeMenu?: string | null;
    /* Identified of active menu item */
    activeItem?: string | null;

    /* Additional reducers */
    reducers?: StoreReducersList | null;

    /* Props to pass to Header component */
    header?: HeaderProps | null;
    /* Props to pass to Footer component */
    footer?: FooterProps | null;
    /* Props to pass to ListPlaceholder component */
    placeholder?: MenuPlaceholderProps | null;

    onKeyDown?: ((e: React.KeyboardEvent) => boolean) | null;

    onItemClick?: (
        (
            item: MenuItemProps,
            e: React.MouseEvent | React.KeyboardEvent<Element>,
        ) => void
    ) | null;

    isAvailableItem?: ((item: MenuItemProps, state: MenuState) => void) | null;

    getItemProps?: (
        (item: MenuItemProps, state: MenuListProps) => MenuItemProps
    ) | null;

    getItemComponent?: (
        (item: MenuItemProps, state: MenuListProps) => (MenuItemComponent | null)
    ) | null;

    getItemDefaultProps?: (() => Partial<MenuItemProps>) | null;

    getPlaceholderProps?: ((state: MenuListProps) => (MenuPlaceholderProps | null)) | null;

    onGroupHeaderClick?: ((params: OnGroupHeaderClickParam) => void) | null;

    onItemActivate?: ((itemId: string | null) => void) | null;

    components?: MenuComponents<HeaderProps, FooterProps>;
}

export interface MenuState extends MenuProps {
    ignoreTouch: boolean;
}

export interface MultiMenuState {
    menu: {
        [id: string]: MenuState;
    },
}

export type MenuStore = MenuState | MultiMenuState;

/**
 * Attributes of Menu component root element
 */
export interface MenuAttrs extends React.HTMLAttributes<HTMLDivElement> {
    disabled?: boolean;
    'data-id'?: string;
    'data-parent'?: string;

    onFocusCapture?: (e: React.FocusEvent) => void;
    onBlurCapture?: (e: React.FocusEvent) => void;
    onTouchStartCapture?: (e: React.TouchEvent) => void;
    onKeyDownCapture?: (e: React.KeyboardEvent) => void;
    onScrollCapture?: (e: React.UIEvent) => void;
    onContextMenuCapture?: (e: React.MouseEvent) => void;
}
