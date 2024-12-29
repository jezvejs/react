import { asArray } from '@jezvejs/types';
import {
    forwardRef,
    useMemo,
} from 'react';

import { StoreProvider } from '../../utils/Store/StoreProvider.tsx';
import { combineReducers } from '../../utils/combineReducers.ts';

// Local components
import { DropDownContainer } from './DropDownContainer.tsx';
import { DropDownInput } from './components/Input/Input.tsx';
import { DropDownNativeSelect } from './components/NativeSelect/NativeSelect.tsx';
// Local components - Combo box
import { DropDownComboBox } from './components/Combo/ComboBox/ComboBox.tsx';
import { DropDownComboBoxControls } from './components/Combo/ComboBoxControls/ComboBoxControls.tsx';
import { DropDownSingleSelection } from './components/Combo/SingleSelection/SingleSelection.tsx';
import { DropDownMultipleSelection } from './components/Combo/MultipleSelection/MultipleSelection.tsx';
import { DropDownMultiSelectionItem } from './components/Combo/MultiSelectionItem/MultiSelectionItem.tsx';
import { DropDownPlaceholder } from './components/Combo/Placeholder/Placeholder.tsx';
import { DropDownClearButton } from './components/Combo/ClearButton/ClearButton.tsx';
import { DropDownToggleButton } from './components/Combo/ToggleButton/ToggleButton.tsx';
// Local components - Menu
import { DropDownMenu } from './components/Menu/Menu/Menu.tsx';
import { DropDownMenuHeader } from './components/Menu/MenuHeader/MenuHeader.tsx';
import { DropDownMenuList } from './components/Menu/MenuList/MenuList.tsx';
import { DropDownListItem } from './components/Menu/ListItem/ListItem.tsx';
import { DropDownGroupItem } from './components/Menu/GroupItem/GroupItem.tsx';
import { DropDownGroupHeader } from './components/Menu/GroupHeader/GroupHeader.tsx';
import { DropDownListPlaceholder } from './components/Menu/ListPlaceholder/ListPlaceholder.tsx';

import * as DropDownDefProps from './defaultProps.ts';
import * as DropDownHelpers from './helpers.ts';
import { reducer } from './reducer.ts';
import { DropDownProps } from './types.ts';
import './DropDown.scss';

export {
    // Child components
    // Combobox
    DropDownComboBox,
    DropDownInput,
    DropDownNativeSelect,
    DropDownPlaceholder,
    DropDownSingleSelection,
    DropDownMultipleSelection,
    DropDownMultiSelectionItem,
    DropDownComboBoxControls,
    DropDownToggleButton,
    DropDownClearButton,
    // Menu
    DropDownMenu,
    DropDownMenuHeader,
    DropDownMenuList,
    DropDownListItem,
    DropDownGroupItem,
    DropDownGroupHeader,
    DropDownListPlaceholder,
    // utils
    DropDownHelpers,
    DropDownDefProps,
};

export * from './types.ts';

type DropDownRef = HTMLDivElement | null;

/**
 * DropDown component
 */
export const DropDown = forwardRef<DropDownRef, DropDownProps>((props, ref) => {
    const reducers = useMemo(() => {
        const extraReducers = asArray(props.reducers);
        return (extraReducers.length > 0)
            ? combineReducers(reducer, ...extraReducers)
            : reducer;
    }, [props.reducers]);

    const initialState = (
        DropDownHelpers.getInitialState(props, DropDownDefProps.defaultProps)
    );

    return (
        <StoreProvider
            reducer={reducers}
            initialState={initialState}
        >
            <DropDownContainer ref={ref} {...initialState} />
        </StoreProvider>
    );
});

DropDown.displayName = 'DropDown';
