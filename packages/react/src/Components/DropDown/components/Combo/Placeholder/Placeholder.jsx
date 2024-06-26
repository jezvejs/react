import classNames from 'classnames';
import PropTypes from 'prop-types';
import './Placeholder.scss';

const defaultProps = {
    placeholder: '',
};

export const DropDownPlaceholder = (p) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const placeholder = props.placeholder ?? '';

    return (
        <span
            {...props}
            className={classNames('dd__placeholder', props.className)}
            title={placeholder}
        >
            {placeholder}
        </span>
    );
};

DropDownPlaceholder.propTypes = {
    className: PropTypes.string,
    placeholder: PropTypes.string,
};
