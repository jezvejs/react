import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Checkbox.scss';

const defaultCheckIcon = () => (
    <svg className='checkbox__icon' viewBox='0 0 9.2604 9.2604'>
        <path
            d="M1.08 4.93a.28.28 0 000 .4l2.35 2.34c.1.11.29.11.4 0l4.59-4.59a.28.28 0 000-.4l-.6-.6a.28.28 0 00-.4 0l-3.8 3.8-1.54-1.55a.28.28 0 00-.4 0z"
        />
    </svg>
);

/**
 * Checkbox component
 */
export const Checkbox = (props) => {
    const [state, setState] = useState(props);

    const {
        className,
        checkIcon,
        tooltip = null,
        label = null,
        ...inputProps
    } = state;

    inputProps.title = (tooltip === null && typeof label === 'string')
        ? label
        : (tooltip ?? '');

    const onChange = () => {
        setState((prev) => ({
            ...prev,
            checked: !prev.checked,
        }));
    };

    return (
        <label className={classNames('checkbox', className)}>
            <input
                {...inputProps}
                type='checkbox'
                onChange={onChange}
                checked={state.checked}
            />
            <span className='checkbox__check'>
                {props.checkIcon ?? defaultCheckIcon()}
            </span>
            {props.label && (<span className='checkbox__label'>{props.label}</span>)}
        </label>
    );
};

Checkbox.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string,
    form: PropTypes.string,
    tabIndex: PropTypes.number,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    value: PropTypes.string,
    label: PropTypes.string,
    tooltip: PropTypes.string,
    checkIcon: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
};

Checkbox.defaultProps = {
    checked: false,
    disabled: false,
    value: '',
    label: null,
    tooltip: null,
    onFocus: null,
    onBlur: null,
    onChange: null,
};
