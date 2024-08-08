import PropTypes from 'prop-types';
import classNames from 'classnames';

import './MenuSeparator.scss';

/**
 * MenuSeparator component
 */
export const MenuSeparator = (props) => {
    const { id, className } = props;

    return <div id={id} className={classNames('menu-separator', className)}></div>;
};

MenuSeparator.propTypes = {
    id: PropTypes.string,
    type: PropTypes.string,
    className: PropTypes.string,
};
