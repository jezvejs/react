// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { DropDown, Tags } from '@jezvejs/react';
import { useState } from 'react';

import { usePortalElement } from '../../../common/hooks/usePortalElement.jsx';

// Local components
import { AttachedToBlock } from './components/AttachedToBlock/AttachedToBlock.jsx';
import { CollapsibleGroupsSelect } from './components/CollapsibleGroups/CollapsibleGroupsSelect.jsx';
import { CustomControlsSelect } from './components/CustomControls/CustomControlsSelect.jsx';
import { CustomListItem } from './components/CustomListItem/CustomListItem.jsx';
import { CustomSelectionItem } from './components/CustomSelectionItem/CustomSelectionItem.jsx';
import { ToggleEnable } from './components/ToggleEnable/ToggleEnable.jsx';

import {
    initItems,
    groupsItems,
    initGroupItems,
} from './data.js';
import './DropDown.stories.scss';

const heightDecorator = (Story) => (
    <div className="height-container">
        <Story />
    </div>
);

const fixedDecorator = (Story) => (
    <div className="fixed-menu-container">
        <Story />
    </div>
);

const textDecorator = (Story) => (
    <div className="text-container">
        <Story />
    </div>
);

export default {
    title: 'Menu/DropDown',
    component: DropDown,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export const Inline = {
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
            className: 'dd__container_ellipsis',
            placeholder: 'Select item 2',
            static: true,
            items: initItems('Long item test Lorem ipsum dolor sit amet'),
        };

        return (
            <div className='inline-container'>
                <DropDown {...args1} container={portalElement} />
                <DropDown {...args2} container={portalElement} />
            </div>
        );
    },
};

export const FullWidth = {
    args: {
        className: 'dd_stretch',
        placeholder: 'Select item 3',
        items: initItems(),
    },
    decorators: [heightDecorator],
};

export const FixedMenu = {
    args: {
        fixedMenu: true,
        className: 'dd_form',
        items: initItems('Item', 50),
    },
    decorators: [fixedDecorator],
    render: function Render(args) {
        const portalElement = usePortalElement();

        return (
            <DropDown {...args} container={portalElement} />
        );
    },
};

export const DisabledItems = {
    args: {
        items: initItems().map((item) => (
            (item.id === '3' || item.id === '5')
                ? { ...item, disabled: true }
                : item
        )),
    },
    decorators: [heightDecorator],
};

export const Groups = {
    args: {
        items: groupsItems(),
    },
    decorators: [heightDecorator],
};

/**
 * Attach drop down menu to the block element.
 * Click on close button should have no effect on menu popup.
 */
export const AttachToBlock = {
    args: {
        listAttach: true,
        isValidToggleTarget: (elem) => !elem.closest('.close-btn'),
        items: initItems('Long Item Lorem Lorem', 10),
    },
    decorators: [heightDecorator],
    render: AttachedToBlock,
};

