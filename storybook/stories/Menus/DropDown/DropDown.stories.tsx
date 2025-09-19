import type { Meta, StoryFn } from '@storybook/react';

import { asArray } from '@jezvejs/types';
import '@jezvejs/react/style.scss';
import {
    createSlice,
    DropDown,
    DropDownSelectionParam,
    StoreProvider,
    Tags,
} from '@jezvejs/react';
import { useState } from 'react';

import { groupsItems, initGroupItems } from 'common/assets/data/dropDownData.ts';
import { usePortalElement } from 'common/hooks/usePortalElement.tsx';
import { initItems } from 'common/utils/utils.ts';

// Local components
import { AttachedToBlock } from './components/AttachedToBlock/AttachedToBlock.tsx';
import { CollapsibleGroupsSelect } from './components/CollapsibleGroups/CollapsibleGroupsSelect.tsx';
import { CustomControlsSelect } from './components/CustomControls/CustomControlsSelect.tsx';
import { CustomListItem } from './components/CustomListItem/CustomListItem.tsx';
import { CustomSelectionItem } from './components/CustomSelectionItem/CustomSelectionItem.tsx';
import { ToggleEnable } from './components/ToggleEnable/ToggleEnable.tsx';

import {
    AttachedToBlockStory,
    DropDownStory,
    MultipleSelectionTagsState,
    ToggleEnableDropDownStory,
} from './types.ts';
import './DropDown.stories.scss';

const heightDecorator = (StoryComponent: StoryFn) => (
    <div className="height-container">
        <StoryComponent />
    </div>
);

const fixedDecorator = (StoryComponent: StoryFn) => (
    <div className="fixed-menu-container">
        <StoryComponent />
    </div>
);

const textDecorator = (StoryComponent: StoryFn) => (
    <div className="text-container">
        <StoryComponent />
    </div>
);

const meta: Meta<typeof DropDown> = {
    title: 'Menu/DropDown',
    component: DropDown,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};
export default meta;

/**
 * Basic inline drop down component
 */
export const Inline: DropDownStory = {
    args: {
    },
    decorators: [heightDecorator],
    render: function Render() {
        const portalElement = usePortalElement();

        const args1 = {
            id: 'inlineDropDown',
            className: 'dd__container_no-shrink',
            placeholder: 'Select item',
            items: initItems(),
        };
        const args2 = {
            id: 'inlineDropDown2',
            className: 'dd__container_ellipsis',
            placeholder: 'Select item 2',
            static: true,
            items: initItems({ title: 'Long item test Lorem ipsum dolor sit amet' }),
        };

        const slice = createSlice({});
        const initialState = {};

        return (
            <StoreProvider
                reducer={slice.reducer}
                initialState={initialState}
            >
                <div className='inline-container'>
                    <DropDown {...args1} container={portalElement} />
                    <DropDown {...args2} container={portalElement} />
                </div>
            </StoreProvider>
        );
    },
};

/**
 * Example of width: 100% style applied to the component
 */
export const FullWidth: DropDownStory = {
    args: {
        id: 'fullWidthDropDown',
        className: 'dd_stretch',
        placeholder: 'Select item 3',
        items: initItems(),
    },
    decorators: [heightDecorator],
};

/**
 * Use 'fixedMenu' to apply fixed positioning for drop down menu
 */
export const FixedMenu: DropDownStory = {
    args: {
        id: 'fixedMenuDropDown',
        fixedMenu: true,
        className: 'dd_form',
        items: initItems({ count: 50 }),
    },
    decorators: [fixedDecorator],
    render: function Render(args) {
        const portalElement = usePortalElement();

        return (
            <DropDown {...args} container={portalElement} />
        );
    },
};

/**
 * Effect of 'disabled' option on menu items.
 * Disabled items rendered with dimmed style and not available to focus and select.
 */
export const DisabledItems: DropDownStory = {
    args: {
        id: 'disabledItemsDropDown',
        items: initItems().map((item) => (
            (item.id === '3' || item.id === '5')
                ? { ...item, disabled: true }
                : item
        )),
    },
    decorators: [heightDecorator],
};

/**
 * Grouped menu items example.
 * Use menu item with properties 'type'='group' and 'items' containing array of grouped items
 */
export const Groups: DropDownStory = {
    args: {
        id: 'groupsDropDown',
        items: groupsItems(),
    },
    decorators: [heightDecorator],
};

/**
 * Attach drop down menu to the block element.
 * Click on close button should have no effect on menu popup.
 */
