import PropTypes from 'prop-types';
import './CustomMenuFooter.scss';

export const CustomMenuFooter = (props) => (
    <div className='custom-footer'>{props.title}</div>
);

CustomMenuFooter.propTypes = {
    title: PropTypes.string,
};
