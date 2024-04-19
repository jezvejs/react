import PropTypes from 'prop-types';

import { DropDownClearButton } from '../ClearButton/ClearButton.jsx';
import { DropDownToggleButton } from '../ToggleButton/ToggleButton.jsx';

import { componentPropType, getSelectedItems } from '../../../helpers.js';
import './ComboBoxControls.scss';

/**
 * Combo box controls container
 */
export const DropDownComboBoxControls = (props) => {
    const {
        disabled,
        showToggleButton,
        onClearSelection,
    } = props;
    const { ClearButton, ToggleButton } = props.components;

    const selectedItems = getSelectedItems(props);

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

DropDownComboBoxControls.propTypes = {
    multiple: PropTypes.bool,
    disabled: PropTypes.bool,
    showClearButton: PropTypes.bool,
    showToggleButton: PropTypes.bool,
    actSelItemIndex: PropTypes.number,
    onClearSelection: PropTypes.func,
    onToggle: PropTypes.func,
    components: PropTypes.shape({
        ToggleButton: componentPropType,
        ClearButton: componentPropType,
    }),
};

DropDownComboBoxControls.defaultProps = {
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
