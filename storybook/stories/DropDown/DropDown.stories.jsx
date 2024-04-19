// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { DropDown } from '@jezvejs/react';
import { useMemo, useState } from 'react';

import { ActionButton } from '../../Components/ActionButton/ActionButton.jsx';
import { BlueBox } from './components/BlueBox/BlueBox.jsx';

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

const initItems = (title = 'Item', count = 10, startFrom = 1) => {
    const res = [];

    for (let ind = startFrom; ind < startFrom + count; ind += 1) {
        res.push({ id: ind.toString(), title: `${title} ${ind}` });
    }

    return res;
};

const groupsItems = () => ([{
    id: 'grVisible',
    title: 'Visible',
    type: 'group',
    items: [
        { id: 'groupItem11', title: 'Item 1', group: 'grVisible' },
        { id: 'groupItem12', title: 'Item 2', group: 'grVisible' },
        {
            id: 'groupItem13',
            title: 'Item 3',
            group: 'grVisible',
            selected: true,
        },
    ],
}, {
    id: 'grHidden',
    title: 'Hidden',
    type: 'group',
    items: [
        { id: 'groupItem24', title: 'Item 4', group: 'grHidden' },
        { id: 'groupItem25', title: 'Item 5', group: 'grHidden' },
        { id: 'groupItem26', title: 'Item 6', group: 'grHidden' },
    ],
}]);

export default {
    title: 'Components/DropDown',
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

const initGroupItems = () => ([
    {
        id: 'group10',
        type: 'group',
        title: '1 - 9',
        items: [
            { id: '1', title: 'Item 1', group: 'group10' },
            { id: '2', title: 'Item 2', group: 'group10' },
            { id: '3', title: 'Item 3', group: 'group10' },
            { id: '4', title: 'Item 4', group: 'group10' },
            { id: '5', title: 'Item 5', group: 'group10' },
            { id: '6', title: 'Item 6', group: 'group10' },
            { id: '7', title: 'Item 7', group: 'group10' },
            { id: '8', title: 'Item 8', group: 'group10' },
            { id: '9', title: 'Item 9', group: 'group10' },
        ],
    },
    {
        id: 'group20',
        type: 'group',
        title: '10 - 19',
        items: [
            { id: '10', title: 'Item 10', group: 'group20' },
            { id: '11', title: 'Item 11', group: 'group20' },
            { id: '12', title: 'Item 12', group: 'group20' },
            { id: '13', title: 'Item 13', group: 'group20' },
            { id: '14', title: 'Item 14', group: 'group20' },
            { id: '15', title: 'Item 15', group: 'group20' },
            { id: '16', title: 'Item 16', group: 'group20' },
            { id: '17', title: 'Item 17', group: 'group20' },
            { id: '18', title: 'Item 18', group: 'group20' },
            { id: '19', title: 'Item 19', group: 'group20' },
        ],
    },
    {
        id: 'group30',
        type: 'group',
        title: '20 - 29',
        items: [
            { id: '20', title: 'Item 20', group: 'group30' },
            { id: '21', title: 'Item 21', group: 'group30' },
            { id: '22', title: 'Item 22', group: 'group30' },
            { id: '23', title: 'Item 23', group: 'group30' },
            { id: '24', title: 'Item 24', group: 'group30' },
            { id: '25', title: 'Item 25', group: 'group30' },
            { id: '26', title: 'Item 26', group: 'group30' },
            { id: '27', title: 'Item 27', group: 'group30' },
            { id: '28', title: 'Item 28', group: 'group30' },
            { id: '29', title: 'Item 29', group: 'group30' },
        ],
    },
]);

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
