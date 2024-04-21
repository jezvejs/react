import {
    DropDownComboBoxControls,
    DropDownHelpers,
    Spinner,
    useDropDownState,
} from '@jezvejs/react';
import PropTypes from 'prop-types';
import { MenuButton } from '../../../../../../Components/MenuButton/MenuButton.jsx';

export const CustomComboBoxControls = (props) => {
    const {
        disabled,
        showToggleButton,
        onClearSelection,
    } = props;
    const {
        ClearButton,
        ToggleButton,
        Loading,
        ComboMenuButton,
    } = props.components;

    const state = useDropDownState();

    const selectedItems = DropDownHelpers.getSelectedItems(props);

    const showClear = (
        props.multiple
        && props.showClearButton
        && selectedItems.length > 0
    );

    const showLoading = state.loading;

    return (
        <div className="dd__combo-controls">
            {showLoading && <Loading className="dd__combo-loading" />}
            {ComboMenuButton && <ComboMenuButton />}
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

CustomComboBoxControls.propTypes = {
    ...DropDownComboBoxControls.propTypes,
    loading: PropTypes.bool,
    components: PropTypes.shape({
        Loading: DropDownHelpers.componentPropType,
        ComboMenuButton: DropDownHelpers.componentPropType,
    }),
};

CustomComboBoxControls.defaultProps = {
    ...DropDownComboBoxControls.defaultProps,
    loading: false,
    components: {
        ...DropDownComboBoxControls.defaultProps.components,
        Loading: Spinner,
        ComboMenuButton: MenuButton,
    },
};
