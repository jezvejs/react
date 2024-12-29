import { forwardRef } from 'react';
import { useStore } from '../../../../utils/Store/StoreProvider.tsx';
import {
    DropDownInputComponent,
    DropDownInputProps,
    DropDownInputRef,
    DropDownState,
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

    const {
        state,
        getState,
        dispatch,
        setState,
    } = useStore<DropDownState>();

    const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.type !== 'change') {
            return;
        }

        props?.onInput?.({
            e,
            state,
            getState,
            setState,
            dispatch,
        });
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
    };

    if (!disabled) {
        inputProps.tabIndex = props.tabIndex;
    }

    return (
        <input
            ref={ref}
            {...inputProps}
            onInput={onInput}
            onChange={onInput}
        />
    );
});

DropDownInput.displayName = 'DropDownInput';
