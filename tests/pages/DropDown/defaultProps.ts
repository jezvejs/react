import { DropDownState, MenuItemState } from '@jezvejs/react-test';

export const defaultDropDownProps: DropDownState = {
    id: '',
    attached: false,
    multiple: false,
    visible: true,
    open: false,
    value: '',
    textValue: '',
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
