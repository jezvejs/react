import { asArray } from '@jezvejs/types';
import {
    forwardRef,
    useMemo,
} from 'react';

import { StoreProvider } from '../../utils/Store/StoreProvider.jsx';
import { combineReducers } from '../../utils/combineReducers.js';

// Local components
import { DropDownContainer } from './DropDownContainer.jsx';
import { DropDownInput } from './components/Input/Input.jsx';
import { DropDownNativeSelect } from './components/NativeSelect/NativeSelect.jsx';
// Local components - Combo box
import { DropDownComboBox } from './components/Combo/ComboBox/ComboBox.jsx';
import { DropDownComboBoxControls } from './components/Combo/ComboBoxControls/ComboBoxControls.jsx';
import { DropDownSingleSelection } from './components/Combo/SingleSelection/SingleSelection.jsx';
import { DropDownMultipleSelection } from './components/Combo/MultipleSelection/MultipleSelection.jsx';
import { DropDownMultiSelectionItem } from './components/Combo/MultiSelectionItem/MultiSelectionItem.jsx';
import { DropDownPlaceholder } from './components/Combo/Placeholder/Placeholder.jsx';
import { DropDownClearButton } from './components/Combo/ClearButton/ClearButton.jsx';
import { DropDownToggleButton } from './components/Combo/ToggleButton/ToggleButton.jsx';
// Local components - Menu
import { DropDownMenu } from './components/Menu/Menu/Menu.jsx';
import { DropDownMenuHeader } from './components/Menu/MenuHeader/MenuHeader.jsx';
import { DropDownMenuList } from './components/Menu/MenuList/MenuList.jsx';
import { DropDownListItem } from './components/Menu/ListItem/ListItem.jsx';
import { DropDownGroupItem } from './components/Menu/GroupItem/GroupItem.jsx';
import { DropDownGroupHeader } from './components/Menu/GroupHeader/GroupHeader.jsx';
import { DropDownListPlaceholder } from './components/Menu/ListPlaceholder/ListPlaceholder.jsx';

import * as DropDownHelpers from './helpers.js';
import { reducer } from './reducer.js';
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
};

/**
 * DropDown component
 */
// eslint-disable-next-line react/display-name
export const DropDown = forwardRef((props, ref) => {
    const reducers = useMemo(() => {
        const extraReducers = asArray(props.reducers);
        return (extraReducers.length > 0)
            ? combineReducers(reducer, ...extraReducers)
            : reducer;
    }, [props.reducers]);

    const initialState = (
        DropDownHelpers.getInitialState(props, DropDown.defaultProps)
    );

    return (
        <StoreProvider
            reducer={reducers}
            initialState={initialState}
        >
            <DropDownContainer ref={ref} {...props} />
        </StoreProvider>
    );
});

DropDown.propTypes = {
    ...DropDownContainer.propTypes,
};

DropDown.defaultProps = {
    ...DropDownContainer.defaultProps,
};
