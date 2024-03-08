/**
 * Sets 'selectedId' property, updates 'items' and returns result state
 */
export const selectItem = (prev, selectedId) => ({
    ...prev,
    selectedId,
    items: prev.items.map((item) => ({
        ...item,
        selected: item.id === selectedId,
    })),
});
