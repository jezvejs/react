import PropTypes from 'prop-types';
import './LoadingPlaceholder.scss';

export const LoadingPlaceholder = ({
    title = 'Loading...',
}) => (
    <div className='loading-placeholder'>{title}</div>
);

LoadingPlaceholder.propTypes = {
    title: PropTypes.string,
};
