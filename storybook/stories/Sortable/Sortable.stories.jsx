// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { useMemo } from 'react';
import {
    Sortable,
    DragnDropProvider,
    createSlice,
} from '@jezvejs/react';

// Local components
import { SortableListItem } from './components/SortableListItem/SortableListItem.jsx';
import { SortableTile } from './components/SortableTile/SortableTile.jsx';
import { SortableTreeItem } from './components/SortableTreeItem/SortableTreeItem.jsx';

import {
    getCustomGroupItems,
    getDestListItems,
    getDestTreeItems,
    getListItems,
    getSingleItemList,
    getTiles,
    getTreeItems,
} from './data.js';
import './Sortable.stories.scss';

// Storybook component configuration
export default {
    title: 'Components/Sortable',
    component: Sortable,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

const containerDecorator = (Story) => (
    <div className="container">
        <Story />
    </div>
);

export const Default = {
    args: {
        id: 'tiles',
        items: getTiles(),
        className: 'sortable-tiles',
        selector: '.sortable-tile',
        placeholderClass: 'sortable-tile_placeholder',
        group: 'tiles',
        animated: true,
        vertical: false,
        components: {
            ListItem: SortableTile,
        },
    },
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [containerDecorator],
    render: function Render(args) {
        const portalElement = useMemo(() => (
            document.getElementById('custom-root')
        ), []);

        const initialState = {
            left: 0,
            top: 0,
            shiftX: 0,
            shiftY: 0,
            dragging: false,
            tiles: {
                items: args.items,
            },
        };

        const slice = createSlice({
        });

        return (
            <DragnDropProvider reducer={slice.reducer} initialState={initialState}>
                <Sortable {...args} container={portalElement} />
            </DragnDropProvider>
        );
    },
};

export const List = {
    args: {
        id: 'list',
        items: getListItems(),
        className: 'list-area',
        selector: '.sortable-list-item',
        placeholderClass: 'sortable-list-item__placeholder',
        group: 'list',
        animated: true,
        copyWidth: true,
        components: {
            ListItem: SortableListItem,
        },
    },
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [containerDecorator],
    render: function Render(args) {
        const portalElement = useMemo(() => (
            document.getElementById('custom-root')
        ), []);

        const initialState = {
            left: 0,
            top: 0,
            shiftX: 0,
            shiftY: 0,
            dragging: false,
            list: {
                items: args.items,
            },
        };

        const slice = createSlice({
        });

        return (
            <DragnDropProvider reducer={slice.reducer} initialState={initialState}>
                <Sortable {...args} container={portalElement} />
            </DragnDropProvider>
        );
    },
};

export const Exchange = {
    args: {
        className: 'list-area',
        selector: '.sortable-list-item',
        placeholderClass: 'sortable-list-item__placeholder',
        group: 'exch',
        animated: true,
        copyWidth: true,
        allowSingleItemSort: true,
        hoverClass: 'dbg-hover',
        components: {
            ListItem: SortableListItem,
        },
    },
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [containerDecorator],
    render: function Render(args) {
        const portalElement = useMemo(() => (
            document.getElementById('custom-root')
        ), []);

        const argsSrc = {
            ...args,
            id: 'exchSource',
            items: getListItems(),
        };

        const argsDest = {
            ...args,
            id: 'exchDest',
            items: getDestListItems(),
            dragClass: 'list_item_drag',
        };

        const initialState = {
            left: 0,
            top: 0,
            shiftX: 0,
            shiftY: 0,
            dragging: false,
            exchSource: {
                items: argsSrc.items,
            },
            exchDest: {
                items: argsDest.items,
            },
        };

        const slice = createSlice({
        });

        return (
            <DragnDropProvider reducer={slice.reducer} initialState={initialState}>
                <div className="exch-lists-container">
                    <Sortable {...argsSrc} container={portalElement} />
                    <Sortable {...argsDest} container={portalElement} />
                </div>
            </DragnDropProvider>
        );
    },
};

export const CustomGroups = {
    args: {
        id: 'list',
        items: getCustomGroupItems(),
        className: 'list-area',
        selector: '.sortable-list-item',
        placeholderClass: 'sortable-list-item__placeholder',
        animated: true,
        copyWidth: true,
        group: (elem) => elem?.dataset.group,
        components: {
            ListItem: SortableListItem,
        },
    },
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [containerDecorator],
    render: function Render(args) {
        const portalElement = useMemo(() => (
            document.getElementById('custom-root')
        ), []);

        const initialState = {
            left: 0,
            top: 0,
            shiftX: 0,
            shiftY: 0,
            dragging: false,
            list: {
                items: args.items,
            },
        };

        const slice = createSlice({
        });

        return (
            <DragnDropProvider reducer={slice.reducer} initialState={initialState}>
                <Sortable {...args} container={portalElement} />
            </DragnDropProvider>
        );
    },
};

export const Tree = {
    args: {
        id: 'tree',
        items: getTreeItems(),
        className: 'tree',
        selector: '.tree-item',
        containerSelector: '.tree-item__content',
        placeholderClass: 'tree-item__placeholder',
        dragClass: true,
        group: 'tree',
        copyWidth: true,
        tree: true,
        components: {
            ListItem: SortableTreeItem,
        },
    },
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [containerDecorator],
    render: function Render(args) {
        const portalElement = useMemo(() => (
            document.getElementById('custom-root')
        ), []);

        const initialState = {
            left: 0,
            top: 0,
            shiftX: 0,
            shiftY: 0,
            dragging: false,
            tree: {
                items: args.items,
            },
        };

        const slice = createSlice({
        });

        return (
            <DragnDropProvider reducer={slice.reducer} initialState={initialState}>
                <Sortable {...args} container={portalElement} />
            </DragnDropProvider>
        );
    },
};

export const TreeExchange = {
    args: {
        className: 'tree',
        selector: '.tree-item',
        containerSelector: '.tree-item__content',
        placeholderClass: 'tree-item__placeholder',
        dragClass: true,
        group: 'treeExch',
        copyWidth: true,
        tree: true,
        allowSingleItemSort: true,
        components: {
            ListItem: SortableTreeItem,
        },
    },
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [containerDecorator],
    render: function Render(args) {
        const portalElement = useMemo(() => (
            document.getElementById('custom-root')
        ), []);

        const argsSrc = {
            ...args,
            id: 'treeExchSource',
            items: getTreeItems(),
        };

        const argsDest = {
            ...args,
            id: 'treeExchDest',
            items: getDestTreeItems(),
            dragClass: 'list_item_drag',
        };

        const initialState = {
            left: 0,
            top: 0,
            shiftX: 0,
            shiftY: 0,
            dragging: false,
            treeExchSource: {
                items: argsSrc.items,
            },
            treeExchDest: {
                items: argsDest.items,
            },
        };

        const slice = createSlice({
        });

        return (
            <DragnDropProvider reducer={slice.reducer} initialState={initialState}>
                <div className="exch-lists-container">
                    <Sortable {...argsSrc} container={portalElement} />
                    <Sortable {...argsDest} container={portalElement} />
                </div>
            </DragnDropProvider>
        );
    },
};

export const DisabledSingleItemSort = {
    args: {
        id: 'disabledSingleItem',
        items: getSingleItemList({ idPrefix: 'disabledSingleItem_' }),
        className: 'list-area',
        selector: '.sortable-list-item',
        placeholderClass: 'sortable-list-item__placeholder',
        group: 'disSingle',
        animated: true,
        copyWidth: true,
        components: {
            ListItem: SortableListItem,
        },
    },
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [containerDecorator],
    render: function Render(args) {
        const portalElement = useMemo(() => (
            document.getElementById('custom-root')
        ), []);

        const initialState = {
            left: 0,
            top: 0,
            shiftX: 0,
            shiftY: 0,
            dragging: false,
            disabledSingleItem: {
                items: args.items,
            },
        };

        const slice = createSlice({
        });

        return (
            <DragnDropProvider reducer={slice.reducer} initialState={initialState}>
                <Sortable {...args} container={portalElement} />
            </DragnDropProvider>
        );
    },
};

export const EnabledSingleItemSort = {
    args: {
        id: 'enabledSingleItem',
        items: getSingleItemList({ idPrefix: 'enabledSingleItem_' }),
        className: 'list-area',
        selector: '.sortable-list-item',
        placeholderClass: 'sortable-list-item__placeholder',
        group: 'enSingle',
        animated: true,
        copyWidth: true,
        allowSingleItemSort: true,
        components: {
            ListItem: SortableListItem,
        },
    },
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [containerDecorator],
    render: function Render(args) {
        const portalElement = useMemo(() => (
            document.getElementById('custom-root')
        ), []);

        const initialState = {
            left: 0,
            top: 0,
            shiftX: 0,
            shiftY: 0,
            dragging: false,
            enabledSingleItem: {
                items: args.items,
            },
        };

        const slice = createSlice({
        });

        return (
            <DragnDropProvider reducer={slice.reducer} initialState={initialState}>
                <Sortable {...args} container={portalElement} />
            </DragnDropProvider>
        );
    },
};
