import { useState } from 'react';
import classNames from 'classnames';

import './Switch.scss';

export interface SwitchProps {
    id: string,
    name: string,
    className: string,
    form: string,
    tabIndex: number,
    checked: boolean,
    disabled: boolean,
    value: string,
    label: string,
    tooltip: string,
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => void,
    onBlur: (e: React.FocusEvent<HTMLInputElement, Element>) => void,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

/**
 * Switch component
 */
export const Switch = (props: SwitchProps) => {
    const [state, setState] = useState({
        animated: false,
    });

    const { animated } = state;

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

    const onTouchStart = (event: React.TouchEvent<HTMLLabelElement>) => {
        if (event?.touches) {
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
                props.className,
            )}
            onTouchStart={onTouchStart}
            onTransitionEndCapture={onTransitionEnd}
        >
            <input
                {...inputProps}
                type='checkbox'
                defaultChecked={checked}
            />
            <div className='switch-slider'></div>
            {props.label && (<span className='switch__label'>{props.label}</span>)}
        </label>
    );
};