export const AttachToBlock: AttachedToBlockStory = {
    args: {
        id: 'attachedToBlockDropDown',
        listAttach: true,
        isValidToggleTarget: (elem) => !elem.closest('.close-btn'),
        items: initItems({ title: 'Long Item Lorem Lorem' }),
    },
    decorators: [heightDecorator],
    render: function Render(args) {
        return <AttachedToBlock {...args} />;
    },
};

/**
 * Attach drop down menu to the inline element.
 * Popup menu should be positioned next to wrapped text.
 */
export const AttachToInline: DropDownStory = {
    args: {
        id: 'attachedToInlineDropDown',
        className: 'dd_inline',
        listAttach: true,
        items: initItems({ title: 'Long Item Lorem Lorem' }),
    },
    decorators: [textDecorator],
    render: function Render(args) {
        const portalElement = usePortalElement();

        return (
            <>
                <span>Lorem ipsum dolor sit, amet consectetur&nbsp;</span>
                <DropDown {...args} container={portalElement}>
                    <span id="inlineTarget" className="link-inline">click</span>
                </DropDown>
                <span>&nbsp;adipisicing elit. Aut consequatur iure repellat</span>
            </>
        );
    },
};

/**
 * Use 'static' property to avoid clipping drop down menu.
 * Or as alternative you can use 'fixedMenu'
 */
export const Clipping: DropDownStory = {
    args: {
    },
    decorators: [textDecorator],
    render: function Render() {
        const portalElement = usePortalElement();

        const args1 = {
            static: true,
            items: initItems(),
        };
        const args2 = {
            items: initItems(),
        };

        return (
            <div className='offset-parent'>
                <div className='clipper'>
                    <DropDown {...args1} container={portalElement} />
                    <DropDown {...args2} container={portalElement} />
                </div>
            </div>
        );
    },
};

/**
 * Use property 'multiple' to enable selection of multiple items
 */
export const MultipleSelect: DropDownStory = {
    args: {
        id: 'multipleSelectDropDown',
        className: 'dd_stretch',
        placeholder: 'Multi select control',
        multiple: true,
        items: initItems({ title: 'Multi select' }).map((item) => ({
            ...item,
            disabled: (item.id === '3'),
        })),
    },
    decorators: [textDecorator],
};

/**
 * Use 'disabled' property to control availability of component interactions
 * Disabled component renders with dimmed style, not available to focus, select items and excluded
 * from parent form.
 */
export const DisabledSingle: DropDownStory = {
    args: {
        className: 'dd_stretch',
        disabled: true,
        placeholder: 'Single select control',
        items: initItems().map((item) => ({
            ...item,
            selected: (item.id === '3'),
            disabled: (item.id === '4'),
        })),
    },
    decorators: [textDecorator],
    render: ToggleEnable,
};

/**
 * Use 'disabled' property to control availability of component interactions
 * Disabled component renders with dimmed style, not available to focus, select items and excluded
 * from parent form.
 */
export const DisabledMultiple: DropDownStory = {
    args: {
        className: 'dd_stretch',
        disabled: true,
        multiple: true,
        placeholder: 'Multiple select control',
        items: initItems().map((item) => ({
            ...item,
            selected: (item.id === '3' || item.id === '5'),
            disabled: (item.id === '4'),
        })),
    },
    decorators: [textDecorator],
    render: ToggleEnable,
};

/**
 * Use 'enableFilter' property to enable filering items on type
 */
export const FilterSingle: ToggleEnableDropDownStory = {
    args: {
        id: 'filterDropDown',
        btnId: 'toggleEnableBtn',
        className: 'dd_stretch',
        enableFilter: true,
        disabled: true,
        placeholder: 'Type to filter',
        items: initItems({ title: 'Filter item', count: 100 }),
    },
    decorators: [textDecorator],
    render: ToggleEnable,
};

/**
 * Use 'enableFilter' property to enable filering items on type
 */
export const FilterMultiple: ToggleEnableDropDownStory = {
    args: {
        id: 'filterMultiDropDown',
        btnId: 'toggleEnableFilterMultiBtn',
        className: 'dd_stretch',
        enableFilter: true,
        disabled: true,
        multiple: true,
        placeholder: 'Type to filter',
        items: initItems({ title: 'Filter item', count: 100 }),
    },
    decorators: [textDecorator],
    render: ToggleEnable,
};

/**
 * With 'openOnFocus' option enabled drop down menu will be automaticaly opened when component
 * receives focus
 */
export const FilterGroups: ToggleEnableDropDownStory = {
    args: {
        id: 'filterGroupsDropDown',
        btnId: 'toggleEnableFilterGroupsBtn',
        className: 'dd_stretch',
        enableFilter: true,
        openOnFocus: true,
        placeholder: 'Type to filter',
        items: initGroupItems(),
    },
    decorators: [textDecorator],
    render: ToggleEnable,
};

