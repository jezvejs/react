import { TabListItemProps, TabListProps } from './types.ts';

/**
 * Returns new random id
 * @returns {string}
 */
export const generateId = (): string => (
    Math.round(Date.now() * Math.random() * 100000).toString(30)
);

/**
 * Sets 'selectedId' property, updates 'items' and returns result state
 */
export const selectItem = (prev: TabListProps, selectedId: string | null) => ({
    ...prev,
    selectedId,
    items: prev.items?.map?.((item: TabListItemProps) => ({
        ...item,
        selected: item.id === selectedId,
    })),
});
