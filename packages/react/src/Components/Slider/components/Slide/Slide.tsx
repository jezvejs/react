import PropTypes from 'prop-types';
import './Slide.scss';

export const Slide = (props) => {
    const { content } = props;

    const slideProps = {
        className: 'slide',
        style: {
            width: props.width,
            height: props.height,
        },
    };

    if (props.id) {
        slideProps['data-id'] = props.id;
    }

    if (props.name) {
        slideProps['data-name'] = props.name;
    }

    return (
        <div {...slideProps} >
            {content}
        </div>
    );
};

Slide.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    content: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
};
