import { forwardRef } from 'react';
import {
    DropDownInputComponent,
    DropDownInputProps,
    DropDownInputRef,
    DropDownValidInputTypes,
} from '../../types.ts';
import './Input.scss';

const autoFeatures = {
    autoComplete: 'off',
    autoCapitalize: 'none',
    spellCheck: false,
    autoCorrect: 'off',
};

const defaultProps = {
    value: '',
    type: 'text',
    placeholder: '',
    tabIndex: 0,
    disabled: false,
    onInput: null,
};

// eslint-disable-next-line react/display-name
export const DropDownInput: DropDownInputComponent = forwardRef<
    DropDownInputRef,
    DropDownInputProps
>((p, ref) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const {
        id,
        value,
        type,
        placeholder,
        disabled,
        hidden,
    } = props;

    const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        props?.onInput?.(e);
    };

    const inputProps: DropDownInputProps = {
        ...autoFeatures,
        id,
        className: 'dd__input',
        value,
        type: type as DropDownValidInputTypes,
        placeholder,
        disabled,
        hidden,
        onInput,
        onChange: onInput,
    };

    if (!disabled) {
        inputProps.tabIndex = props.tabIndex;
    }

    return (
        <input
            ref={ref}
            {...inputProps}
        />
    );
});
