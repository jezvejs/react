import classNames from 'classnames';
import PropTypes from 'prop-types';
import './Placeholder.scss';

export const DropDownPlaceholder = (props) => {
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

DropDownPlaceholder.defaultProps = {
    placeholder: '',
};
