// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { DropDown } from '@jezvejs/react';
import { useMemo, useState } from 'react';

// Local components
import { ActionButton } from '../../../Components/ActionButton/ActionButton.jsx';
import { BlueBox } from './components/BlueBox/BlueBox.jsx';

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

const ToggleEnable = function (args) {
    const [state, setState] = useState({
        ...args,
    });

    function onToggle() {
        setState((prev) => ({ ...prev, disabled: !prev.disabled }));
    }

    return (
        <>
            <div style={{ marginBottom: '1rem' }}>
                <DropDown {...args} disabled={state.disabled} />
            </div>
            <ActionButton
                title={(state.disabled ? 'Enable' : 'Disable')}
                onClick={onToggle}
            />
        </>
    );
};

export const Inline = {
    args: {
    },
    decorators: [heightDecorator],
    render: function Render() {
        const portalElement = useMemo(() => (
            document.getElementById('custom-root')
        ), []);

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
        const portalElement = useMemo(() => (
            document.getElementById('custom-root')
        ), []);

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
    render: function Render(args) {
        const portalElement = useMemo(() => (
            document.getElementById('custom-root')
        ), []);

        return (
            <DropDown {...args} container={portalElement}>
                <BlueBox id="box" />
            </DropDown>
        );
    },
};

export const AttachToInline = {
    args: {
        className: 'dd_inline',
        listAttach: true,
        items: initItems('Long Item Lorem Lorem', 10),
    },
    decorators: [textDecorator],
    render: function Render(args) {
        const portalElement = useMemo(() => (
            document.getElementById('custom-root')
        ), []);

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
        const portalElement = useMemo(() => (
            document.getElementById('custom-root')
        ), []);

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
        placeholder: 'Single select control',
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
