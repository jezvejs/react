import { isObject } from '@jezvejs/types';
import {
    StoreActionObject,
    StoreActionPayload,
    StoreActionPayloadFunction,
    StoreActionReducer,
    StoreReducer,
    StoreState,
} from './Store/Store.ts';

export interface ReducerSlice<State extends StoreState = StoreState> {
    actions: {
        [type: string]: StoreActionPayloadFunction,
    },
    reducers: {
        [type: string]: StoreActionReducer<State>,
    },
    reducer: StoreReducer<State>,
}

/**
 * Returns map of actions and reducer function for specified reducers object
 *
 * @param {object} reducers
 * @returns {object}
 */
export function createSlice<State extends StoreState = StoreState>(
    reducers: object,
): ReducerSlice<State> {
    if (!isObject(reducers)) {
        throw new Error('Invalid actions object');
    }

    const slice: ReducerSlice<State> = {
        actions: {},
        reducers: {},
        reducer(state: State, action: StoreActionObject): State {
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
}
