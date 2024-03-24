import { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Input.scss';

/**
 * Input component
 */
export const Input = forwardRef((props, ref) => {
    const {
        className,
        ...inputProps
    } = props;

    const [value, setValue] = useState(props.value ?? '');

    const onInput = (e) => {
        setValue(e.target.value);
    };

    return (
        <input
            className={classNames('input', className)}
            {...inputProps}
            onInput={onInput}
            value={value}
            ref={ref}
        />
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
};

Input.defaultProps = {
    placeholder: '',
    type: 'text',
    disabled: false,
    value: '',
    onInput: null,
    onFocus: null,
    onBlur: null,
    onChange: null,
};
