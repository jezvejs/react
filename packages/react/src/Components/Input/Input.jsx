import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Input.scss';

/**
 * Input component
 */
// eslint-disable-next-line react/display-name
export const Input = forwardRef((props, ref) => {
    const onChange = (e) => props.onChange?.(e);

    return (
        <input
            {...props}
            className={classNames('input', props.className)}
            onChange={onChange}
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
    type: 'text',
    disabled: false,
    value: '',
    onInput: null,
    onFocus: null,
    onBlur: null,
    onChange: null,
};
