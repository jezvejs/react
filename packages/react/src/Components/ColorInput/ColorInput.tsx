import classNames from 'classnames';

import { ColorItem } from '../ColorItem/ColorItem.tsx';
import { Input } from '../Input/Input.tsx';

import './ColorInput.scss';

export interface ColorInputProps {
    className: string,
    inputId: string,
    value: string,
    colorProp: string,
    form: string,
    name: string,
    tabIndex: number,
    disabled: boolean,
    onInput: () => void,
    onChange: () => void,
    onFocus: () => void,
    onBlur: () => void,
}

/**
 * ColorInput component
 */
export const ColorInput = (props) => {
    const {
        value = '',
        colorProp = '--color-item-value',
        inputId,
        name,
        form,
        tabIndex,
        disabled = false,
        onInput = null,
        onChange = null,
        onFocus = null,
        onBlur = null,
    } = props;

    const containerProps = {
        className: classNames('color-input', props.className),
    };

    const inputProps = {
        id: inputId,
        className: 'color-input__input',
        type: 'color',
        name,
        form,
        tabIndex,
        disabled,
        onInput,
        onChange,
        onFocus,
        onBlur,
        style: {
            [colorProp]: value,
        },
    };

    const valueProps = {
        className: 'color-input__value',
        value,
        colorProp,
    };

    return (
        <div {...containerProps}>
            <Input {...inputProps} />
            <ColorItem {...valueProps} />
        </div>
    );
};
