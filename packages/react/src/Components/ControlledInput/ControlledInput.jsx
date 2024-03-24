import { isFunction } from '@jezvejs/types';
import { useCallback } from 'react';
import PropTypes from 'prop-types';

import { Input } from '../Input/Input.jsx';

import { getInputContent, replaceSelection } from './helpers.js';

const autoFeatures = {
    autoComplete: 'off',
    autoCapitalize: 'none',
    spellCheck: false,
    autoCorrect: 'off',
};

export const ControlledInput = (props) => {
    const {
        handleValueProperty,
        disableAutoFeatures,
        isValidValue,
        ...childProps
    } = props;

    const validate = (value) => (
        isFunction(isValidValue) ? isValidValue(value) : true
    );

    const validateInput = (e) => {
        const inputContent = getInputContent(e) ?? '';

        const expectedContent = replaceSelection(e.target, inputContent);
        const res = validate(expectedContent);
        if (!res) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    /**
     * Verifies update of input value and returns valid value
     */
    const handleValue = (value, prev) => (
        validate(value) ? value : prev
    );

    /** Define setter for 'value' property of input to prevent invalid values */
    const observeInputValue = (input) => {
        const elementPrototype = Object.getPrototypeOf(input);
        const descriptor = Object.getOwnPropertyDescriptor(elementPrototype, 'value');

        Object.defineProperty(input, 'value', {
            get() {
                return descriptor.get.call(this);
            },
            set(value) {
                if (value === this.value) {
                    return;
                }

                descriptor.set.call(this, handleValue(value, this.value));
            },
        });
    };

    const contentRef = useCallback((node) => {
        if (!node) {
            return;
        }

        if (props.handleValueProperty) {
            observeInputValue(node);
        }
    }, [props.handleValueProperty]);

    const autoProps = (disableAutoFeatures)
        ? autoFeatures
        : {};

    const inputProps = {
        ...childProps,
        ...autoProps,
        onBeforeInputCapture: validateInput,
        onPasteCapture: validateInput,
        onKeyPressCapture: validateInput,
        ref: contentRef,
    };

    return (
        <Input {...inputProps} />
    );
};

ControlledInput.propTypes = {
    ...Input.propTypes,
    handleValueProperty: PropTypes.bool,
    disableAutoFeatures: PropTypes.bool,
    isValidValue: PropTypes.func,
};

ControlledInput.defaultProps = {
    ...Input.defaultProps,
    handleValueProperty: true,
    disableAutoFeatures: true,
    isValidValue: null,
};
