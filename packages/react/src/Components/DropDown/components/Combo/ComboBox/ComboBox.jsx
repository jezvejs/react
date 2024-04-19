import PropTypes from 'prop-types';
import classNames from 'classnames';
import { forwardRef } from 'react';

// Local components
import { DropDownMultiSelectionItem } from '../MultiSelectionItem/MultiSelectionItem.jsx';
import { DropDownComboBoxControls } from '../ComboBoxControls/ComboBoxControls.jsx';
import { DropDownClearButton } from '../ClearButton/ClearButton.jsx';
import { DropDownToggleButton } from '../ToggleButton/ToggleButton.jsx';
import { DropDownInput } from '../../Input/Input.jsx';
import { DropDownMultipleSelection } from '../MultipleSelection/MultipleSelection.jsx';
import { DropDownSingleSelection } from '../SingleSelection/SingleSelection.jsx';
import { DropDownPlaceholder } from '../Placeholder/Placeholder.jsx';

import { getSelectedItems, componentPropType } from '../../../helpers.js';
import './ComboBox.scss';

// eslint-disable-next-line react/display-name
export const DropDownComboBox = forwardRef((props, ref) => {
    const {
        onInput,
        disabled,
    } = props;
    const {
        Input,
        SingleSelection,
        Placeholder,
        MultipleSelection,
        MultiSelectionItem,
        ComboBoxControls,
    } = props.components;

    const onDeleteSelectedItem = () => {
        props?.onDeleteSelectedItem?.();
    };

    const selectedItems = getSelectedItems(props);
    const [selectedItem] = selectedItems;
    const str = selectedItem?.title ?? '';

    const usePlaceholder = (
        !props.useSingleSelectionAsPlaceholder
        && props.placeholder?.length > 0
    );
    const placeholder = (usePlaceholder) ? props.placeholder : str;
    const showPlaceholder = (
        !props.editable && (props.multiple || usePlaceholder)
    );

    const activeItem = (props.showMultipleSelection && props.actSelItemIndex !== -1)
        ? selectedItems[props.actSelItemIndex]
        : null;

    const multipleSelection = (
        props.multiple
        && props.showMultipleSelection
        && selectedItems.length > 0
        && (
            <MultipleSelection
                ItemComponent={MultiSelectionItem}
                items={selectedItems}
                activeItemId={activeItem?.id ?? '0'}
                disabled={disabled}
                closeable
                onCloseItem={onDeleteSelectedItem}
            />
        )
    );

    const showSingleSelection = !props.multiple && !props.editable && !showPlaceholder;

    const inputProps = {
        placeholder,
        onInput,
        disabled,
    };
    if (props.editable) {
        inputProps.value = props.inputString ?? str;
    }

    return (
        <div
            className={classNames('dd__combo', props.className)}
            ref={ref}
        >
            <div className="dd__combo-value">
                {multipleSelection}
                {showPlaceholder && <Placeholder placeholder={placeholder} />}
                {showSingleSelection && <SingleSelection item={selectedItem} />}
                {props.editable && <Input {...inputProps} ref={props.inputRef} />}
            </div>
            <ComboBoxControls {...props} />
        </div>
    );
});

DropDownComboBox.propTypes = {
    className: PropTypes.string,
    inputRef: PropTypes.object,
    inputString: PropTypes.string,
    multiple: PropTypes.bool,
    editable: PropTypes.bool,
    enableFilter: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    useSingleSelectionAsPlaceholder: PropTypes.bool,
    showMultipleSelection: PropTypes.bool,
    showClearButton: PropTypes.bool,
    showToggleButton: PropTypes.bool,
    actSelItemIndex: PropTypes.number,
    onInput: PropTypes.func,
    onDeleteSelectedItem: PropTypes.func,
    onClearSelection: PropTypes.func,
    onToggle: PropTypes.func,
    components: PropTypes.shape({
        Input: componentPropType,
        Placeholder: componentPropType,
        SingleSelection: componentPropType,
        MultipleSelection: componentPropType,
        MultiSelectionItem: componentPropType,
        ComboBoxControls: componentPropType,
        ToggleButton: componentPropType,
        ClearButton: componentPropType,
    }),
};

DropDownComboBox.defaultProps = {
    inputRef: null,
    multiple: false,
    editable: false,
    enableFilter: false,
    disabled: false,
    placeholder: null,
    useSingleSelectionAsPlaceholder: false,
    showMultipleSelection: true,
    showClearButton: true,
    showToggleButton: true,
    items: [],
    actSelItemIndex: -1,
    onInput: null,
    onDeleteSelectedItem: null,
    onClearSelection: null,
    onToggle: null,
    components: {
        Input: DropDownInput,
        Placeholder: DropDownPlaceholder,
        SingleSelection: DropDownSingleSelection,
        MultipleSelection: DropDownMultipleSelection,
        MultiSelectionItem: DropDownMultiSelectionItem,
        ComboBoxControls: DropDownComboBoxControls,
        ToggleButton: DropDownToggleButton,
        ClearButton: DropDownClearButton,
    },
};
