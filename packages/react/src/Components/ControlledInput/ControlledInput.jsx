import { isFunction } from '@jezvejs/types';
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

    const inputProps = {
        ...props,
        onBeforeInputCapture: validateInput,
        onPasteCapture: validateInput,
        onKeyPressCapture: validateInput,
    };

    return (
        <Input {...inputProps} />
    );
};

ControlledInput.propTypes = {
    ...Input.defaultProps,
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
