import { DropDownState } from '@jezvejs/react-test';

export interface DropDownPageState {
    inlineDropDown: DropDownState;
    fullWidthDropDown: DropDownState;
    fixedMenuDropDown: DropDownState;
    groupsDropDown: DropDownState;
    attachedToBlockDropDown: DropDownState;
    attachedToInlineDropDown: DropDownState;
}

export type InitItemsParams = {
    title?: string;
    idPrefix?: string;
    className?: string;
    startFrom?: number;
    count?: number;
};
