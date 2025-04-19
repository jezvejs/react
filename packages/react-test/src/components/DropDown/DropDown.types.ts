import { MenuState } from '../Menu/Menu.ts';
import { MenuItemState } from '../MenuItem/MenuItem.ts';

export interface DropDownState {
    id: string;
    attached: boolean;
    enableFilter: boolean;
    filtered: boolean;
    multiple: boolean;
    visible: boolean;
    disabled: boolean;
    open: boolean;
    allowActiveGroupHeader: boolean;
    value: string;
    textValue: string;
    inputString: string | null;
    menu?: MenuState;
}

export interface DropDownMultiSelectionItemState {
    id?: string;
    title: string;
    visible: boolean;
    disabled: boolean;
    active: boolean;
    multiple: boolean;
}

export interface DropDownMultiSelectionState {
    id: string;
    visible: boolean;
    items: DropDownMultiSelectionItemState[];
}

export interface DropDownMenuItemProps extends MenuItemState {
    matchFilter?: boolean;
}
