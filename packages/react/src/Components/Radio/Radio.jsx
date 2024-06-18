import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Radio.scss';

/**
 * Radio component
 */
export const Radio = (props) => {
    const {
        checked = false,
        tooltip = null,
        label = null,
        value = '',
        form,
        name,
        tabIndex,
        disabled = false,
        onFocus = null,
        onBlur = null,
        onChange = null,
    } = props;

    const inputProps = {
        form,
        name,
        value,
        tabIndex,
        disabled,
        onFocus,
        onBlur,
        onChange,
    };

    inputProps.title = (tooltip === null && typeof label === 'string')
        ? label
        : (tooltip ?? '');

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

Radio.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string,
    form: PropTypes.string,
    tabIndex: PropTypes.number,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    value: PropTypes.string,
    label: PropTypes.string,
    tooltip: PropTypes.string,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
};