export const AttachToInline = {
    args: {
        className: 'dd_inline',
        listAttach: true,
        items: initItems('Long Item Lorem Lorem', 10),
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

export const Clipping = {
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

export const MultipleSelect = {
    args: {
        className: 'dd_stretch',
        placeholder: 'Multi select control',
        multiple: true,
        items: initItems('Multi select', 10).map((item) => ({
            ...item,
            disabled: (item.id === '3'),
        })),
    },
    decorators: [textDecorator],
};

export const DisabledSingle = {
    args: {
        className: 'dd_stretch',
        disabled: true,
        placeholder: 'Single select control',
        items: initItems('Item', 10).map((item) => ({
            ...item,
            selected: (item.id === '3'),
            disabled: (item.id === '4'),
        })),
    },
    decorators: [textDecorator],
    render: ToggleEnable,
};

export const DisabledMultiple = {
    args: {
        className: 'dd_stretch',
        disabled: true,
        multiple: true,
        placeholder: 'Multiple select control',
        items: initItems('Item', 10).map((item) => ({
            ...item,
            selected: (item.id === '3' || item.id === '5'),
            disabled: (item.id === '4'),
        })),
    },
    decorators: [textDecorator],
    render: ToggleEnable,
};

export const FilterSingle = {
    args: {
        className: 'dd_stretch',
        enableFilter: true,
        disabled: true,
        placeholder: 'Type to filter',
        items: initItems('Filter item', 100),
    },
    decorators: [textDecorator],
    render: ToggleEnable,
};

export const FilterMultiple = {
    args: {
        className: 'dd_stretch',
        enableFilter: true,
        disabled: true,
        multiple: true,
        placeholder: 'Type to filter',
        items: initItems('Filter item', 100),
    },
    decorators: [textDecorator],
    render: ToggleEnable,
};

/**
 * With 'openOnFocus' option enabled
 */
export const FilterGroups = {
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
export const FilterGroupsMultiple = {
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
export const BlurInputOnSingleSelect = {
    name: '\'blurInputOnSingleSelect\' option',
    args: {
        enableFilter: true,
        blurInputOnSingleSelect: false,
        placeholder: 'Type to filter',
        items: initItems('Item', 10),
    },
    decorators: [textDecorator],
};

/**
 * By default filter is not cleared after item selected if multiple items was found.
 * In case only one item is found filter is cleared regardless of option value.
 */
export const ClearFilterOnSelect = {
    name: '\'clearFilterOnMultiSelect\' option',
    args: {
        enableFilter: true,
        clearFilterOnMultiSelect: true,
        multiple: true,
        placeholder: 'Type to filter',
        className: 'dd_stretch',
        items: initItems('Item', 100),
    },
    decorators: [textDecorator],
};

export const ShowMultipleSelection = {
    name: '\'showMultipleSelection\' option',
    args: {
        enableFilter: true,
        showMultipleSelection: false,
        noResultsMessage: 'Nothing found',
        multiple: true,
        placeholder: 'Type to filter',
        className: 'dd_stretch',
        items: initItems('Item', 20),
    },
    decorators: [textDecorator],
    render: function Render(args) {
        const [state, setState] = useState({
            items: [],
        });

        const onSelectionChange = (selection) => {
            setState((prev) => ({
                ...prev,
                items: selection.map((item) => ({
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

export const ShowClearButton = {
    name: '\'showClearButton\' option',
    args: {
        enableFilter: true,
        showClearButton: false,
        noResultsMessage: 'Nothing found',
        multiple: true,
        placeholder: 'Type to filter',
        className: 'dd_form',
        items: initItems('Item', 20),
    },
    decorators: [textDecorator],
};

export const ShowToggleButton = {
    name: '\'showToggleButton\' option',
    args: {
        enableFilter: true,
        showToggleButton: false,
        noResultsMessage: 'Nothing found',
        multiple: true,
        placeholder: 'Type to filter',
        className: 'dd_form',
        items: initItems('Item', 20),
    },
    decorators: [textDecorator],
};

export const AllowCreate = {
    name: '\'allowCreate\' option',
    args: {
        enableFilter: true,
        allowCreate: true,
        addItemMessage: (title) => `Add item: '${title}'`,
        multiple: true,
        placeholder: 'Type to filter',
        className: 'dd_form',
        items: initItems('Item', 20),
    },
    decorators: [textDecorator],
};

/**
 * With disabled \'useSingleSelectionAsPlaceholder\' option
 */
export const FilterAttachToBlock = {
    name: 'Filter attached to block element',
    args: {
        boxId: 'filterBox',
        listAttach: true,
        enableFilter: true,
        noResultsMessage: 'Nothing found',
        placeholder: 'Type to filter',
        useSingleSelectionAsPlaceholder: false,
        items: initItems('Filter item', 100),
    },
    decorators: [textDecorator],
    render: AttachedToBlock,
};

export const FilterMultiAttachToBlock = {
    name: 'Filter with multiple select attached',
    args: {
        boxId: 'boxFilterMulti',
        listAttach: true,
        enableFilter: true,
        noResultsMessage: 'Nothing found',
        multiple: true,
        placeholder: 'Type to filter',
        items: initItems('Filter item', 100),
    },
    decorators: [textDecorator],
    render: AttachedToBlock,
};

export const CustomComponents = {
    args: {
        className: 'dd__custom dd_stretch',
        placeholder: 'Multi select control',
        multiple: true,
        items: initItems('Item', 11).map((item) => ({
            ...item,
            selected: item.id === '4' || item.id === '5',
        })),
        components: {
            ListItem: CustomListItem,
            Checkbox: CustomListItem,
            MultiSelectionItem: CustomSelectionItem,
        },
    },
    decorators: [textDecorator],
};

export const CustomComboBoxComponents = {
    args: {
        className: 'dd_stretch',
        placeholder: 'Multi select control',
        multiple: true,
        enableFilter: true,
        items: initItems('Filter item', 100),
    },
    decorators: [textDecorator],
    render: function Render(args) {
        return (
            <CustomControlsSelect {...args} />
        );
    },
};

export const CollapsibleGroups = {
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

export const NativeSelect = {
    name: '\'useNativeSelect\' option',
    args: {
        placeholder: 'Use native select',
        useNativeSelect: true,
        className: 'dd_form',
        items: initItems('Item', 5),
    },
    decorators: [textDecorator],
};

export const NativeSelectMultiple = {
    name: '\'useNativeSelect\' option multiple',
    args: {
        placeholder: 'Use native select',
        useNativeSelect: true,
        multiple: true,
        className: 'dd_form',
        items: initItems('Item', 5),
    },
    decorators: [textDecorator],
};

export const FullScreen = {
    args: {
        placeholder: 'Full screen',
        className: 'dd_form',
        fullScreen: true,
        items: initItems('Item', 20),
    },
    decorators: [textDecorator],
    render: function Render(args) {
        const portalElement = usePortalElement();

        return (
            <DropDown {...args} container={portalElement} />
        );
    },
};

export const FullScreenFilterMultiple = {
    args: {
        placeholder: 'Type to filter',
        fullScreen: true,
        multiple: true,
        enableFilter: true,
        className: 'dd_form',
        items: initItems('Item', 50),
    },
    decorators: [textDecorator],
    render: function Render(args) {
        const portalElement = usePortalElement();

        return (
            <DropDown {...args} container={portalElement} />
        );
    },
};
