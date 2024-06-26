import { isFunction } from '@jezvejs/types';
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Input.scss';

/**
 * Input component
 */
// eslint-disable-next-line react/display-name
export const Input = forwardRef((props, ref) => {
    const {
        renderValue,
        ...rest
    } = props;

    const onChange = (e) => props.onChange?.(e);

    const getValue = (inputState) => (
        isFunction(renderValue)
            ? renderValue(inputState)
            : (inputState?.value)
    );

    const inputProps = {
        ...rest,
        className: classNames('input', props.className),
        onChange,
        value: getValue(props),
    };

    return (
        <input {...inputProps} ref={ref} />
    );
});

Input.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string,
    form: PropTypes.string,
    tabIndex: PropTypes.number,
    inputMode: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    value: PropTypes.string,
    onInput: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    renderValue: PropTypes.func,
};

Input.defaultProps = {
    type: 'text',
    disabled: false,
    value: '',
    onInput: null,
    onFocus: null,
    onBlur: null,
    onChange: null,
};
