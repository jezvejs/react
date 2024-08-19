import { ReactNode } from 'react';
import classNames from 'classnames';

import './Checkbox.scss';

const defaultCheckIcon = () => (
    <svg className='checkbox__icon' viewBox='0 0 9.2604 9.2604'>
        <path
            d="M1.08 4.93a.28.28 0 000 .4l2.35 2.34c.1.11.29.11.4 0l4.59-4.59a.28.28 0 000-.4l-.6-.6a.28.28 0 00-.4 0l-3.8 3.8-1.54-1.55a.28.28 0 00-.4 0z"
        />
    </svg>
);

export interface CheckboxProps {
    id?: string,
    name?: string,
    className?: string,
    form?: string,
    tabIndex?: number,
    checked?: boolean,
    disabled?: boolean,
    value?: string,
    label?: string,
    tooltip?: string,
    checkIcon?: ReactNode,
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void,
    onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

/**
 * Checkbox component
 */
export const Checkbox = (props: CheckboxProps) => {
    const {
        checked = false,
        tooltip = null,
        label = null,
        value = '',
        form,
        name,
        tabIndex,
        disabled = false,
    } = props;

    const title = (tooltip === null && typeof label === 'string')
        ? label
        : (tooltip ?? '');

    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => props.onFocus?.(e);

    const onBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => props.onBlur?.(e);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => props.onChange?.(e);

    const inputProps = {
        form,
        name,
        title,
        value,
        tabIndex,
        disabled,
        onFocus,
        onBlur,
        onChange,
    };

    return (
        <label className={classNames('checkbox', props.className)}>
            <input
                {...inputProps}
                type='checkbox'
                defaultChecked={checked}
            />
            <span className='checkbox__check'>
                {props.checkIcon ?? defaultCheckIcon()}
            </span>
            {props.label && (<span className='checkbox__label'>{props.label}</span>)}
        </label>
    );
};
