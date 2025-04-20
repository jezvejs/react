import { DropDownState, MenuItemState } from '@jezvejs/react-test';

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
