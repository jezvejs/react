import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Progress.scss';

/**
 * Progress component
 */
export const Progress = (props) => {
    const {
        className,
        value,
        ...rest
    } = props;

    const width = Math.max(0, Math.min(100, value));

    return (
        <div
            className={classNames('progress', className)}
            {...rest}
        >
            <div
                className="progress-bar"
                style={{ width: `${width}%` }}
            />
        </div>
    );
};

Progress.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    value: PropTypes.number,
};

Progress.defaultProps = {
    disabled: false,
    value: 0,
};
