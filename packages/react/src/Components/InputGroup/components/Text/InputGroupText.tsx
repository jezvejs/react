import PropTypes from 'prop-types';
import './InputGroupText.scss';

export const InputGroupText = ({ title }) => (
    <div className="input-group__text">{title}</div>
);

InputGroupText.propTypes = {
    title: PropTypes.string,
};
