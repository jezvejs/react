import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Progress.scss';

const defaultProps = {
    disabled: false,
    value: 0,
};

/**
 * Progress component
 */
export const Progress = (p) => {
    const props = {
        ...defaultProps,
        ...p,
    };

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
