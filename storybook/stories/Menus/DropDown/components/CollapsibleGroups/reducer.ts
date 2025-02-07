import { createSlice, DropDownState, MenuHelpers } from '@jezvejs/react';
import { CollapsibleMenuItemProps } from './types.ts';

// Reducers
const slice = createSlice({
    toggleGroup: (state: DropDownState, id: string) => ({
        ...state,
        items: MenuHelpers.mapItems<CollapsibleMenuItemProps>(state.items ?? [], (item) => (
            (item.type === 'group' && item.id.toString() === id)
                ? { ...item, expanded: !item.expanded }
                : item
        ), { includeGroupItems: true }),
    }),
});

export const { actions, reducer } = slice;
