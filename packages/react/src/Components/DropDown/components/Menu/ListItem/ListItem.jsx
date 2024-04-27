import classNames from 'classnames';
import PropTypes from 'prop-types';
import { MenuItem } from '../../../../Menu/Menu.jsx';

export const DropDownListItem = (props) => (
    <MenuItem
        {...props}
        className={classNames('dd__list-item', props.className)}
    />
);

DropDownListItem.selector = MenuItem.selector;

DropDownListItem.propTypes = {
    ...MenuItem.propTypes,
    hidden: PropTypes.bool,
};

DropDownListItem.defaultProps = {
    ...MenuItem.defaultProps,
    hidden: false,
};
