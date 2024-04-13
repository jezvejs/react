import classNames from 'classnames';
import PropTypes from 'prop-types';
import { MenuItem } from '../../../../Menu/Menu.jsx';

export const DropDownListItem = (props) => (
    <MenuItem
        {...props}
        className={classNames('dd__list-item', props.className)}
    />
);

DropDownListItem.selector = '.dd__list-item';

DropDownListItem.propTypes = {
    selected: PropTypes.bool,
    active: PropTypes.bool,
    hidden: PropTypes.bool,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    group: PropTypes.string,
    className: PropTypes.string,
};

DropDownListItem.defaultProps = {
    selected: false,
    active: false,
    hidden: false,
    disabled: false,
    multiple: false,
    group: null,
};
