import { ComponentType, ReactNode } from 'react';

import { StoreReducersList } from '../../utils/Store/Store.ts';
import { PopupPositionProps } from '../../hooks/usePopupPosition/types.ts';

import {
    MenuComponents,
    MenuGroupItemProps,
    MenuItemProps,
    MenuListProps,
    MenuPlaceholderProps,
    MenuProps,
    MenuState,
    OnGroupHeaderClickParam,
} from '../Menu/types.ts';
import { TagProps } from '../Tag/Tag.tsx';
import { CloseButtonProps } from '../CloseButton/CloseButton.tsx';
import { ButtonProps } from '../Button/Button.tsx';
import { TagsProps } from '../Tags/Tags.tsx';

/**
 * Combo box MultiSelectionItem component
 */
export type DropDownMultiSelectionItemProps = TagProps;

export type DropDownMultiSelectionItemComponent = React.FC<DropDownMultiSelectionItemProps> & {
    selector: string;
    buttonClass: string;
    placeholderClass: string;
};

/**
 * Combo box MultiSelection component
 */
export type DropDownMultipleSelectionProps = TagsProps;

export type DropDownMultipleSelectionComponent = React.FC<DropDownMultipleSelectionProps>;

/**
 * Input component
 */
export type DropDownValidInputTypes =
    'email'
    | 'number'
    | 'password'
    | 'search'
    | 'tel'
    | 'text'
    | 'url';

export interface DropDownInputProps {
    id?: string,
    className?: string,
    value?: string,
    type?: DropDownValidInputTypes,
    placeholder?: string,
    tabIndex?: number,
    disabled?: boolean,
    onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

export type DropDownInputRef = HTMLInputElement | null;

export type DropDownInputComponent = React.ForwardRefExoticComponent<
    DropDownInputProps & React.RefAttributes<DropDownInputRef>
>;

/**
 * Native select component
 */
export interface OptionProps {
    id: string,
    title: string,
}

export interface OptGroupProps {
    id: string,
    title: string,
    type: 'group',
    disabled?: boolean,
    items: OptionProps[],
}

export interface DropDownNativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    items: (OptionProps | OptGroupProps)[],
}

export type DropDownNativeSelectRef = HTMLSelectElement | null;

export type DropDownNativeSelectComponent = React.ForwardRefExoticComponent<
    DropDownNativeSelectProps
    & React.RefAttributes<DropDownNativeSelectRef>
>;

/**
 * Menu item component
 */
export type DropDownMenuItemProps = MenuItemProps;
export type DropDownMenuItemComponent = React.FC<DropDownMenuItemProps> & {
    selector: string;
};

/**
 * Menu group header component
 */
export interface DropDownGroupHeaderProps {
    title: string,
    className?: string,
}

export type DropDownGroupHeaderComponent = React.FC<DropDownGroupHeaderProps> & {
    selector: string;
};

/**
 * Menu group item component
 */
export type DropDownGroupItemProps = MenuGroupItemProps;
export type DropDownGroupItemComponent = React.FC<DropDownGroupItemProps> & {
    selector: string;
};

/**
 * Menu header component
 */
export interface DropDownMenuHeaderProps {
    inputRef?: React.LegacyRef<HTMLInputElement | null>;
    className?: string;
    inputString?: string | null;
    inputPlaceholder?: string | null;
    useSingleSelectionAsPlaceholder?: boolean;
    disabled?: boolean;
    multiple?: boolean;
    onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    components?: {
        Input: DropDownInputComponent | null;
    };
}

export type DropDownMenuHeaderComponent = React.ComponentType<DropDownMenuHeaderProps>;

/**
 * DropDown menu children components
 */
export interface DropDownMenuComponents extends MenuComponents<DropDownMenuHeaderProps> {
    Header: DropDownMenuHeaderComponent | null,
    Input: DropDownInputComponent | null,
    MenuList: DropDownMenuListComponent,
    ListItem: DropDownMenuItemComponent,
    Check: ComponentType,
    ListPlaceholder: DropDownListPlaceholderComponent | null,
    GroupItem: DropDownGroupItemComponent,
}

/**
 * Menu component
 */
export interface DropDownMenuProps extends MenuProps<DropDownMenuHeaderProps> {
    /* Children menu items */
    items: DropDownMenuItemProps[];
    /* Reference for Input element at custom menu header */
    inputRef: React.MutableRefObject<HTMLInputElement | null>;
    /* Shows menu popup */
    visible?: boolean;
    /* Shows filter input */
    showInput?: boolean;
    /* Allows to filter items */
    editable?: boolean;
    /* Allows to select multiple items */
    multiple: boolean;
    filtered?: boolean;
    className?: string;

