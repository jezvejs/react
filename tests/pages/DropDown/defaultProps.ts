import { DropDownState, MenuItemState } from '@jezvejs/react-test';
import { DropDownPageComponents } from './types.ts';

export const defaultDropDownProps: DropDownState = {
    id: '',
    attached: false,
    enableFilter: false,
    multiple: false,
    visible: true,
    open: false,
    disabled: false,
    value: '',
    textValue: '',
    inputString: null,
    filtered: false,
    allowActiveGroupHeader: false,
    menu: {
        id: '',
        visible: false,
        items: [],
        filteredItems: [],
        allowActiveGroupHeader: false,
    },
};

export const defaultDropDownMenuItemProps: MenuItemState = {
    id: '',
    title: '',
    type: 'button',
    visible: true,
    disabled: false,
    active: false,
    selected: false,
    selectable: false,
};

export const initialComponents: DropDownPageComponents = {
    inlineDropDown: null,
    inlineDropDown2: null,
    fullWidthDropDown: null,
    fixedMenuDropDown: null,
    groupsDropDown: null,
    attachedToBlockDropDown: null,
    attachedToInlineDropDown: null,
    multipleSelectDropDown: null,
    filterDropDown: null,
    filterMultiDropDown: null,
    attachedFilterDropDown: null,
    attachedFilterMultipleDropDown: null,
    filterGroupsDropDown: null,
    filterGroupsMultiDropDown: null,
};
