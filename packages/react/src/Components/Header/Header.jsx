import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Header.scss';

/**
 * Header component
 */
export const Header = (props) => (
    <header
        {...props}
        className={classNames('header', props.className)}
    >
        {props.children}
    </header>
);

Header.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
};
