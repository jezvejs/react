import PropTypes from 'prop-types';
import classNames from 'classnames';

import { ColorItem } from '../ColorItem/ColorItem.tsx';
import { Input } from '../Input/Input.tsx';

import './ColorInput.scss';

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

ColorInput.propTypes = {
    className: PropTypes.string,
    inputId: PropTypes.string,
    value: PropTypes.string,
    colorProp: PropTypes.string,
    form: PropTypes.string,
    name: PropTypes.string,
    tabIndex: PropTypes.number,
    disabled: PropTypes.bool,
    onInput: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
};
