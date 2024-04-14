// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { DropDown } from '@jezvejs/react';
import { useMemo } from 'react';

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
