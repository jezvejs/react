import PropTypes from 'prop-types';
import './InputGroupOuterContainer.scss';

export const InputGroupOuterContainer = ({ children }) => (
    <div className="input-group__input-outer">
        {children}
    </div>
);

InputGroupOuterContainer.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
};
