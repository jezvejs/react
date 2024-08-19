import { useStore } from '../../../../../utils/Store/StoreProvider.tsx';

import { comboControlsDefaultProps } from '../../../comboControlsDefaultProps.ts';
import { getSelectedItems } from '../../../helpers.ts';
import {
    DropDownComboBoxControlsComponent,
    DropDownComboBoxControlsProps,
    DropDownState,
} from '../../../types.ts';

import './ComboBoxControls.scss';

const defaultProps = comboControlsDefaultProps;

/**
 * Combo box controls container
 */
export const DropDownComboBoxControls: DropDownComboBoxControlsComponent = (
    p: DropDownComboBoxControlsProps,
) => {
    const props = {
        ...defaultProps,
        ...p,
        components: {
            ...defaultProps.components,
            ...(p?.components ?? {}),
        },
    };

    const {
        disabled,
        showToggleButton,
        onClearSelection,
    } = props;
    const { ClearButton, ToggleButton } = props.components;

    const { state } = useStore()!;
    const selectedItems = getSelectedItems(state as DropDownState);

    const showClear = (
        props.multiple
        && props.showClearButton
        && selectedItems.length > 0
    );

    return (
        <div className="dd__combo-controls">
            {showClear && (
                <ClearButton
                    disabled={disabled}
                    onClick={onClearSelection}
                />
            )}
            {showToggleButton && (
                <ToggleButton
                    disabled={disabled}
                />
            )}
        </div>
    );
};
