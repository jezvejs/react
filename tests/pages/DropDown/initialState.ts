import { MenuItemState } from '@jezvejs/react-test';
import { mapItems } from '../Menu/utils.ts';
import { DropDownPageState } from './types.ts';
import {
    getDropDownMenuItemProps,
    getDropDownProps,
    groupsItems,
    initGroupItems,
    initItems,
} from './utils.ts';

export const initialState: DropDownPageState = {
    inlineDropDown: getDropDownProps({
        id: 'inlineDropDown',
        value: '1',
        textValue: 'Item 1',
        menu: {
            id: 'dropDownMenu_inlineDropDown',
            allowActiveGroupHeader: false,
            visible: false,
            items: initItems().map((item) => getDropDownMenuItemProps(item)),
            filteredItems: [],
        },
    }),
    inlineDropDown2: getDropDownProps({
        id: 'inlineDropDown2',
        value: '1',
        textValue: 'Long item test Lorem ipsum dolor sit amet 1',
        menu: {
            id: 'dropDownMenu_inlineDropDown2',
            allowActiveGroupHeader: false,
            visible: false,
            items: (
                initItems({ title: 'Long item test Lorem ipsum dolor sit amet' })
                    .map((item) => getDropDownMenuItemProps(item))
            ),
            filteredItems: [],
        },
    }),
    fullWidthDropDown: getDropDownProps({
        id: 'fullWidthDropDown',
        value: '1',
        textValue: 'Item 1',
        menu: {
            id: 'dropDownMenu_fullWidthDropDown',
            allowActiveGroupHeader: false,
            visible: false,
            items: initItems().map((item) => getDropDownMenuItemProps(item)),
            filteredItems: [],
        },
    }),
    fixedMenuDropDown: getDropDownProps({
        id: 'fixedMenuDropDown',
        value: '1',
        textValue: 'Item 1',
        menu: {
            id: 'dropDownMenu_fixedMenuDropDown',
            allowActiveGroupHeader: false,
            visible: false,
            items: initItems({ count: 50 }).map((item) => getDropDownMenuItemProps(item)),
            filteredItems: [],
        },
    }),
    groupsDropDown: getDropDownProps({
        id: 'groupsDropDown',
        value: 'groupItem13',
        textValue: 'Item 3',
        menu: {
            id: 'dropDownMenu_groupsDropDown',
            allowActiveGroupHeader: false,
            visible: false,
            items: (
                mapItems(
                    groupsItems(),
                    (item) => getDropDownMenuItemProps(item),
                )
            ),
            filteredItems: [],
        },
    }),
    attachedToBlockDropDown: getDropDownProps({
        id: 'attachedToBlockDropDown',
        attached: true,
        value: '1',
        textValue: 'Long Item Lorem Lorem 1',
        menu: {
            id: 'dropDownMenu_attachedToBlockDropDown',
            allowActiveGroupHeader: false,
            visible: false,
            items: (
                initItems({ title: 'Long Item Lorem Lorem' })
                    .map((item) => getDropDownMenuItemProps(item))
            ),
            filteredItems: [],
        },
    }),
    attachedToInlineDropDown: getDropDownProps({
        id: 'attachedToInlineDropDown',
        attached: true,
        value: '1',
        textValue: 'Long Item Lorem Lorem 1',
        menu: {
            id: 'dropDownMenu_attachedToInlineDropDown',
            allowActiveGroupHeader: false,
            visible: false,
            items: (
                initItems({ title: 'Long Item Lorem Lorem' })
                    .map((item) => getDropDownMenuItemProps(item))
            ),
            filteredItems: [],
        },
    }),
    multipleSelectDropDown: getDropDownProps({
        id: 'multipleSelectDropDown',
        multiple: true,
        value: '',
        textValue: '',
        menu: {
            id: 'dropDownMenu_multipleSelectDropDown',
            allowActiveGroupHeader: false,
            visible: false,
            items: (
                initItems({ title: 'Multi select' })
                    .map((item) => (
                        getDropDownMenuItemProps({
                            ...item,
                            disabled: (item.id === '3'),
                        })
                    ))
            ),
            filteredItems: [],
        },
    }),
    filterDropDown: getDropDownProps({
        id: 'filterDropDown',
        multiple: false,
        value: '1',
        textValue: 'Filter item 1',
        disabled: true,
        enableFilter: true,
        menu: {
            id: 'dropDownMenu_filterDropDown',
            allowActiveGroupHeader: false,
            visible: false,
            items: (
                initItems({ title: 'Filter item', count: 100 })
                    .map((item) => getDropDownMenuItemProps(item))
            ),
            filteredItems: [],
        },
    }),
    filterMultiDropDown: getDropDownProps({
        id: 'filterMultiDropDown',
        multiple: true,
        value: '',
        textValue: '',
        disabled: true,
        enableFilter: true,
        menu: {
            id: 'dropDownMenu_multiFilterDropDown',
            allowActiveGroupHeader: false,
            visible: false,
            items: (
                initItems({ title: 'Filter item', count: 100 })
                    .map((item) => getDropDownMenuItemProps(item))
            ),
            filteredItems: [],
        },
    }),
    attachedFilterDropDown: getDropDownProps({
        id: 'attachedFilterDropDown',
        attached: true,
        value: '1',
        textValue: 'Long Item Lorem Lorem 1',
        menu: {
            id: 'dropDownMenu_attachedFilterDropDown',
            allowActiveGroupHeader: false,
            visible: false,
            items: (
                initItems({ title: 'Filter item', count: 100 })
                    .map((item) => getDropDownMenuItemProps(item))
            ),
            filteredItems: [],
        },
    }),
    attachedFilterMultipleDropDown: getDropDownProps({
        id: 'attachedFilterMultipleDropDown',
        attached: true,
        multiple: true,
        value: '',
        textValue: 'Long Item Lorem Lorem 1',
        menu: {
            id: 'dropDownMenu_attachedFilterMultipleDropDown',
            allowActiveGroupHeader: false,
            visible: false,
            items: (
                initItems({ title: 'Filter item', count: 100 })
                    .map((item) => getDropDownMenuItemProps(item))
            ),
            filteredItems: [],
        },
    }),
    filterGroupsDropDown: getDropDownProps({
        id: 'filterGroupsDropDown',
        value: 'item1',
        textValue: 'Not in group 1',
        disabled: false,
        enableFilter: true,
        menu: {
            id: 'dropDownMenu_filterGroupsDropDown',
            allowActiveGroupHeader: false,
            visible: false,
            items: mapItems(
                initGroupItems() as MenuItemState[],
                (item) => getDropDownMenuItemProps(item),
            ),
            filteredItems: [],
        },
    }),
    filterGroupsMultiDropDown: getDropDownProps({
        id: 'filterGroupsMultiDropDown',
        multiple: true,
        value: '',
        textValue: '',
        disabled: false,
        enableFilter: true,
        menu: {
            id: 'dropDownMenu_filterGroupsMultiDropDown',
            allowActiveGroupHeader: false,
            visible: false,
            items: mapItems(
                initGroupItems() as MenuItemState[],
                (item) => getDropDownMenuItemProps(item),
            ),
            filteredItems: [],
        },
    }),
};
