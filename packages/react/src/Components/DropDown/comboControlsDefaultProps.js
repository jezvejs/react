import { DropDownClearButton } from './components/Combo/ClearButton/ClearButton.jsx';
import { DropDownToggleButton } from './components/Combo/ToggleButton/ToggleButton.jsx';

export const comboControlsDefaultProps = {
    multiple: false,
    disabled: false,
    showClearButton: true,
    showToggleButton: true,
    actSelItemIndex: -1,
    onClearSelection: null,
    onToggle: null,
    components: {
        ToggleButton: DropDownToggleButton,
        ClearButton: DropDownClearButton,
    },
};
