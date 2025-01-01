import { useMemo } from 'react';
import { useStore } from '../../../utils/Store/StoreProvider.tsx';
import { StoreProviderContext, StoreUpdater } from '../../../utils/Store/types.ts';
import {
    MenuProps,
    MenuState,
    MenuStore,
    MultiMenuState,
} from '../types.ts';

export function useMenuStore(props: MenuProps): StoreProviderContext<MenuState> {
    const store = useStore<MenuStore>();
    const menuStore = store as StoreProviderContext<MenuState>;

    const getState = (menuId = props.id): MenuState => {
        const st = store.getState();
        if (menuId === null) {
            return st as MenuState;
        }

        return (st as MultiMenuState).menu?.[menuId!] ?? {};
    };

    const setState = (updater: StoreUpdater, menuId = props.id) => {
        if (!menuId) {
            store.setState(updater);
            return;
        }

        store.setState((prev: MultiMenuState) => {
            const itemState = (typeof updater === 'function')
                ? updater(prev?.menu?.[menuId] ?? {})
                : updater;

            const res = {
                ...prev,
                menu: {
                    ...(prev?.menu ?? {}),
                    [menuId]: itemState,
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
