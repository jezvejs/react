import classNames from 'classnames';

import { ColorItem } from '../ColorItem/ColorItem.tsx';
import { Input } from '../Input/Input.tsx';

import { ColorInputProps } from './types.ts';
import './ColorInput.scss';

/**
 * ColorInput component
 */
export const ColorInput = (props: ColorInputProps) => {
    const {
        value = '',
        colorProp = '--color-item-value',
        inputId,
        name,
        form,
        tabIndex,
        disabled = false,
        onInput,
        onChange,
        onFocus,
        onBlur,
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
