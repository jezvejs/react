import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Tag } from '../../../../Tag/Tag.jsx';

import './MultiSelectionItem.scss';

const defaultProps = {
    active: false,
};

export const DropDownMultiSelectionItem = (p) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    return (
        <Tag
            {...props}
            className={classNames('dd__selection-item', props.className)}
        />
    );
};

DropDownMultiSelectionItem.selector = Tag.selector;
DropDownMultiSelectionItem.buttonClass = Tag.buttonClass;
DropDownMultiSelectionItem.placeholderClass = Tag.placeholderClass;

DropDownMultiSelectionItem.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
};
