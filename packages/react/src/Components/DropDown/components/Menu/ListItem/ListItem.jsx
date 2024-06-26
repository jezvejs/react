import classNames from 'classnames';
import PropTypes from 'prop-types';
import { MenuItem } from '../../../../Menu/Menu.jsx';

const defaultProps = {
    hidden: false,
};

export const DropDownListItem = (p) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    return (
        <MenuItem
            {...props}
            className={classNames('dd__list-item', props.className)}
        />
    );
};

DropDownListItem.selector = MenuItem.selector;

DropDownListItem.propTypes = {
    ...MenuItem.propTypes,
    hidden: PropTypes.bool,
};