/**
 * With 'openOnFocus' option enabled drop down menu will be automaticaly opened when component
 * receives focus
 */
export const FilterGroupsMultiple: DropDownStory = {
    args: {
        id: 'filterGroupsMultiDropDown',
        className: 'dd_stretch',
        enableFilter: true,
        openOnFocus: true,
        multiple: true,
        placeholder: 'Type to filter',
        items: initGroupItems(),
    },
    decorators: [textDecorator],
    render: ToggleEnable,
};

/**
 * By default focus is removed from input after select item from menu.
 * Set 'blurInputOnSingleSelect' to false to keep input focused after select item.
 */
export const BlurInputOnSingleSelect: DropDownStory = {
    name: '\'blurInputOnSingleSelect\' option',
    args: {
        enableFilter: true,
        blurInputOnSingleSelect: false,
        placeholder: 'Type to filter',
        items: initItems(),
    },
    decorators: [textDecorator],
};

/**
 * By default filter is not cleared after item selected if multiple items was found.
 * In case only one item is found filter is cleared regardless of option value.
 */
export const ClearFilterOnSelect: DropDownStory = {
    name: '\'clearFilterOnMultiSelect\' option',
    args: {
        enableFilter: true,
        clearFilterOnMultiSelect: true,
        multiple: true,
        placeholder: 'Type to filter',
        className: 'dd_stretch',
        items: initItems({ count: 100 }),
    },
    decorators: [textDecorator],
};

/**
 * Use 'showMultipleSelection' property to control visibility of built-in multiple selection inside
 * combo box component
 */
export const ShowMultipleSelection: DropDownStory = {
    name: '\'showMultipleSelection\' option',
    args: {
        enableFilter: true,
        showMultipleSelection: false,
        noResultsMessage: 'Nothing found',
        multiple: true,
        placeholder: 'Type to filter',
        className: 'dd_stretch',
        items: initItems({ count: 20 }),
    },
    decorators: [textDecorator],
    render: function Render(args) {
        const [state, setState] = useState<MultipleSelectionTagsState>({
            items: [],
        });

        const onSelectionChange = (selection: DropDownSelectionParam) => {
            setState((prev) => ({
                ...prev,
                items: asArray(selection).map((item) => ({
                    id: item.id,
                    title: item.value,
                })),
            }));
        };

        return (
            <div>
                <Tags items={state.items} />
                <DropDown
                    {...args}
                    onItemSelect={onSelectionChange}
                    onChange={onSelectionChange}
                />
            </div>
        );
    },
};

/**
 * Use 'showClearButton' property to control visibility of 'Clear' button inside
 * combo box component
 */
export const ShowClearButton: DropDownStory = {
    name: '\'showClearButton\' option',
    args: {
        enableFilter: true,
        showClearButton: false,
        noResultsMessage: 'Nothing found',
        multiple: true,
        placeholder: 'Type to filter',
        className: 'dd_form',
        items: initItems({ count: 20 }),
    },
    decorators: [textDecorator],
};

/**
 * Use 'showToggleButton' property to control visibility of 'Toggle' button inside
 * combo box component
 */
export const ShowToggleButton: DropDownStory = {
    name: '\'showToggleButton\' option',
    args: {
        enableFilter: true,
        showToggleButton: false,
        noResultsMessage: 'Nothing found',
        multiple: true,
        placeholder: 'Type to filter',
        className: 'dd_form',
        items: initItems({ count: 20 }),
    },
    decorators: [textDecorator],
};

/**
 * Use 'allowCreate' property in addition to 'enableFilter' to enable creation new menu item from
 * user input.
 * Special menu item is added to the end of menu list when no item exactly matching user input is found.
 * To create custom message use 'addItemMessage' callback.
 */
export const AllowCreate: DropDownStory = {
    name: '\'allowCreate\' option',
    args: {
        enableFilter: true,
        allowCreate: true,
        addItemMessage: (title) => `Add item: '${title}'`,
        multiple: true,
        placeholder: 'Type to filter',
        className: 'dd_form',
        items: initItems({ count: 20 }),
    },
    decorators: [textDecorator],
};

/**
 * When 'enableFilter' combined with 'listAttach' option input field will be created inside
 * drop down menu.
 * With disabled \'useSingleSelectionAsPlaceholder\' option the 'placeholder' property will be used
 * for placeholder of input field inside drop down menu.
 */
