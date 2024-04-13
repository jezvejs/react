import PropTypes from 'prop-types';
import classNames from 'classnames';
import { forwardRef } from 'react';

import { Menu } from '../../../../Menu/Menu.jsx';

import { componentPropType } from '../../../helpers.js';
import './Menu.scss';

/**
 * DropDown Menu container component
 */
// eslint-disable-next-line react/display-name
export const DropDownMenu = forwardRef((props, ref) => {
    const items = props.items.map((item) => ({
        ...item,
        multiple: props.multiple,
        filtered: props.filtered,
        hidden: item.hidden || (props.filtered && !item.matchFilter),
    }));

    return (
        <Menu
            {...props}
            ref={ref}
            className={classNames('dd__list', props.className)}
            items={items}
            data-parent={props.parentId}
        />
    );
});

DropDownMenu.propTypes = {
    parentId: PropTypes.string,
    showInput: PropTypes.bool,
    getItemById: PropTypes.func,
    onItemActivate: PropTypes.func,
    onItemClick: PropTypes.func,
    onPlaceholderClick: PropTypes.func,
    multiple: PropTypes.bool,
    filtered: PropTypes.bool,
    getPlaceholderProps: PropTypes.func,
    className: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        type: PropTypes.string,
        className: PropTypes.string,
        title: PropTypes.string,
        icon: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.elementType,
        ]),
    })),
    header: PropTypes.shape({
        inputString: PropTypes.string,
        inputPlaceholder: PropTypes.string,
        useSingleSelectionAsPlaceholder: PropTypes.bool,
        onInput: PropTypes.func,
    }),
    components: PropTypes.shape({
        Header: componentPropType,
        Input: componentPropType,
        MenuList: componentPropType,
        ListItem: componentPropType,
        Check: componentPropType,
        Checkbox: componentPropType,
        ListPlaceholder: componentPropType,
        GroupItem: componentPropType,
    }),
};

DropDownMenu.defaultProps = {
    parentId: null,
    items: [],
    showInput: false,
    getItemById: null,
    onItemActivate: null,
    onItemClick: null,
    onPlaceholderClick: null,
    multiple: false,
    filtered: false,
    getPlaceholderProps: null,
    header: {
        inputElem: null,
        inputString: '',
        inputPlaceholder: '',
        useSingleSelectionAsPlaceholder: false,
        onInput: null,
    },
    components: {
        Header: null,
        Input: null,
        MenuList: null,
        ListItem: null,
        Check: null,
        Checkbox: null,
        ListPlaceholder: null,
        GroupItem: null,
    },
};
