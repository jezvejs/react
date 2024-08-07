// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { Sortable } from '@jezvejs/react';

// Local components
import { ListItemWithHandle } from './components/ListItemWithHandle/ListItemWithHandle.jsx';
import { ListItemWithInput } from './components/ListItemWithInput/ListItemWithInput.jsx';
import { ProvidedExchangeable } from './components/ProvidedExchangeable/ProvidedExchangeable.jsx';
import { ProvidedSortable } from './components/ProvidedSortable/ProvidedSortable.jsx';
import { SortableListItem } from './components/SortableListItem/SortableListItem.jsx';
import { SortableTile } from './components/SortableTile/SortableTile.jsx';
import { SortableTreeItem } from './components/SortableTreeItem/SortableTreeItem.jsx';
import { SortableTableRow } from './components/TableRow/SortableTableRow.jsx';
import { SortableTableTbodyRow } from './components/TableRow/SortableTableTbodyRow.jsx';

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
    render: ProvidedSortable,
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
    render: ProvidedSortable,
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

export const CustomGroups = {
    args: {
        id: 'customGroups',
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
    render: ProvidedSortable,
};

const treeTitleHandle = {
    query: '.tree-item > .tree-item__title',
    includeChilds: true,
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
export const TableWithWrappedRows = {
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
            ListItem: SortableTableTbodyRow,
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
export const TableSingleBody = {
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
            ListItem: SortableTableRow,
        },
    },
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [containerDecorator],
    render: ProvidedSortable,
};

export const OnlyRootHandle = {
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

export const QueryHandles = {
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
    render: ProvidedSortable,
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
    render: ProvidedSortable,
};
