import { forwardRef } from 'react';
import {
    DropDownNativeSelectComponent,
    DropDownNativeSelectProps,
    DropDownNativeSelectRef,
    OptGroupProps,
    OptionProps,
} from '../../types.ts';

/**
 * Select option component
 */
const Option = (props: OptionProps) => (
    <option value={props.id}>{props.title}</option>
);

/**
 * Select options group component
 */
const OptGroup = (props: OptGroupProps) => (
    <optgroup label={props.title} disabled={props.disabled}>
        {props.items.map((item: OptionProps) => (
            <Option key={`opt_${Date.now()}${item.id}`} {...props} />
        ))}
    </optgroup>
);

const NativeSelectListItem = (props: OptionProps | OptGroupProps) => (
    ('type' in props && props.type === 'group')
        ? <OptGroup {...props} />
        : <Option {...props} />
);

const defaultProps = {
    tabIndex: 0,
    disabled: false,
    multiple: false,
};

// eslint-disable-next-line react/display-name
export const DropDownNativeSelect: DropDownNativeSelectComponent = forwardRef<
    DropDownNativeSelectRef,
    DropDownNativeSelectProps
>((p, ref) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const {
        id,
        multiple,
        disabled,
        onChange,
    } = props;

    const selectProps: React.SelectHTMLAttributes<HTMLSelectElement> = {
        id,
        multiple,
        disabled,
        onChange,
    };

    if (!disabled && ('tabIndex' in props)) {
        selectProps.tabIndex = props.tabIndex;
    }

    return (
        <select
            {...selectProps}
            ref={ref}
        >
            {props.items.map((item: OptionProps | OptGroupProps) => (
                <NativeSelectListItem
                    {...item}
                    key={`opt_${Date.now()}${props.id}`}
                />
            ))}
        </select>
    );
});