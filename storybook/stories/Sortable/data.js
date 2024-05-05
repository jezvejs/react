import TileCardIcon from '../../assets/icons/tile-card.svg';
import { initItems } from '../../utils/utils.js';

export const getTiles = () => ([
    { id: '1', title: 'Item 1' },
    { id: '2', placeholder: true },
    { id: '3', title: 'Item 3', icon: TileCardIcon },
    { id: '4', title: 'Item 4' },
    { id: '5', title: 'Item 5' },
    { id: '6', title: 'Item 6' },
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
            className: (index < 5) ? null : 'list-item_red',
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
