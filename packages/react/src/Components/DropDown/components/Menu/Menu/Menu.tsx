import PropTypes from 'prop-types';
import classNames from 'classnames';
import { forwardRef } from 'react';

import { Menu, MenuHelpers } from '../../../../Menu/Menu.tsx';

import { componentPropType } from '../../../helpers.ts';
import './Menu.scss';

const defaultProps = {
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

/**
 * DropDown Menu container component
 */
// eslint-disable-next-line react/display-name
export const DropDownMenu = forwardRef((p, ref) => {
    const props = {
        ...defaultProps,
        ...p,
        header: {
            ...defaultProps.header,
            ...(p?.header ?? {}),
        },
        components: {
            ...defaultProps.components,
            ...(p?.components ?? {}),
        },
    };

    const { multiple, filtered } = props;
    const defaultItemType = (multiple) ? 'checkbox' : 'button';

    const items = props.items.map((item) => ({
        ...item,
        type: (item.type !== 'group') ? defaultItemType : item.type,
        multiple,
        filtered,
        hidden: item.hidden || (filtered && !item.matchFilter),
    }));

    const filteredItems = (props.visible)
        ? MenuHelpers.filterItems(items, (item) => (
            !item.hidden && (!filtered || item.matchFilter)
        ))
        : [];

    return (
        <Menu
            {...props}
            ref={ref}
            defaultItemType={defaultItemType}
            tabThrough={false}
            tabIndex={null}
            className={classNames('dd__list', props.className)}
            items={filteredItems}
            data-parent={props.parentId}
        />
    );
});

DropDownMenu.propTypes = {
    ...Menu.propTypes,
    parentId: PropTypes.string,
    visible: PropTypes.bool,
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