export const FilterAttachToBlock: AttachedToBlockStory = {
    name: 'Filter attached to block element',
    args: {
        id: 'attachedFilterDropDown',
        boxId: 'filterBox',
        listAttach: true,
        enableFilter: true,
        noResultsMessage: 'Nothing found',
        placeholder: 'Type to filter',
        useSingleSelectionAsPlaceholder: false,
        items: initItems({ title: 'Filter item', count: 100 }),
    },
    decorators: [textDecorator],
    render: function Render(args) {
        return <AttachedToBlock {...args} />;
    },
};

/**
 * When 'enableFilter' combined with 'listAttach' option input field will be created inside
 * drop down menu.
 */
export const FilterMultiAttachToBlock: AttachedToBlockStory = {
    name: 'Filter with multiple select attached',
    args: {
        id: 'attachedFilterMultipleDropDown',
        boxId: 'boxFilterMulti',
        listAttach: true,
        enableFilter: true,
        noResultsMessage: 'Nothing found',
        multiple: true,
        placeholder: 'Type to filter',
        items: initItems({ title: 'Filter item', count: 100 }),
    },
    decorators: [textDecorator],
    render: function Render(args) {
        return <AttachedToBlock {...args} />;
    },
};

/**
 * Use 'components' property object to set custom child components.
 * Example for custom 'ListItem' and 'MultiSelectionItem' components.
 */
export const CustomComponents: DropDownStory = {
    args: {
        className: 'dd__custom dd_stretch',
        placeholder: 'Multi select control',
        multiple: true,
        items: initItems({ count: 11 }).map((item) => ({
            ...item,
            selected: item.id === '4' || item.id === '5',
        })),
        components: {
            ListItem: CustomListItem,
            MultiSelectionItem: CustomSelectionItem,
        },
    },
    decorators: [textDecorator],
};

/**
 * Use 'components' property object to set custom child components.
 * Example for custom 'ComboBoxControls' and additional 'Loading' and 'ComboMenuButton' components.
 */
export const CustomComboBoxComponents: DropDownStory = {
    args: {
        className: 'dd_stretch',
        placeholder: 'Multi select control',
        multiple: true,
        enableFilter: true,
        items: initItems({ title: 'Filter item', count: 100 }),
    },
    decorators: [textDecorator],
    render: function Render(args) {
        return (
            <CustomControlsSelect {...args} />
        );
    },
};

/**
 * Custom setup with collapsible menu groups.
 */
export const CollapsibleGroups: DropDownStory = {
    args: {
        className: 'dd_stretch',
        placeholder: 'Select items',
        multiple: true,
        items: initGroupItems().map((item) => ({
            ...item,
            expanded: true,
        })),
    },
    decorators: [textDecorator],
    render: function Render(args) {
        return (
            <CollapsibleGroupsSelect {...args} />
        );
    },
};

/**
 * Use 'useNativeSelect' property to show native select menu on click on component.
 */
export const NativeSelect: DropDownStory = {
    name: '\'useNativeSelect\' option',
    args: {
        placeholder: 'Use native select',
        useNativeSelect: true,
        className: 'dd_form',
        items: initItems({ count: 5 }),
    },
    decorators: [textDecorator],
};

/**
 * Use 'useNativeSelect' property to show native select menu on click on component.
 * Combination with 'multiple' option is also supported.
 */
export const NativeSelectMultiple: DropDownStory = {
    name: '\'useNativeSelect\' option multiple',
    args: {
        placeholder: 'Use native select',
        useNativeSelect: true,
        multiple: true,
        className: 'dd_form',
        items: initItems({ count: 5 }),
    },
    decorators: [textDecorator],
};

/**
 * Use 'fullScreen' property to enable rendering full screen menu instead of drop down menu.
 */
export const FullScreen: DropDownStory = {
    args: {
        placeholder: 'Full screen',
        className: 'dd_form',
        fullScreen: true,
        items: initItems({ count: 20 }),
    },
    decorators: [textDecorator],
    render: function Render(args) {
        const portalElement = usePortalElement();

        return (
            <DropDown {...args} container={portalElement} />
        );
    },
};

/**
 * Use 'fullScreen' property to enable rendering full screen menu instead of drop down menu.
 * Combination with 'multiple' option is also supported.
 */
export const FullScreenFilterMultiple: DropDownStory = {
    args: {
        placeholder: 'Type to filter',
        fullScreen: true,
        multiple: true,
        enableFilter: true,
        className: 'dd_form',
        items: initItems({ count: 50 }),
    },
    decorators: [textDecorator],
    render: function Render(args) {
        const portalElement = usePortalElement();

        return (
            <DropDown {...args} container={portalElement} />
        );
    },
};
