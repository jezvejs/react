import {
    DropDownComboBoxControlsComponent,
    DropDownHelpers,
    Spinner,
    useStore,
} from '@jezvejs/react';

import { MenuButton } from '../../../../../../common/Components/MenuButton/MenuButton.tsx';
import { CustomDropDownState } from '../types.ts';

const defaultProps = {
    loading: false,
    components: {
        Loading: Spinner,
        ComboMenuButton: MenuButton,
    },
};

export const CustomComboBoxControls: DropDownComboBoxControlsComponent = (p) => {
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

    const { state } = useStore<CustomDropDownState>();

    const selectedItems = DropDownHelpers.getSelectedItems(state);

    const showClear = (
        props.multiple
        && props.showClearButton
        && selectedItems.length > 0
    );

    const showLoading = !!Loading && state.loading;

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
