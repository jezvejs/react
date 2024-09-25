import { ReactNode } from 'react';
import { Store } from './Store.ts';

export type StoreActionPayload = object | string | number | boolean | bigint | symbol | null;

export interface StoreActionObject {
    type: string,
    payload?: StoreActionPayload,
}

export type StoreActionPayloadFunction = (payload?: StoreActionPayload) => StoreActionObject;
export type StoreActionFunction = (api: StoreActionAPI | null) => void;

export type StoreAction = StoreActionObject | StoreActionFunction;

export type StoreState = object;

export type StoreReducer = (state: StoreState, action: StoreActionObject) => StoreState;
export type StoreReducersList = StoreReducer | StoreReducer[];

export type StoreActionReducer = (state: StoreState, payload?: StoreActionPayload) => StoreState;

export interface StoreOptions {
    initialState?: StoreState,
    sendInitialState?: true,
}

export type StoreListener = (state: StoreState, prevState: StoreState) => void;

export type StoreDispatchFunction = (action: StoreAction) => void;
export type StoreGetStateFunction = () => StoreState;

export interface StoreActionAPI {
    dispatch: StoreDispatchFunction,
    getState: StoreGetStateFunction,
}

export type StoreUpdaterFunction = (prev: StoreState) => StoreState;
export type StoreUpdater = StoreState | StoreUpdaterFunction;

// StoreProvider

export interface StoreProviderProps {
    reducer: StoreReducer,
    initialState: StoreState,
    children: ReactNode,
}

export interface StoreProviderContext {
    store: Store,
    state: StoreState,
    getState: () => StoreState,
    setState: (state: StoreUpdater) => void,
    dispatch: (action: StoreAction) => void,
}
