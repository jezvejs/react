import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Tag } from '../../../../Tag/Tag.jsx';

import './MultiSelectionItem.scss';

export const DropDownMultiSelectionItem = (props) => (
    <Tag
        {...props}
        className={classNames('dd__selection-item', props.className)}
    />
);

DropDownMultiSelectionItem.buttonClass = Tag.buttonClass;
DropDownMultiSelectionItem.placeholderClass = Tag.placeholderClass;

DropDownMultiSelectionItem.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
};

DropDownMultiSelectionItem.defaultProps = {
    active: false,
};
