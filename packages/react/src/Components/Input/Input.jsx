import { isFunction } from '@jezvejs/types';
import { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Input.scss';

/**
 * Input component
 */
// eslint-disable-next-line react/display-name
export const Input = forwardRef((props, ref) => {
    const {
        className,
        renderValue,
        ...inputProps
    } = props;

    const [state, setState] = useState({
        value: props.value ?? '',
    });

    const getValue = (state) => (
        isFunction(renderValue) ? renderValue(state) : (state?.value)
    );

    const onInput = (e) => {
        setState((prev) => ({ ...prev, value: e.target.value }));
    };

    return (
        <input
            className={classNames('input', className)}
            {...inputProps}
            onInput={onInput}
            value={getValue(state)}
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
    renderValue: PropTypes.func,
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
    renderValue: null,
};
