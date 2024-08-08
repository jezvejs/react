import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Spinner.scss';

/**
 * Spinner component
 */
export const Spinner = (props) => {
    const {
        className,
        ...rest
    } = props;

    return (
        <div
            className={classNames('spinner', className)}
            {...rest}
        />
    );
};

Spinner.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
};
