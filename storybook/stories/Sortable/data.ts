import { SortableProps } from '@jezvejs/react';
import TileCardIcon from '../../common/assets/icons/tile-card.svg';
import { initItems } from '../../common/utils/utils.ts';

export type SortableTableRow = (string | number)[];

export const getTableData = () => ([
    [1, 10000, 'some text'],
    [2, 354, 'some text'],
    [3, 850110, 'some long long text'],
    [4, 6000, 'some text'],
    [5, 7860, 'some short text'],
    [6, 4500, 'some text'],
    [7, 200, 'some text'],
]);

export type SortableTableProps = Partial<SortableProps<SortableTableRow>>;

export const getTableDataItems = (args: SortableTableProps) => ({
    ...args,
    items: (args?.items ?? []).map?.((item: SortableTableRow, index: number) => ({
        id: `${args.id}_${index}`,
        group: args.group,
        columns: item.map((value, valIndex) => ({
            id: `${args.id}_${index}_${valIndex}`,
            content: value,
        })),
    })),
});

export const getTiles = () => ([
    { id: 'tile_1', title: 'Item 1' },
    { id: 'tile_2', placeholder: true },
    { id: 'tile_3', title: 'Item 3', icon: TileCardIcon },
    { id: 'tile_4', title: 'Item 4' },
    { id: 'tile_5', title: 'Item 5' },
    { id: 'tile_6', title: 'Item 6' },
]);

export const getListItems = () => (
    initItems({ idPrefix: 'src_' })
);

export const getDestListItems = () => (
    initItems({ idPrefix: 'dest_', className: 'list-item_red' })
        .map((item) => (
            (item.id === 'dest_5')
                ? { ...item, placeholder: true }
                : item
        ))
);

export const getCustomGroupItems = () => (
    initItems({ idPrefix: 'gr_' })
        .map((item, index) => ({
            ...item,
            className: (index < 5) ? '' : 'list-item_red',
            group: (index < 5) ? 'group1' : 'group2',
        }))
);

export const getTreeItems = () => (
    initItems({ idPrefix: 'tree_', count: 4 })
        .map((item, index) => ({
            ...item,
            items: (index < 2)
                ? initItems({
                    idPrefix: `tree_${item.id}_`,
                    count: 3,
                    title: `Item ${index + 1}.`,
                })
                : undefined,
        }))
);

export const getDestTreeItems = () => (
    initItems({ idPrefix: 'dst_tree_', count: 4, className: 'tree-item_red' })
        .map((item, index) => ({
            ...item,
            items: (index > 2)
                ? initItems({
                    idPrefix: `tree_${item.id}_`,
                    count: 2,
                    title: `Item ${index + 1}.`,
                    className: 'tree-item_red',
                })
                : undefined,
        }))
);

export const getSingleItemList = (options = {}) => (
    initItems({ ...options, count: 1 })
);
