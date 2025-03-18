import type { Meta, StoryFn, StoryObj } from '@storybook/react';

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

import { groupsItems, initGroupItems } from '../../../common/assets/data/dropDownData.ts';
import { usePortalElement } from '../../../common/hooks/usePortalElement.tsx';
import { initItems } from '../../../common/utils/utils.ts';

// Local components
import { AttachedToBlock } from './components/AttachedToBlock/AttachedToBlock.tsx';
import { CollapsibleGroupsSelect } from './components/CollapsibleGroups/CollapsibleGroupsSelect.tsx';
import { CustomControlsSelect } from './components/CustomControls/CustomControlsSelect.tsx';
import { CustomListItem } from './components/CustomListItem/CustomListItem.tsx';
import { CustomSelectionItem } from './components/CustomSelectionItem/CustomSelectionItem.tsx';
import { ToggleEnable } from './components/ToggleEnable/ToggleEnable.tsx';

import { DropDownStory } from './types.ts';
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

export const Inline: DropDownStory = {
    args: {
    },
    decorators: [heightDecorator],
    render: function Render() {
        const portalElement = usePortalElement();

        const args1 = {
            className: 'dd__container_no-shrink',
            placeholder: 'Select item',
            items: initItems(),
        };
        const args2 = {
            id: 'arg2',
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

export const FullWidth: DropDownStory = {
    args: {
        className: 'dd_stretch',
        placeholder: 'Select item 3',
        items: initItems(),
    },
    decorators: [heightDecorator],
};

export const FixedMenu: DropDownStory = {
    args: {
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

export const DisabledItems: DropDownStory = {
    args: {
        items: initItems().map((item) => (
            (item.id === '3' || item.id === '5')
                ? { ...item, disabled: true }
                : item
        )),
    },
    decorators: [heightDecorator],
};

export const Groups: DropDownStory = {
    args: {
        items: groupsItems(),
    },
    decorators: [heightDecorator],
};

type AttachedToBlockStory = StoryObj<typeof AttachedToBlock>;

/**
 * Attach drop down menu to the block element.
 * Click on close button should have no effect on menu popup.
 */
export const AttachToBlock: AttachedToBlockStory = {
    args: {
        listAttach: true,
        isValidToggleTarget: (elem) => !elem.closest('.close-btn'),
        items: initItems({ title: 'Long Item Lorem Lorem' }),
    },
    decorators: [heightDecorator],
    render: function Render(args) {
        return <AttachedToBlock {...args} />;
    },
};

export const AttachToInline: DropDownStory = {
    args: {
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

export const MultipleSelect: DropDownStory = {
    args: {
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

export const FilterSingle: DropDownStory = {
    args: {
        className: 'dd_stretch',
        enableFilter: true,
        disabled: true,
        placeholder: 'Type to filter',
        items: initItems({ title: 'Filter item', count: 100 }),
    },
    decorators: [textDecorator],
    render: ToggleEnable,
};

export const FilterMultiple: DropDownStory = {
    args: {
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
 * With 'openOnFocus' option enabled
 */
export const FilterGroups: DropDownStory = {
    args: {
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
 * With 'openOnFocus' option enabled
 */
export const FilterGroupsMultiple: DropDownStory = {
    args: {
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

export type MultipleSelectionTag = {
    id: string;
    title: string;
};

export type MultipleSelectionTagsState = {
    items: MultipleSelectionTag[];
};

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
 * With disabled \'useSingleSelectionAsPlaceholder\' option
 */
export const FilterAttachToBlock: AttachedToBlockStory = {
    name: 'Filter attached to block element',
    args: {
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

export const FilterMultiAttachToBlock: AttachedToBlockStory = {
    name: 'Filter with multiple select attached',
    args: {
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
