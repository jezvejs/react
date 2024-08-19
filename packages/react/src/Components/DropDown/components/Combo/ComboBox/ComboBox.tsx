import classNames from 'classnames';
import { forwardRef } from 'react';

import { useStore } from '../../../../../utils/Store/StoreProvider.tsx';

// Local components
import { DropDownMultiSelectionItem } from '../MultiSelectionItem/MultiSelectionItem.tsx';
import { DropDownComboBoxControls } from '../ComboBoxControls/ComboBoxControls.tsx';
import { DropDownClearButton } from '../ClearButton/ClearButton.tsx';
import { DropDownToggleButton } from '../ToggleButton/ToggleButton.tsx';
import { DropDownInput } from '../../Input/Input.tsx';
import { DropDownMultipleSelection } from '../MultipleSelection/MultipleSelection.tsx';
import { DropDownSingleSelection } from '../SingleSelection/SingleSelection.tsx';
import { DropDownPlaceholder } from '../Placeholder/Placeholder.tsx';

import { getSelectedItems } from '../../../helpers.ts';
import {
    DropDownComboBoxComponent,
    DropDownComboBoxProps,
    DropDownComboBoxRef,
    DropDownInputProps,
    DropDownPlaceholderProps,
    DropDownState,
} from '../../../types.ts';
import './ComboBox.scss';

const defaultProps = {
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

// eslint-disable-next-line react/display-name
export const DropDownComboBox: DropDownComboBoxComponent = forwardRef<
    DropDownComboBoxRef,
    DropDownComboBoxProps
>((p, ref) => {
    const props = {
        ...defaultProps,
        ...p,
        components: {
            ...defaultProps.components,
            ...(p?.components ?? {}),
        },
    };

    const {
        onInput,
        disabled,
        multiple,
        editable,
    } = props;
    const {
        Input,
        SingleSelection,
        Placeholder,
        MultipleSelection,
        MultiSelectionItem,
        ComboBoxControls,
    } = props.components ?? {};

    const onDeleteSelectedItem = (itemId, e) => {
        props?.onDeleteSelectedItem?.({ itemId, e });
    };

    const { state } = useStore()!;
    const selectedItems = getSelectedItems(state as DropDownState);
    const [selectedItem] = selectedItems;
    const str = selectedItem?.title ?? '';

    const usePlaceholder = (
        multiple || (
            !props.useSingleSelectionAsPlaceholder
            && (props.placeholder?.length ?? 0) > 0
        )
    );
    const placeholder = (usePlaceholder) ? (props.placeholder ?? '') : str;
    const showPlaceholder = (!editable && usePlaceholder);

    const activeItem = (props.showMultipleSelection && props.actSelItemIndex !== -1)
        ? selectedItems[props.actSelItemIndex]
        : null;

    const multipleSelection = (
        multiple
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

    const showSingleSelection = !multiple && !editable && !showPlaceholder;

    // Placeholder
    const placeholderProps: DropDownPlaceholderProps = {
        placeholder,
    };

    // Input
    const inputProps: DropDownInputProps = {
        placeholder,
        onInput: (onInput ?? undefined),
        disabled,
    };
    if (editable) {
        inputProps.value = props.inputString ?? ((multiple) ? '' : str);
    }

    return (
        <div
            className={classNames('dd__combo', props.className)}
            ref={ref}
        >
            <div className="dd__combo-value">
                {multipleSelection}
                {showPlaceholder && <Placeholder {...placeholderProps} />}
                {showSingleSelection && <SingleSelection item={selectedItem} />}
                {editable && Input && <Input {...inputProps} ref={props.inputRef} />}
            </div>
            <ComboBoxControls {...props} />
        </div>
    );
});
