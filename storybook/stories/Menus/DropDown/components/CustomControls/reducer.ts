import { createSlice } from '@jezvejs/react';
import { CustomDropDownState } from './types.ts';

// Reducers
const slice = createSlice({
    toggleLoading: (state: CustomDropDownState) => ({
        ...state,
        loading: !state.loading,
    }),
});

export const { actions, reducer } = slice;
