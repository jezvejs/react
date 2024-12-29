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

    const menuId = props.id;

    const getState = (): MenuState => {
        const st = store.getState();
        return (st as MultiMenuState).menu?.[menuId!] ?? {};
    };

    const setState = (updater: StoreUpdater) => {
        if (!menuId) {
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
        state: getState(),
        getState,
        setState,
        dispatch: store.dispatch,
    }), [store.state, props.id]);

    if (!props.useParentContext) {
        return menuStore;
    }

    return res;
}
