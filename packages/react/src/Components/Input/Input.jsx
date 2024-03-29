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
        onInput,
        ...inputProps
    } = props;

    const [state, setState] = useState({
        value: props.value ?? '',
    });

    const getValue = (inputState) => (
        isFunction(renderValue) ? renderValue(inputState) : (inputState?.value)
    );

    const inputHandler = (e) => {
        setState((prev) => ({ ...prev, value: e.target.value }));

        if (isFunction(onInput)) {
            onInput(e);
        }
    };

    return (
        <input
            className={classNames('input', className)}
            {...inputProps}
            onInput={inputHandler}
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
    type: 'text',
    disabled: false,
    value: '',
    onInput: null,
    onFocus: null,
    onBlur: null,
    onChange: null,
    renderValue: null,
};
