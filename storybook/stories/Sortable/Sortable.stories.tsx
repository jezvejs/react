import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { Sortable, SortableListItemComponent } from '@jezvejs/react';

import '@jezvejs/react/style.scss';

// Global components
import { ProvidedSortable } from '../../common/Components/ProvidedSortable/ProvidedSortable.tsx';
import { SortableListItem } from '../../common/Components/SortableListItem/SortableListItem.tsx';

// Local components
import { ListItemWithHandle } from './components/ListItemWithHandle/ListItemWithHandle.tsx';
import { ListItemWithInput } from './components/ListItemWithInput/ListItemWithInput.tsx';
import { ProvidedExchangeable } from './components/ProvidedExchangeable/ProvidedExchangeable.tsx';
import { SortableTile } from './components/SortableTile/SortableTile.tsx';
import { SortableTreeItem } from './components/SortableTreeItem/SortableTreeItem.tsx';
import { SortableTableRow } from './components/TableRow/SortableTableRow.tsx';
import { SortableTableTbodyRow } from './components/TableRow/SortableTableTbodyRow.tsx';

import {
    getCustomGroupItems,
    getDestListItems,
    getDestTreeItems,
    getListItems,
    getSingleItemList,
    getTableData,
    getTableDataItems,
    getTiles,
    getTreeItems,
} from './data.ts';
import './Sortable.stories.scss';

export type SortableStory = StoryObj<typeof Sortable>;

export type ExchangeableStory = StoryObj<typeof ProvidedExchangeable>;

export type SortableTableStory = StoryObj<typeof ProvidedExchangeable>;

const meta: Meta<typeof Sortable> = {
    title: 'Components/Sortable',
    component: Sortable,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

const containerDecorator = (StoryComponent: StoryFn) => (
    <div className="container">
        <StoryComponent />
    </div>
);

export const Default: SortableStory = {
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
    render: ProvidedSortable,
};

export const List: SortableStory = {
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
    render: ProvidedSortable,
};

export const Exchange: ExchangeableStory = {
    args: {
        className: 'list-area',
        selector: '.sortable-list-item',
        placeholderClass: 'sortable-list-item__placeholder',
        group: 'exch',
        animated: true,
        copyWidth: true,
        allowSingleItemSort: true,
        source: {
            id: 'exchSource',
            items: getListItems(),
        },
        destination: {
            id: 'exchDest',
            items: getDestListItems(),
            dragClass: 'list_item_drag',
        },
        components: {
            ListItem: SortableListItem,
        },
    },
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [containerDecorator],
    render: ProvidedExchangeable,
};

export const CustomGroups: SortableStory = {
    args: {
        id: 'customGroups',
        items: getCustomGroupItems(),
        className: 'list-area',
        selector: '.sortable-list-item',
        placeholderClass: 'sortable-list-item__placeholder',
        animated: true,
        copyWidth: true,
        group: (elem) => ((elem as HTMLElement)?.dataset?.group ?? ''),
        components: {
            ListItem: SortableListItem,
        },
    },
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [containerDecorator],
    render: ProvidedSortable,
};

const treeTitleHandle = {
    query: '.tree-item > .tree-item__title',
    includeChilds: true,
};

export const Tree: SortableStory = {
    args: {
        id: 'tree',
        items: getTreeItems(),
        className: 'tree',
        selector: '.tree-item',
        containerSelector: '.tree-item__content',
        placeholderClass: 'tree-item__placeholder',
        dragClass: true,
        animated: true,
        group: 'tree',
        copyWidth: true,
        tree: true,
        handles: treeTitleHandle,
        components: {
            ListItem: SortableTreeItem,
        },
    },
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [containerDecorator],
    render: ProvidedSortable,
};

/**
 * acceptChild() callback test
 */
export const TreeItemAcceptChild: SortableStory = {
    args: {
        id: 'treeAcceptChild',
        items: getTreeItems({ idPrefix: 'tree_accept_' }),
        className: 'tree',
        selector: '.tree-item',
        containerSelector: '.tree-item__content',
        placeholderClass: 'tree-item__placeholder',
        dragClass: true,
        animated: true,
        group: 'tree',
        copyWidth: true,
        tree: true,
        handles: treeTitleHandle,
        acceptChild: ({ dropTarget }) => (
            [
                'tree_accept_1',
                'tree_accept_tree_accept_1_1',
                'tree_accept_tree_accept_1_2',
                'tree_accept_tree_accept_1_3',
            ].includes(dropTarget?.id ?? '')
        ),
        components: {
            ListItem: SortableTreeItem,
        },
    },
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [containerDecorator],
    render: ProvidedSortable,
};

export const TreeExchange: ExchangeableStory = {
    args: {
        className: 'tree',
        selector: '.tree-item',
        containerSelector: '.tree-item__content',
        placeholderClass: 'tree-item__placeholder',
        dragClass: true,
        group: 'treeExch',
        copyWidth: true,
        tree: true,
        handles: treeTitleHandle,
        allowSingleItemSort: true,
        source: {
            id: 'treeExchSource',
            items: getTreeItems(),
        },
        destination: {
            id: 'treeExchDest',
            items: getDestTreeItems(),
            dragClass: 'list_item_drag',
        },
        components: {
            ListItem: SortableTreeItem,
        },
    },
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [containerDecorator],
    render: ProvidedExchangeable,
};

/**
 * Sortable table with TBODY rows
 */
export const TableWithWrappedRows: SortableStory = {
    args: {
        ...getTableDataItems({
            id: 'table1',
            group: 'tbl',
            items: getTableData(),
        }),
        className: 'sortable_tbl',
        selector: '.tbl_list_item',
        placeholderClass: 'list_item_placeholder',
        table: true,
        copyWidth: true,
        components: {
            ListItem: SortableTableTbodyRow as SortableListItemComponent,
        },
    },
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [containerDecorator],
    render: ProvidedSortable,
};

/**
 * Sortable table with TBODY rows
 */
export const TableSingleBody: SortableStory = {
    args: {
        ...getTableDataItems({
            id: 'table2',
            group: 'tbl2',
            items: getTableData(),
        }),
        className: 'sortable_tbl',
        selector: '.tbl_list_item',
        placeholderClass: 'list_item_placeholder',
        table: true,
        wrapInTbody: true,
        copyWidth: true,
        components: {
            ListItem: SortableTableRow as SortableListItemComponent,
        },
    },
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [containerDecorator],
    render: ProvidedSortable,
};

export const OnlyRootHandle: SortableStory = {
    args: {
        id: 'onlyRootHandle',
        items: getListItems(),
        className: 'list-area',
        selector: '.list_item',
        placeholderClass: 'list_item_placeholder',
        group: 'list_root',
        onlyRootHandle: true,
        copyWidth: true,
        components: {
            ListItem: ListItemWithInput,
        },
    },
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [containerDecorator],
    render: ProvidedSortable,
};

export const QueryHandles: SortableStory = {
    args: {
        id: 'listHandle',
        items: getListItems(),
        className: 'list-area',
        selector: '.list_item',
        placeholderClass: 'list_item_placeholder',
        group: 'list_hnd',
        handles: [{ query: '.drag-handle', includeChilds: true }],
        copyWidth: true,
        components: {
            ListItem: ListItemWithHandle,
        },
    },
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [containerDecorator],
    render: ProvidedSortable,
};

export const DisabledSingleItemSort: SortableStory = {
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
    render: ProvidedSortable,
};

export const EnabledSingleItemSort: SortableStory = {
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
    render: ProvidedSortable,
};
