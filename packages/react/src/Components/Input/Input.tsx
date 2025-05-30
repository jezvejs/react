import { forwardRef } from 'react';
import classNames from 'classnames';

import './Input.scss';

export type InputModes = (
    'text'
    | 'search'
    | 'email'
    | 'tel'
    | 'url'
    | 'none'
    | 'numeric'
    | 'decimal'
);

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> & {
    value?: string;

    renderValue?: (value: InputProps) => string;
};

const defaultProps: InputProps = {
    type: 'text',
    disabled: false,
    value: '',
};

export type InputRef = HTMLInputElement;

/**
 * Input component
 */
export const Input = forwardRef<InputRef, InputProps>((p, ref) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const {
        renderValue,
        ...rest
    } = props;

    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => props.onFocus?.(e);

    const onBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => props.onBlur?.(e);

    const onInput = (e: React.ChangeEvent<HTMLInputElement>) => props.onInput?.(e);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => props.onChange?.(e);

    const getValue = (inputState: InputProps) => (
        (typeof renderValue === 'function')
            ? renderValue(inputState)
            : (inputState?.value)
    );

    const inputProps = {
        ...rest,
        className: classNames('input', props.className),
        onFocus,
        onBlur,
        onInput,
        onChange,
        value: getValue(props),
    };

    return (
        <input {...inputProps} ref={ref} />
    );
});

Input.displayName = 'Input';
