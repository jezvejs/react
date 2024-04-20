import PropTypes from 'prop-types';
import './LoadingPlaceholder.scss';

export const LoadingPlaceholder = (props) => (
    <div className='loading-placeholder'>{props.title}</div>
);

LoadingPlaceholder.propTypes = {
    title: PropTypes.string,
};

LoadingPlaceholder.defaultProps = {
    title: 'Loading...',
};
