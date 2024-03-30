import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Switch.scss';

/**
 * Switch component
 */
export const Switch = (props) => {
    const [state, setState] = useState({
        ...props,
        animated: false,
    });

    const {
        className,
        animated,
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

    const onTouchStart = (e) => {
        if (e?.touches) {
            setState((prev) => ({
                ...prev,
                animated: true,
            }));
        }
    };

    const onTransitionEnd = () => {
        setState((prev) => ({
            ...prev,
            animated: false,
        }));
    };

    return (
        <label
            className={classNames(
                'switch',
                { animated },
                className,
            )}
            onTouchStart={onTouchStart}
            onTransitionEndCapture={onTransitionEnd}
        >
            <input
                {...inputProps}
                type='checkbox'
                onChange={onChange}
                checked={state.checked}
            />
            <div className='switch-slider'></div>
            {props.label && (<span className='switch__label'>{props.label}</span>)}
        </label>
    );
};

Switch.propTypes = {
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

Switch.defaultProps = {
    checked: false,
    disabled: false,
    value: '',
    label: null,
    tooltip: null,
    onFocus: null,
    onBlur: null,
    onChange: null,
};
