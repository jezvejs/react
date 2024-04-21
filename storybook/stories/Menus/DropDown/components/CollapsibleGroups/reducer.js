import { createSlice, MenuHelpers } from '@jezvejs/react';

// Reducers
const slice = createSlice({
    toggleGroup: (state, id) => ({
        ...state,
        items: MenuHelpers.mapItems(state.items, (item) => (
            (item.type === 'group' && item.id.toString() === id)
                ? { ...item, expanded: !item.expanded }
                : item
        ), { includeGroupItems: true }),
    }),
});

export const { actions, reducer } = slice;
