import classNames from 'classnames';
import PropTypes from 'prop-types';
import './MenuGroupHeader.scss';

export const MenuGroupHeader = (props) => (
    <div
        className={classNames('menu-group__header', props.className)}
    >
        {props.title}
    </div>
);

MenuGroupHeader.propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
};

MenuGroupHeader.selector = '.menu-group__header';
