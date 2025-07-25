import { asArray } from '@jezvejs/types';
import {
    forwardRef,
    useEffect,
    useMemo,
    useRef,
} from 'react';

import { createSlice } from '../../utils/createSlice.ts';
import { StoreProvider, useStore } from '../../utils/Store/StoreProvider.tsx';
import { combineReducers } from '../../utils/combineReducers.ts';

import { MenuCheckbox } from './components/Checkbox/MenuCheckbox.tsx';
import { MenuList } from './components/List/MenuList.tsx';
import { MenuSeparator } from './components/Separator/MenuSeparator.tsx';
import { MenuGroupHeader } from './components/GroupHeader/MenuGroupHeader.tsx';
import { MenuGroupItem } from './components/GroupItem/MenuGroupItem.tsx';
import { MenuItem } from './components/ListItem/MenuItem.tsx';
import { MenuContainer } from './MenuContainer.tsx';

import * as MenuDefProps from './defaultProps.ts';
import * as MenuHelpers from './helpers.ts';
import { MenuProps, MultiMenuState } from './types.ts';
import './Menu.scss';

export {
    MenuList,
    MenuItem,
    MenuSeparator,
    MenuCheckbox,
    MenuGroupHeader,
    MenuGroupItem,
    // utils
    MenuHelpers,
    MenuDefProps,
};

export * from './types.ts';

type MenuRef = HTMLDivElement | null;

const {
    getInitialState,
} = MenuHelpers;

const defaultProps = MenuDefProps.getDefaultProps();

/**
 * Menu component
 */
export const Menu = forwardRef<MenuRef, MenuProps>((p, ref) => {
    const defaultId = useRef(MenuHelpers.generateMenuId('menu'));

    const defProps = {
        ...defaultProps,
        id: defaultId.current,
    };

    const props = {
        ...defProps,
        ...p,
        components: {
            ...defProps.components,
            ...(p?.components ?? {}),
        },
    };

    const slice = createSlice({
    });

    const reducers = useMemo(() => {
        const extraReducers = asArray(props.reducers);
        return (extraReducers.length > 0)
            ? combineReducers(slice.reducer, ...extraReducers)
            : slice.reducer;
    }, [props.reducers]);

    const initialState = useMemo(() => (
        getInitialState(props, defProps)
    ), [props]);

    const storeInitial = useMemo(() => ({
        menu: {
            [initialState.id!]: { ...initialState },
        },
    }), [initialState]);

    const parentStore = useStore<MultiMenuState>();

    useEffect(() => {
        const menuId = initialState.id;
        const { useParentContext } = initialState;
        if (!parentStore || !useParentContext || !menuId) {
            return;
        }

        const parentState = parentStore.getState();
        if (parentState.menu?.[menuId]) {
            return;
        }

        parentStore.setState((prev: MultiMenuState) => ({
            ...prev,
            menu: {
                ...(prev.menu ?? {}),
                [menuId]: {
                    ...(prev.menu?.[menuId] ?? {}),
                    ...initialState,
                },
            },
        }));
    }, [props.items]);

    if (props.useParentContext) {
        return <MenuContainer ref={ref} {...initialState} />;
    }

    return (
        <StoreProvider
            reducer={reducers}
            initialState={storeInitial}
        >
            <MenuContainer ref={ref} {...initialState} />
        </StoreProvider>
    );
});

Menu.displayName = 'Menu';
