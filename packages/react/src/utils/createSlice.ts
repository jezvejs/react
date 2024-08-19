import { isObject } from '@jezvejs/types';
import {
    StoreActionObject,
    StoreActionPayload,
    StoreActionPayloadFunction,
    StoreActionReducer,
    StoreReducer,
    StoreState,
} from './Store/Store.ts';

export interface ReducerSlice {
    actions: {
        [type: string]: StoreActionPayloadFunction,
    },
    reducers: {
        [type: string]: StoreActionReducer,
    },
    reducer: StoreReducer,
}

/**
 * Returns map of actions and reducer function for specified reducers object
 *
 * @param {object} reducers
 * @returns {object}
 */
export const createSlice = (reducers: object): ReducerSlice => {
    if (!isObject(reducers)) {
        throw new Error('Invalid actions object');
    }

    const slice: ReducerSlice = {
        actions: {},
        reducers: {},
        reducer(state: StoreState, action: StoreActionObject): StoreState {
            if (!(action.type in slice.reducers)) {
                return state;
            }

            const reduceFunc = slice.reducers[action.type];
            return reduceFunc(state, action.payload);
        },
    };

    Object.entries(reducers).forEach(([action, reducer]) => {
        slice.actions[action] = (payload?: StoreActionPayload) => ({ type: action, payload });
        slice.reducers[action] = reducer;
    });

    return slice;
};
