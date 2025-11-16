import { DropDown, DropDownState } from '@jezvejs/react-test';
import { ToggleEnableDropDown } from './components/ToggleEnableDropDown.ts';

export type DropDownComponents = {
    inlineDropDown: DropDown | null;
    inlineDropDown2: DropDown | null;
    fullWidthDropDown: DropDown | null;
    fixedMenuDropDown: DropDown | null;
    groupsDropDown: DropDown | null;
    attachedToBlockDropDown: DropDown | null;
    attachedToInlineDropDown: DropDown | null;
    multipleSelectDropDown: DropDown | null;
    attachedFilterDropDown: DropDown | null;
    attachedFilterMultipleDropDown: DropDown | null;
    filterGroupsDropDown: DropDown | null;
    filterGroupsMultiDropDown: DropDown | null;
};

export type DropDownPageId =
    | 'inline'
    | 'full-width'
    | 'fixed-menu'
    | 'groups'
    | 'attach-to-block'
    | 'attach-to-inline'
    | 'multiple-select'
    | 'filter-single'
    | 'filter-multiple'
    | 'attached-filter'
    | 'filter-attach-to-block'
    | 'filter-multi-attach-to-block'
    | 'filter-groups'
    | 'filter-groups-multiple';

export type ToggleEnableDropDownComponents = {
    filterDropDown: ToggleEnableDropDown | null;
    filterMultiDropDown: ToggleEnableDropDown | null;
};

export type DropDownPageComponents = DropDownComponents & ToggleEnableDropDownComponents;

export type SimpleDropDownId = keyof DropDownComponents;
export type ToggleEnableDropDownId = keyof ToggleEnableDropDownComponents;
export type DropDownId = SimpleDropDownId | ToggleEnableDropDownId;

export interface DropDownPageState {
    inlineDropDown: DropDownState;
    inlineDropDown2: DropDownState;
    fullWidthDropDown: DropDownState;
    fixedMenuDropDown: DropDownState;
    groupsDropDown: DropDownState;
    attachedToBlockDropDown: DropDownState;
    attachedToInlineDropDown: DropDownState;
    multipleSelectDropDown: DropDownState;
    filterDropDown: DropDownState;
    filterMultiDropDown: DropDownState;
    attachedFilterDropDown: DropDownState;
    attachedFilterMultipleDropDown: DropDownState;
    filterGroupsDropDown: DropDownState;
    filterGroupsMultiDropDown: DropDownState;
}

export type InitItemsParams = {
    title?: string;
    idPrefix?: string;
    className?: string;
    startFrom?: number;
    count?: number;
};
