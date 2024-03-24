import { isFunction } from '@jezvejs/types';
import { useCallback } from 'react';
import PropTypes from 'prop-types';

import { Input } from '../Input/Input.jsx';

import { getInputContent, replaceSelection } from './helpers.js';

export const ControlledInput = (props) => {
    const isValidValue = (value) => (
        (isFunction(props.isValidValue))
            ? props.isValidValue(value)
            : true
    );

    const validateInput = (e) => {
        const inputContent = getInputContent(e) ?? '';

        const expectedContent = replaceSelection(e.target, inputContent);
        const res = isValidValue(expectedContent);
        if (!res) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    /**
     * Verifies update of input value and returns valid value
     *
     * @param {string} value
     * @returns {string}
     */
    const handleValue = (value, prev) => {
        const isValid = isValidValue(value);
        return (isValid) ? value : prev;
    };

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

    const inputProps = {
        ...props,
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
