import PropTypes from 'prop-types';
import { MenuList } from '../../../../Menu/Menu.jsx';

/**
 * Drop Down Menu list component
 */
export const DropDownMenuList = (props) => (
    <MenuList {...props} />
);

DropDownMenuList.propTypes = {
    selected: PropTypes.string,
    active: PropTypes.bool,
    hidden: PropTypes.bool,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    group: PropTypes.string,
    className: PropTypes.string,
};

DropDownMenuList.defaultProps = {
    items: [],
    multiple: false,
    filtered: false,
    inputString: false,
    components: {
        ListItem: null,
        Checkbox: null,
        ListPlaceholder: null,
        GroupItem: null,
    },
};
