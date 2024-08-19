import classNames from 'classnames';

import './Radio.scss';

export interface RadioProps {
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
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void,
    onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

/**
 * Radio component
 */
export const Radio = (props: RadioProps) => {
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
        <label className={classNames('radio', props.className)}>
            <input
                {...inputProps}
                type='radio'
                defaultChecked={checked}
            />
            <span className='radio__check'></span>
            {props.label && (<span className='radio__label'>{props.label}</span>)}
        </label>
    );
};
