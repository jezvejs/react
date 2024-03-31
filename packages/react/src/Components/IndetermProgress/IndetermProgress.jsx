import PropTypes from 'prop-types';
import classNames from 'classnames';

import './IndetermProgress.scss';

/**
 * IndetermProgress component
 */
export const IndetermProgress = (props) => {
    const {
        circlesCount,
        run,
        className,
        ...rest
    } = props;

    const generateId = () => (
        Math.round(Date.now() * Math.random() * 100000).toString(30)
    );

    const circles = Array(circlesCount).fill('indtp').map((item) => (
        `${item}${generateId()}`
    ));

    return (
        <div
            className={classNames('indeterm-progress', { run }, className)}
            {...rest}
        >
            {circles.map((id) => (
                <div key={id} className="indeterm-progress__circle" />
            ))}
        </div>
    );
};

IndetermProgress.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    run: PropTypes.bool,
    circlesCount: PropTypes.number,
};

IndetermProgress.defaultProps = {
    run: true,
    circlesCount: 5,
};