    getItemById?: () => void;
    getPlaceholderProps?: () => void;
    onItemActivate: (itemId: string | null) => void;

    onItemClick: (
        (
            item: DropDownMenuItemProps,
            e: React.MouseEvent | React.KeyboardEvent<Element>,
        ) => void
    ) | null;

    onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDeleteSelectedItem?: (params: OnDeleteSelectedItemParam) => void;
    onClearSelection?: () => void;
    onToggle?: () => void;

    onPlaceholderClick?: () => void;

    header?: DropDownMenuHeaderProps;

    components: DropDownMenuComponents;
}

export type DropDownMenuRef = HTMLDivElement | null;

export type DropDownMenuComponent = React.ForwardRefExoticComponent<
    DropDownMenuProps
    & React.RefAttributes<DropDownMenuRef>
>;

/**
 * List placeholder component
 */
export interface DropDownListPlaceholderProps extends MenuPlaceholderProps {
    content: string;
    active: boolean;
    selectable: boolean;
}

export type DropDownListPlaceholderComponent = React.FC<MenuPlaceholderProps>;

/**
 * MenuList component
 */
export type DropDownMenuListProps = MenuListProps;
export type DropDownMenuListComponent = React.FC<DropDownMenuListProps>;

/**
 * Combo box placeholder component
 */
export interface DropDownPlaceholderProps {
    className?: string,
    placeholder: string,
}
export type DropDownPlaceholderComponent = React.FC<DropDownPlaceholderProps>;

/**
 * Combo box single selection component
 */
export interface DropDownSingleSelectionProps {
    className?: string;
    item: {
        title: string;
    };
}

export type DropDownSingleSelectionComponent = React.FC<DropDownSingleSelectionProps>;

/**
 * Combo box ClearButton control component
 */
export type DropDownClearButtonProps = CloseButtonProps;
export type DropDownClearButtonComponent = React.FC<DropDownClearButtonProps>;

/**
 * Combo box ToggleButton control component
 */
export type DropDownToggleButtonProps = ButtonProps;
export type DropDownToggleButtonComponent = React.FC<DropDownToggleButtonProps>;

/**
 * Combo box controls container component
 */
export interface DropDownComboBoxControlsProps {
    multiple: boolean;
    disabled: boolean;
    showClearButton: boolean;
    showToggleButton: boolean;
    actSelItemIndex: number;
    onClearSelection: () => void;
    onToggle: () => void;
    components: {
        ToggleButton: DropDownToggleButtonComponent;
        ClearButton: DropDownClearButtonComponent;
    };
}

export type DropDownComboBoxControlsComponent = React.FC<DropDownComboBoxControlsProps>;

/**
 * Combo box children components
 */
export interface DropDownComboBoxComponents {
    Input: DropDownInputComponent | null;
    Placeholder: DropDownPlaceholderComponent;
    SingleSelection: DropDownSingleSelectionComponent;
    MultipleSelection: DropDownMultipleSelectionComponent;
    MultiSelectionItem: DropDownMultiSelectionItemComponent;
    ComboBoxControls: DropDownComboBoxControlsComponent;
    ToggleButton: DropDownToggleButtonComponent;
    ClearButton: DropDownClearButtonComponent;
}

export interface OnDeleteSelectedItemParam {
    e: React.MouseEvent;
    itemId?: string | null;
}

export interface DropDownComboBoxProps {
    className?: string;
    inputRef: React.MutableRefObject<HTMLInputElement | null>;
    inputString: string | null;
    multiple?: boolean;
    editable?: boolean;
    enableFilter?: boolean;
    disabled?: boolean;
    placeholder?: string;
    useSingleSelectionAsPlaceholder?: boolean;
    showMultipleSelection?: boolean;
    showClearButton?: boolean;
    showToggleButton?: boolean;
    actSelItemIndex?: number;

    onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDeleteSelectedItem: (params: OnDeleteSelectedItemParam) => void;
    onClearSelection: () => void;
    onToggle: () => void;

    components: DropDownComboBoxComponents;
}

export type DropDownComboBoxRef = HTMLDivElement | null;

export type DropDownComboBoxComponent = React.ForwardRefExoticComponent<
    DropDownComboBoxProps & React.RefAttributes<DropDownComboBoxRef>
>;

/**
 * Parameters for onItemSelect() and onChange() callbacks
 */
export interface DropDownSelectedItem {
    id: string;
    value: string;
}

export type DropDownSelectionParam = DropDownSelectedItem[] | DropDownSelectedItem | null;

/**
 * createGroup() function params
 */
export interface DropDownCreateGroupParam {
    id?: string;
    title: string;
    disabled?: boolean;
    items?: DropDownMenuItemProps[];
}

