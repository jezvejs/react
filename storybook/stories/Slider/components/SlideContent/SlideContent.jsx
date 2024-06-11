import PropTypes from 'prop-types';
import './SlideContent.scss';

export const SlideContent = (props) => (
    <div className="slide-content">{props.children}</div>
);

SlideContent.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
};
