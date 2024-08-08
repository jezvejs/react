import classNames from 'classnames';
import PropTypes from 'prop-types';
import './SingleSelection.scss';

export const DropDownSingleSelection = (props) => {
    const itemTitle = props.item?.title ?? '';

    return (
        <span
            className={classNames('dd__single-selection', props.className)}
            title={itemTitle}
        >
            {itemTitle}
        </span>
    );
};

DropDownSingleSelection.propTypes = {
    className: PropTypes.string,
    item: PropTypes.shape({
        title: PropTypes.string,
    }),
};
