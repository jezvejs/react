import { forwardRef } from 'react';
import PropTypes from 'prop-types';

import './Input.scss';

const autoFeatures = {
    autoComplete: 'off',
    autoCapitalize: 'none',
    spellCheck: false,
    autoCorrect: 'off',
};

const validInputTypes = [
    'email',
    'number',
    'password',
    'search',
    'tel',
    'text',
    'url',
];

const defaultProps = {
    value: '',
    type: 'text',
    placeholder: '',
    tabIndex: 0,
    disabled: false,
    onInput: null,
};

// eslint-disable-next-line react/display-name
export const DropDownInput = forwardRef((p, ref) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const {
        id,
        value,
        type,
        placeholder,
        disabled,
    } = props;

    const onInput = (e) => {
        props?.onInput?.(e);
    };

    const inputProps = {
        ...autoFeatures,
        id,
        value,
        type,
        placeholder,
        disabled,
        tabIndex: (disabled) ? '' : props.tabIndex,
    };

    return (
        <input
            ref={ref}
            className="dd__input"
            {...inputProps}
            onInput={onInput}
        />
    );
});

DropDownInput.propTypes = {
    id: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.oneOf(validInputTypes),
    placeholder: PropTypes.string,
    tabIndex: PropTypes.number,
    disabled: PropTypes.bool,
    onInput: PropTypes.func,
};
