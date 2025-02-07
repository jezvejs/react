import { useState } from 'react';
import classNames from 'classnames';
import './RangeInputField.scss';

export interface RangeInputFieldProps extends React.HTMLAttributes<HTMLDivElement> {
    inputId?: string;
    min: number;
    max: number;
    value: string | number;
    title: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const RangeInputField: React.FC<RangeInputFieldProps> = (props) => {
    const [state, setState] = useState({
        value: props.value.toString(),
    });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState((prev) => ({
            ...prev,
            value: e.target?.value,
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
                    defaultValue={props.value}
                    onChange={onChange}
                />
                <span>{state.value}</span>
            </div>
        </div>
    );
};
