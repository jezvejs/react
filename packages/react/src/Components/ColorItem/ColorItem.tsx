import PropTypes from 'prop-types';
import classNames from 'classnames';
import './ColorItem.scss';

/**
 * ColorItem component
 */
export const ColorItem = (props) => {
    const {
        value = '',
        colorProp = '--color-item-value',
    } = props;

    const colorItemProps = {
        className: classNames('color-item', props.className),
        style: {
            [colorProp]: value,
        },
    };

    return (
        <div {...colorItemProps} />
    );
};

ColorItem.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    colorProp: PropTypes.string,
};
