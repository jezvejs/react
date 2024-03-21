import PropTypes from 'prop-types';
import './MenuGroupHeader.scss';

export const MenuGroupHeader = (props) => (
    <div className='menu-group__header'>{props.title}</div>
);

MenuGroupHeader.propTypes = {
    title: PropTypes.string,
};
