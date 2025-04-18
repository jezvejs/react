import { MenuState } from '../Menu/Menu.ts';

export interface DropDownState {
    id: string;
    attached: boolean;
    multiple: boolean;
    visible: boolean;
    open: boolean;
    value: string;
    textValue: string;
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
