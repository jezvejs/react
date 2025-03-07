import { useCallback, useMemo } from 'react';

import { Store } from '../../../utils/Store/Store.ts';
import { useStore } from '../../../utils/Store/StoreProvider.tsx';
import {
    StoreAction,
    StoreState,
    StoreUpdater,
} from '../../../utils/Store/types.ts';
import {
    MenuProps,
    MenuState,
    MenuStore,
    MultiMenuState,
} from '../types.ts';

export interface MenuStoreProviderContext<State extends StoreState = StoreState> {
    store: Store | object,
    state: State,
    getState: (menuId?: string | null) => State,
    setState: (state: StoreUpdater, menuId?: string | null) => void,
    dispatch: (action: StoreAction) => void,
}

export function useMenuStore<
    T extends MenuState = MenuState,
    P extends MenuProps = MenuProps,
>(props: P): MenuStoreProviderContext<T> {
    const store = useStore<MenuStore<T>>();

    const getState = useCallback((menuId?: string | null): T => {
        const st = store.getState();
        if (menuId === null) {
            return st as T;
        }

        const id = menuId ?? props.id;
        if (!id) {
            return st as T;
        }

        return (st as MultiMenuState<T>).menu?.[id] ?? {};
    }, [props.id, store.state]);

    const setState = useCallback((updater: StoreUpdater, menuId?: string | null) => {
        if (menuId === null) {
            store.setState(updater);
            return;
        }

        const id = menuId ?? props.id;
        if (!id) {
            return;
        }

        store.setState((prev: MultiMenuState<T>) => {
            const itemState = (typeof updater === 'function')
                ? updater(prev?.menu?.[id] ?? {})
                : updater;

            const res = {
                ...prev,
                menu: {
                    ...(prev?.menu ?? {}),
                    [id]: itemState,
                },
            };

            return res;
        });
    }, [props.id, store.state]);

    const res = useMemo(() => ({
        store,
        state: store.state as T,
        getState,
        setState,
        dispatch: store.dispatch,
    }), [store.state, props.id]);

    return res;
}
