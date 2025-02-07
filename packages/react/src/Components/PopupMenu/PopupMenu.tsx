import { asArray } from '@jezvejs/types';
import {
    forwardRef,
    useMemo,
    useRef,
} from 'react';

import { combineReducers } from '../../utils/combineReducers.ts';
import { createSlice } from '../../utils/createSlice.ts';
import { StoreProvider } from '../../utils/Store/StoreProvider.tsx';

import {
    MenuDefProps,
    MenuHelpers,
} from '../Menu/Menu.tsx';

import { PopupMenuContainer } from './PopupMenuContainer.tsx';
import { PopupMenuProps } from './types.ts';

import './PopupMenu.scss';

const defaultProps = {
    toggleOnClick: true,
    hideOnScroll: true,
    hideOnSelect: true,
    hideOnEmptyClick: true,
    fixed: true,
    position: {
        allowChangeAxis: true,
        scrollOnOverflow: false,
        allowResize: false,
        updateProps: {
            scrollOnOverflow: false,
            allowResize: false,
        },
    },
};

type PopupMenuRef = HTMLDivElement | null;

const menuProps = MenuDefProps.getDefaultProps();

export type * from './types.ts';

export const PopupMenu = forwardRef<PopupMenuRef, PopupMenuProps>((p, ref) => {
    const defaultId = useRef(MenuHelpers.generateMenuId('popupmenu'));

    const defProps = {
        ...defaultProps,
        id: defaultId.current,
    };

    const props = {
        ...menuProps,
        ...defProps,
        ...p,
        position: {
            ...defProps.position,
            ...(p?.position ?? {}),
            updateProps: {
                ...(defProps.position?.updateProps ?? {}),
                ...(p?.position?.updateProps ?? {}),
            },
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

    const initialState = useMemo(() => ({
        ...props,
        open: false,
        listenScroll: false,
        ignoreTouch: false,
    }), [p]);

    const storeInitial = useMemo(() => ({
        menu: {
            [initialState.id!]: { ...initialState },
        },
    }), [initialState]);

    if (props.useParentContext) {
        return <PopupMenuContainer ref={ref} {...initialState} />;
    }

    return (
        <StoreProvider
            reducer={reducers}
            initialState={storeInitial}
        >
            <PopupMenuContainer ref={ref} {...initialState} />
        </StoreProvider>
    );
});

PopupMenu.displayName = 'PopupMenu';
