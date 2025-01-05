import { useMemo } from 'react';

import { Store } from '../../../utils/Store/Store.ts';
import { useStore } from '../../../utils/Store/StoreProvider.tsx';
import {
    StoreAction,
    StoreProviderContext,
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

export function useMenuStore(props: MenuProps): MenuStoreProviderContext<MenuState> {
    const store = useStore<MenuStore>();
    const menuStore = store as StoreProviderContext<MenuState>;

    const getState = (menuId?: string | null): MenuState => {
        const st = store.getState();
        if (menuId === null) {
            return st as MenuState;
        }

        const id = menuId ?? props.id;
        if (!id) {
            return st as MenuState;
        }

        return (st as MultiMenuState).menu?.[id] ?? {};
    };

    const setState = (updater: StoreUpdater, menuId?: string | null) => {
        if (menuId === null) {
            store.setState(updater);
            return;
        }

        const id = menuId ?? props.id;
        if (!id) {
            return;
        }

        store.setState((prev: MultiMenuState) => {
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
    };

    const res = useMemo(() => ({
        store,
        state: getState() as MenuState,
        getState,
        setState,
        dispatch: store.dispatch,
    }), [store.state, props.id]);

    if (!props.useParentContext) {
        return menuStore;
    }

    return res;
}