/**
 * DropDown children components
 */
export interface DropDownComponents {
    Input: DropDownInputComponent | null;
    NativeSelect: DropDownNativeSelectComponent;
    Placeholder: DropDownPlaceholderComponent;
    SingleSelection: DropDownSingleSelectionComponent;
    ComboBox: DropDownComboBoxComponent;
    Menu: DropDownMenuComponent;
    MenuList: DropDownMenuListComponent;
    ListItem: DropDownMenuItemComponent;
    Check: ComponentType;
    GroupItem: DropDownGroupItemComponent;
    GroupHeader: DropDownGroupHeaderComponent;
    ListPlaceholder: DropDownListPlaceholderComponent;
    MultipleSelection: DropDownMultipleSelectionComponent;
    MultiSelectionItem: DropDownMultiSelectionItemComponent;
    ComboBoxControls: DropDownComboBoxControlsComponent;
    ToggleButton: DropDownToggleButtonComponent;
    ClearButton: DropDownClearButtonComponent;
}

/**
 * DropDown component props
 */
export interface DropDownProps {
    /* DropDown container element 'id' property */
    id: string;
    /* DropDown menu items */
    items?: DropDownMenuItemProps[];
    /* Select element 'name' property */
    name?: string;
    /* Select element 'form' property */
    form?: string;
    /* Additional CSS classes */
    className?: string;
    /* Content to attach DropDown component to */
    children?: ReactNode;
    /* allow to select multiple items */
    multiple: boolean;
    /* attach menu to element and don't create combo box */
    listAttach: boolean;
    /* If enabled component container will use static position */
    static: boolean;
    /* Callback to verity element to toggle menu list popup */
    isValidToggleTarget: ((el: HTMLElement) => boolean) | null;
    /* If enabled menu will use fixed position or absolute otherwise */
    fixedMenu: boolean;
    /* Enables filtering items by text input */
    enableFilter: boolean;
    /* If enabled menu will be opened on component receive focus */
    openOnFocus: boolean;
    /* If enabled then after last item will be activated first and vice versa */
    loopNavigation: boolean;
    /* Title for empty menu list placeholder */
    noResultsMessage: string;
    /* Enables create new items from filter input value */
    allowCreate: boolean;
    /* Enabled activation of group headers and includes its to item iterations */
    allowActiveGroupHeader: boolean;
    /* Callback returning title for 'Create from filter' menu item */
    addItemMessage: (title: string) => string;
    /* Disabled any interactions with component */
    disabled: boolean;
    /* If enabled component will use native select element on
       small devices(less 768px width) to view list and edit selection */
    useNativeSelect: boolean;
    /* if set true component will show fullscreen popup */
    fullScreen: boolean;
    /* Placeholder text for component */
    placeholder?: string;
    /* Additional reducers */
    reducers: StoreReducersList | null;
    /* If enabled single select component will move focus from input to container
       after select item */
    blurInputOnSingleSelect: boolean;
    /* If enabled single select component will use title of selected item as placeholder */
    useSingleSelectionAsPlaceholder: boolean;
    /* If enabled multiple select component will clear filter input after select item */
    clearFilterOnMultiSelect: boolean;
    /* Enables render multiple selection inside combo box */
    showMultipleSelection: boolean;
    /* Enables render 'clear multiple selection' button inside combo box */
    showClearButton: boolean;
    /* Enables render 'toggle' button inside combo box */
    showToggleButton: boolean;
    /* Optional container for menu popup */
    container?: Element | DocumentFragment;
    /* group header click event handler */
    onGroupHeaderClick: ((params: OnGroupHeaderClickParam<DropDownState>) => void) | null;
    /* item selected event handler */
    onItemSelect: ((params: DropDownSelectionParam | null) => void) | null;
    /* selection changed event handler */
    onChange: ((params: DropDownSelectionParam | null) => void) | null;
    /* filer input event handler */
    onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;

    isAvailableItem?: ((item: MenuItemProps, state: MenuState) => boolean) | null;

    createItem?: (
        (
            props: DropDownMenuItemProps,
            state: DropDownState,
        ) => DropDownMenuItemProps
    ) | null;

    /* Children components */
    components: DropDownComponents;
}

export interface DropDownState extends DropDownProps {
    active: boolean;
    changed: boolean;
    visible: boolean;
    inputString: string | null;
    filtered: boolean;
    actSelItemIndex: number;
    menuId: string | null;
    isTouch: boolean,
    listeningWindow: boolean,
    waitForScroll: boolean,
    fullScreenHeight: number | null,
    renderTime: number,

    createFromInputItemId?: string | null;

    position: PopupPositionProps,
}
