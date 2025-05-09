import { useCallback, useMemo } from 'react';

import { Store } from '../../../utils/Store/Store.ts';
import { useStore } from '../../../utils/Store/StoreProvider.tsx';
import {
    StoreAction,
    StoreUpdater,
} from '../../../utils/Store/types.ts';
import {
    MenuProps,
    MenuState,
    MultiMenuState,
} from '../types.ts';

export interface MenuStoreProviderContext<State extends MenuState = MenuState> {
    store: Store | object,
    state: MultiMenuState<State>,
    getState: (menuId?: string | null) => State,
    setState: (state: StoreUpdater<State>, menuId?: string | null) => void,
    getFullState: () => MultiMenuState<State>,
    setFullState: (state: StoreUpdater<MultiMenuState<State>>) => void,
    dispatch: (action: StoreAction<State>) => void,
}

export function useMenuStore<
    T extends MenuState = MenuState,
    P extends MenuProps = MenuProps,
>(props: P): MenuStoreProviderContext<T> {
    const store = useStore<MultiMenuState<T>>();

    const getFullState = useCallback(() => {
        const st = store.getState();
        return st as MultiMenuState<T>;
    }, [store.state]);

    const getState = useCallback((menuId?: string): T | object => {
        const st = store.getState();

        const id = menuId ?? props.id;
        if (!id) {
            return {};
        }

        return (st as MultiMenuState<T>).menu?.[id] ?? {};
    }, [props.id, store.state]);

    const setFullState = useCallback((updater: StoreUpdater<MultiMenuState<T>>) => {
        store.setState(updater);
    }, [store.state]);

    const setState = useCallback((updater: StoreUpdater<T>, menuId?: string) => {
        const id = menuId ?? props.id;
        if (!id) {
            return;
        }

        store.setState((prev: MultiMenuState<T>) => {
            const multiMenuState = prev?.menu;

            const itemState = (typeof updater === 'function')
                ? updater(multiMenuState?.[id] ?? {})
                : updater;

            const res = {
                ...prev,
                menu: {
                    ...(multiMenuState ?? {}),
                    [id]: itemState,
                },
            };

            return res;
        });
    }, [props.id, store.state]);

    const res = useMemo(() => ({
        store,
        state: store.state,
        getState,
        setState,
        getFullState,
        setFullState,
        dispatch: (action: StoreAction) => store.dispatch(action),
    }), [store.state, props.id]);

    return res as MenuStoreProviderContext<T>;
}
