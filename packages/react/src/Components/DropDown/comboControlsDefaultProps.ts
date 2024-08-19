import { DropDownClearButton } from './components/Combo/ClearButton/ClearButton.tsx';
import { DropDownToggleButton } from './components/Combo/ToggleButton/ToggleButton.tsx';

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
