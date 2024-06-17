import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './RangeInputField.scss';

export const RangeInputField = (props) => {
    const [state, setState] = useState({
        value: props.value.toString(),
    });

    const onInput = (e) => {
        setState((prev) => ({
            ...prev,
            value: e.target.value,
        }));

        props.onInput?.(e);
    };

    const onChange = (e) => {
        setState((prev) => ({
            ...prev,
            value: e.target.value,
        }));

        props.onChange?.(e);
    };

    return (
        <div
            {...props}
            className={classNames('range-field', props.className)}
        >
            <label htmlFor={props.inputId}>{props.title}</label>
            <div>
                <input
                    id={props.inputId}
                    type="range"
                    min={props.min}
                    max={props.max}
                    value={props.value}
                    onInput={onInput}
                    onChange={onChange}
                />
                <span>{state.value}</span>
            </div>
        </div>
    );
};

RangeInputField.propTypes = {
    className: PropTypes.string,
    inputId: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    title: PropTypes.string,
    onInput: PropTypes.func,
    onChange: PropTypes.func,
};
