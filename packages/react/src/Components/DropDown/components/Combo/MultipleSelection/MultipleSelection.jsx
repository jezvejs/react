import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Tags } from '../../../../Tags/Tags.jsx';
import { DropDownMultiSelectionItem } from '../MultiSelectionItem/MultiSelectionItem.jsx';

import './MultipleSelection.scss';

export const DropDownMultipleSelection = (props) => (
    <Tags
        {...props}
        className={classNames('dd__selection', props.className)}
        removeItemOnClose={false}
    />
);

DropDownMultipleSelection.propTypes = {
    ItemComponent: PropTypes.func,
    className: PropTypes.string,
};

DropDownMultipleSelection.defaultProps = {
    ItemComponent: DropDownMultiSelectionItem,
};
