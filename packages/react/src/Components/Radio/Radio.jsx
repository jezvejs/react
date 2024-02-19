import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Radio.scss';

/**
 * Radio component
 */
export const Radio = (props) => {
    const [state, setState] = useState(props);

    const {
        className,
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
        <label className={classNames('radio', className)}>
            <input
                {...inputProps}
                type='radio'
                onChange={onChange}
                checked={state.checked}
            />
            <span className='radio__check'></span>
            {props.label && (<span className='radio__label'>{props.label}</span>)}
        </label>
    );
};

Radio.propTypes = {
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
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
};

Radio.defaultProps = {
    checked: false,
    disabled: false,
    value: '',
    label: null,
    tooltip: null,
    onFocus: null,
    onBlur: null,
    onChange: null,
};
