import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Input.scss';

/**
 * Input component
 */
export const Input = (props) => {
    const {
        className,
        ...inputProps
    } = props;

    return (
        <input
            className={classNames('input', className)}
            {...inputProps}
        />
    );
};

Input.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string,
    form: PropTypes.string,
    tabIndex: PropTypes.number,
    inputMode: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    value: PropTypes.string,
    onInput: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
};

Input.defaultProps = {
    placeholder: '',
    type: 'text',
    disabled: false,
    value: '',
    onInput: null,
    onFocus: null,
    onBlur: null,
    onChange: null,
};
