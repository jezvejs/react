import { DropDownId, DropDownPageId } from './types.ts';

export const dropDownPageIds: Record<DropDownId, DropDownPageId> = {
    inlineDropDown: 'inline',
    inlineDropDown2: 'inline',
    fullWidthDropDown: 'full-width',
    fixedMenuDropDown: 'fixed-menu',
    groupsDropDown: 'groups',
    attachedToBlockDropDown: 'attach-to-block',
    attachedToInlineDropDown: 'attach-to-inline',
    multipleSelectDropDown: 'multiple-select',
    filterDropDown: 'filter-single',
    filterMultiDropDown: 'filter-multiple',
    attachedFilterDropDown: 'filter-attach-to-block',
    attachedFilterMultipleDropDown: 'filter-multi-attach-to-block',
    filterGroupsDropDown: 'filter-groups',
    filterGroupsMultiDropDown: 'filter-groups-multiple',
};
