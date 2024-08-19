import { isFunction } from '@jezvejs/types';
import { useCallback } from 'react';

import { Input, InputProps } from '../Input/Input.tsx';

import { getInputContent, replaceSelection } from './helpers.ts';

const autoFeatures = {
    autoComplete: 'off',
    autoCapitalize: 'none',
    spellCheck: false,
    autoCorrect: 'off',
};

export const ControlledInputHelpers = {
    getInputContent,
    replaceSelection,
};

export interface ControlledInputProps extends InputProps {
    selectionStart?: number,
    selectionEnd?: number,
    handleValueProperty?: boolean,
    disableAutoFeatures?: boolean,
    isValidValue?: () => void,
    onValidateInput?: () => void,
    onValue?: () => void,
}

export const ControlledInput = (props) => {
    const {
        handleValueProperty = true,
        disableAutoFeatures = true,
        isValidValue = null,
        onValidateInput = null,
        onValue = null,
        selectionStart,
        selectionEnd,
        ...childProps
    } = props;

    const validate = (value) => (
        isFunction(isValidValue) ? isValidValue(value) : true
    );

    const defaultValidateHandler = (e) => {
        const inputContent = getInputContent(e) ?? '';

        const expectedContent = replaceSelection(e.target, inputContent);
        const res = validate(expectedContent);
        if (!res) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    const validateInput = isFunction(onValidateInput)
        ? onValidateInput
        : defaultValidateHandler;

    const onChange = (e) => {
        validateInput(e);

        if (!e.defaultPrevented) {
            props.onChange?.(e);
        }
    };

    /**
     * Verifies update of input value and returns valid value
     */
    const defaultValuehandler = (value, prev) => (
        validate(value) ? value : prev
    );

    const handleValue = isFunction(onValue)
        ? onValue
        : defaultValuehandler;

    /** Define setter for 'value' property of input to prevent invalid values */
    const observeInputValue = (input: HTMLInputElement) => {
        const elementPrototype = Object.getPrototypeOf(input);
        const descriptor = Object.getOwnPropertyDescriptor(elementPrototype, 'value') ?? null;
        if (!descriptor) {
            return;
        }

        Object.defineProperty(input, 'value', {
            get() {
                return descriptor.get?.call(this);
            },
            set(value) {
                if (value === this.value) {
                    return;
                }

                descriptor.set?.call(this, handleValue(value, this.value));
            },
        });
    };

    const contentRef = useCallback((node) => {
        if (!node) {
            return;
        }

        if (handleValueProperty) {
            observeInputValue(node);
        }

        const elem = node;
        elem.selectionStart = selectionStart;
        elem.selectionEnd = selectionEnd;
    }, [handleValueProperty, selectionStart, selectionEnd]);

    const autoProps = (disableAutoFeatures)
        ? autoFeatures
        : {};

    const inputProps = {
        ...childProps,
        ...autoProps,
        onBeforeInput: validateInput,
        onPasteCapture: validateInput,
        onChange,
        ref: contentRef,
    };

    return (
        <Input {...inputProps} />
    );
};
