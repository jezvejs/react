import { asArray } from '@jezvejs/types';
import { forwardRef, useMemo } from 'react';

import { createSlice } from '../../utils/createSlice.ts';
import { StoreProvider } from '../../utils/Store/StoreProvider.tsx';
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
import { MenuProps } from './types.ts';
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
// eslint-disable-next-line react/display-name
export const Menu = forwardRef<MenuRef, MenuProps>((p, ref) => {
    const props = {
        ...defaultProps,
        ...p,
        components: {
            ...defaultProps.components,
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
        getInitialState(props, defaultProps)
    ), [props]);

    return (
        <StoreProvider
            reducer={reducers}
            initialState={initialState}
        >
            <MenuContainer ref={ref} {...initialState} />
        </StoreProvider>
    );
});
