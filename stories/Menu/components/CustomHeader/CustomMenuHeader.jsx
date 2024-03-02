import PropTypes from 'prop-types';
import './CustomMenuHeader.scss';

export const CustomMenuHeader = (props) => (
    <div className='custom-header'>{props.title}</div>
);

CustomMenuHeader.propTypes = {
    title: PropTypes.string,
};
