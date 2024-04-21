import classNames from 'classnames';
import PropTypes from 'prop-types';

export const CustomSelectionItem = (props) => (
    <span
        className={classNames(
            'dd__selection-item dd__custom-selection-item tag',
            { 'dd__selection-item_active': props.active },
        )}
    >
        <span className='dd__del-selection-item-btn close-btn'></span>
        <span>{props.title.toLowerCase()}</span>
    </span>
);

CustomSelectionItem.selector = '.dd__selection-item';
CustomSelectionItem.buttonClass = 'dd__del-selection-item-btn';

CustomSelectionItem.propTypes = {
    active: PropTypes.bool,
    title: PropTypes.string,
};

CustomSelectionItem.defaultProps = {
    active: false,
    title: null,
};
