import PropTypes from 'prop-types';
import { componentPropType, getSelectedItems } from '../../../helpers.ts';
import { comboControlsDefaultProps } from '../../../comboControlsDefaultProps.ts';
import './ComboBoxControls.scss';

const defaultProps = comboControlsDefaultProps;

/**
 * Combo box controls container
 */
export const DropDownComboBoxControls = (p) => {
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
