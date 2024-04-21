import { createSlice } from '@jezvejs/react';

// Reducers
const slice = createSlice({
    toggleLoading: (state) => ({
        ...state,
        loading: !state.loading,
    }),
});

export const { actions, reducer } = slice;
