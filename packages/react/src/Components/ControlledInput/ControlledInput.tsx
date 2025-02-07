import { useCallback } from 'react';
import { Input } from '../Input/Input.tsx';
import { getInputContent, replaceSelection } from './helpers.ts';
import { ControlledInputEvent, ControlledInputProps } from './types.ts';

const autoFeatures = {
    autoComplete: 'off',
    autoCapitalize: 'none',
    spellCheck: false,
    autoCorrect: 'off',
};

export * from './types.ts';

export const ControlledInputHelpers = {
    getInputContent,
    replaceSelection,
};

export const ControlledInput: React.FC<ControlledInputProps> = (props) => {
    const {
        handleValueProperty = true,
        disableAutoFeatures = true,
        isValidValue,
        onValidateInput,
        onValue,
        selectionStart,
        selectionEnd,
        ...childProps
    } = props;

    const validate = (value: string) => (
        (typeof isValidValue === 'function') ? isValidValue(value) : true
    );

    const defaultValidateHandler = (e: ControlledInputEvent) => {
        const inputContent = getInputContent(e) ?? '';

        const target = e.target as HTMLInputElement;
        const expectedContent = replaceSelection(target, inputContent);
        const res = validate(expectedContent);
        if (!res) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    const validateInput = (typeof onValidateInput === 'function')
        ? onValidateInput
        : defaultValidateHandler;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        validateInput(e);

        if (!e.defaultPrevented) {
            props.onChange?.(e);
        }
    };

    /**
     * Verifies update of input value and returns valid value
     */
    const defaultValuehandler = (value: string, prev: string) => (
        validate(value) ? value : prev
    );

    const handleValue = (typeof onValue === 'function')
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

    const contentRef = useCallback((node: HTMLInputElement | null) => {
        if (!node) {
            return;
        }

        if (handleValueProperty) {
            observeInputValue(node);
        }

        const elem = node;
        elem.selectionStart = selectionStart ?? null;
        elem.selectionEnd = selectionEnd ?? null;
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
