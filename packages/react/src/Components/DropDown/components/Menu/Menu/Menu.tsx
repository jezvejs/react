import classNames from 'classnames';
import { forwardRef } from 'react';

import { Menu, MenuHelpers } from '../../../../Menu/Menu.tsx';
import { MenuItemProps, MenuItemType, MenuProps } from '../../../../Menu/types.ts';

import {
    DropDownMenuComponent,
    DropDownMenuHeaderProps,
    DropDownMenuProps,
    DropDownMenuRef,
} from '../../../types.ts';
import './Menu.scss';

const defaultProps = {
    items: [],
    showInput: false,
    getItemById: null,
    onItemActivate: null,
    onItemClick: null,
    onPlaceholderClick: null,
    multiple: false,
    filtered: false,
    getPlaceholderProps: null,
    header: {
        inputElem: null,
        inputString: '',
        inputPlaceholder: '',
        useSingleSelectionAsPlaceholder: false,
    },
};

/**
 * DropDown Menu container component
 */
export const DropDownMenu: DropDownMenuComponent = forwardRef<
    DropDownMenuRef,
    DropDownMenuProps
>((p, ref) => {
    const props = {
        ...defaultProps,
        ...p,
        header: {
            ...defaultProps.header,
            ...(p?.header ?? {}),
        },
    };

    const { multiple, filtered } = props;
    const defaultItemType: MenuItemType = (multiple) ? 'checkbox' : 'button';

    const items = MenuHelpers.mapItems(props.items, (item: MenuItemProps) => ({
        ...item,
        type: (item.type !== 'group') ? defaultItemType : item.type,
        multiple,
        filtered,
        hidden: item.hidden || (filtered && !item.matchFilter),
    }));

    const filteredItems = (props.visible)
        ? MenuHelpers.filterItems(items, (item) => !!(
            !item.hidden && (!filtered || item.matchFilter)
        ))
        : [];

    const menuProps: MenuProps<DropDownMenuHeaderProps> = {
        ...props,
        defaultItemType,
        tabThrough: false,
        className: classNames('dd__list', props.className),
        items: filteredItems,
        parentId: props.parentId,
    };
    delete menuProps.tabIndex;

    return (
        <Menu {...menuProps} ref={ref} />
    );
});

DropDownMenu.displayName = 'DropDownMenu';
