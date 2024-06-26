import PropTypes from 'prop-types';
import './SectionControls.scss';

export const SectionControls = (props) => (
    <div className="section-controls">
        {props.children}
    </div>
);

SectionControls.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
};
