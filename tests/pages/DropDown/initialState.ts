import { mapItems } from '../Menu/utils.ts';
import { DropDownPageState } from './types.ts';
import {
    getDropDownMenuItemProps,
    getDropDownProps,
    groupsItems,
    initItems,
} from './utils.ts';

export const initialState: DropDownPageState = {
    inlineDropDown: getDropDownProps({
        id: 'inlineDropDown',
        value: '1',
        textValue: 'Item 1',
        menu: {
            id: 'inlineDropDown',
            allowActiveGroupHeader: false,
            visible: false,
            items: initItems().map((item) => getDropDownMenuItemProps(item)),
        },
    }),
    fullWidthDropDown: getDropDownProps({
        id: 'fullWidthDropDown',
        value: '1',
        textValue: 'Item 1',
        menu: {
            id: 'fullWidthDropDown',
            allowActiveGroupHeader: false,
            visible: false,
            items: initItems().map((item) => getDropDownMenuItemProps(item)),
        },
    }),
    fixedMenuDropDown: getDropDownProps({
        id: 'fixedMenuDropDown',
        value: '1',
        textValue: 'Item 1',
        menu: {
            id: 'fixedMenuDropDown',
            allowActiveGroupHeader: false,
            visible: false,
            items: initItems({ count: 50 }).map((item) => getDropDownMenuItemProps(item)),
        },
    }),
    groupsDropDown: getDropDownProps({
        id: 'groupsDropDown',
        value: 'groupItem13',
        textValue: 'Item 3',
        menu: {
            id: 'groupsDropDown',
            allowActiveGroupHeader: false,
            visible: false,
            items: (
                mapItems(
                    groupsItems(),
                    (item) => getDropDownMenuItemProps(item),
                )
            ),
        },
    }),
    attachedToBlockDropDown: getDropDownProps({
        id: 'attachedToBlockDropDown',
        attached: true,
        value: '1',
        textValue: 'Long Item Lorem Lorem 1',
        menu: {
            id: 'attachedToBlockDropDown',
            allowActiveGroupHeader: false,
            visible: false,
            items: (
                initItems({ title: 'Long Item Lorem Lorem' })
                    .map((item) => getDropDownMenuItemProps(item))
            ),
        },
    }),
    attachedToInlineDropDown: getDropDownProps({
        id: 'attachedToInlineDropDown',
        attached: true,
        value: '1',
        textValue: 'Long Item Lorem Lorem 1',
        menu: {
            id: 'attachedToInlineDropDown',
            allowActiveGroupHeader: false,
            visible: false,
            items: (
                initItems({ title: 'Long Item Lorem Lorem' })
                    .map((item) => getDropDownMenuItemProps(item))
            ),
        },
    }),
};
