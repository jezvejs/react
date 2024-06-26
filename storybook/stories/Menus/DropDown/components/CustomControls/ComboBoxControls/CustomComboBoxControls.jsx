import {
    DropDownComboBoxControls,
    DropDownHelpers,
    Spinner,
    useStore,
} from '@jezvejs/react';
import PropTypes from 'prop-types';
import { MenuButton } from '../../../../../../Components/MenuButton/MenuButton.jsx';

const defaultProps = {
    loading: false,
    components: {
        Loading: Spinner,
        ComboMenuButton: MenuButton,
    },
};

export const CustomComboBoxControls = (p) => {
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
    const {
        ClearButton,
        ToggleButton,
        Loading,
        ComboMenuButton,
    } = props.components;

    const { state } = useStore();

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
