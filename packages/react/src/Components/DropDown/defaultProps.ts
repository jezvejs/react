// Common components
import { MenuCheckbox } from '../Menu/Menu.tsx';

// Local components
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
import { DropDownMenuList } from './components/Menu/MenuList/MenuList.tsx';
import { DropDownListItem } from './components/Menu/ListItem/ListItem.tsx';
import { DropDownGroupItem } from './components/Menu/GroupItem/GroupItem.tsx';
import { DropDownGroupHeader } from './components/Menu/GroupHeader/GroupHeader.tsx';
import { DropDownListPlaceholder } from './components/Menu/ListPlaceholder/ListPlaceholder.tsx';

export const defaultProps = {
    className: null,
    multiple: false,
    listAttach: false,
    static: false,
    isValidToggleTarget: null,
    fixedMenu: false,
    enableFilter: false,
    openOnFocus: false,
    loopNavigation: true,
    noResultsMessage: 'No items',
    allowCreate: false,
    allowActiveGroupHeader: false,
    addItemMessage: (title) => `Add item: '${title}'`,
    disabled: false,
    useNativeSelect: false,
    fullScreen: false,
    placeholder: null,
    reducers: null,
    blurInputOnSingleSelect: true,
    useSingleSelectionAsPlaceholder: true,
    clearFilterOnMultiSelect: false,
    showMultipleSelection: true,
    showClearButton: true,
    showToggleButton: true,
    onGroupHeaderClick: null,
    onItemSelect: null,
    onChange: null,
    onInput: null,
    components: {
        Input: DropDownInput,
        NativeSelect: DropDownNativeSelect,
        Placeholder: DropDownPlaceholder,
        SingleSelection: DropDownSingleSelection,
        ComboBox: DropDownComboBox,
        Menu: DropDownMenu,
        MenuList: DropDownMenuList,
        ListItem: DropDownListItem,
        Check: MenuCheckbox,
        GroupItem: DropDownGroupItem,
        GroupHeader: DropDownGroupHeader,
        ListPlaceholder: DropDownListPlaceholder,
        MultipleSelection: DropDownMultipleSelection,
        MultiSelectionItem: DropDownMultiSelectionItem,
        ComboBoxControls: DropDownComboBoxControls,
        ToggleButton: DropDownToggleButton,
        ClearButton: DropDownClearButton,
    },
};
