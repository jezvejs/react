import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { MenuCheckbox } from './components/Checkbox/MenuCheckbox.jsx';
import { MenuList } from './components/List/MenuList.jsx';
import { MenuItem } from './components/ListItem/MenuItem.jsx';
import { MenuSeparator } from './components/Separator/MenuSeparator.jsx';

import { forItems, getItemById, isCheckbox, mapItems } from './helpers.js';
import './Menu.scss';

/**
 * Menu component
 */
export const Menu = (props) => {
    const [state, setState] = useState(props);

    const handleItemClick = (itemId, e) => {
        const item = getItemById(itemId, state.items);

        if (isCheckbox(item)) {
            setState({
                ...state,
                items: mapItems(state.items, (item) => ({
                    ...item,
                    selected: (item.id === itemId)
                        ? (!item.selected)
                        : item.selected
                })),
            });
        }

        props.onItemClick?.(item, e);
    };

    const handleScroll = (e) => {
    };

    // Prepare alignment before and after item content
    let beforeContent = false;
    let afterContent = false;

    forItems(state.items, (item) => {
        const checkbox = isCheckbox(item);
        if (!item.icon && !checkbox) {
            return;
        }

        if (
            (checkbox && (state.checkboxSide === 'left' || item.checkboxSide === 'left'))
            || (item.icon && (state.iconAlign === 'left' || item.iconAlign === 'left'))
        ) {
            beforeContent = true;
        } else {
            afterContent = true;
        }
    });

    const { Header, Footer, List } = props.components;
    const menuHeader = Header && <Header {...(state.header ?? {})} />;

    const listProps = {
        ...state,
        beforeContent,
        afterContent,
        onItemClick: handleItemClick,
    };

    listProps.itemSelector = listProps.components.ListItem.selector;

    const menuList = List && <List {...listProps} components={props.components} />;
    const menuFooter = Footer && <Footer {...(state.footer ?? {})} />;

    return (
        <div
            id={props.id}
            className={classNames('menu', props.className)}
            onScroll={handleScroll}
        >
            {menuHeader}
            {menuList}
            {menuFooter}
        </div>
    );
};

Menu.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    iconAlign: PropTypes.oneOf(['left', 'right']),
    checkboxSide: PropTypes.oneOf(['left', 'right']),
    header: PropTypes.object,
    footer: PropTypes.object,
    onItemClick: PropTypes.func,
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
    components: PropTypes.shape({
        Header: PropTypes.func,
        List: PropTypes.func,
        ListItem: PropTypes.func,
        Check: PropTypes.func,
        Separator: PropTypes.func,
        Footer: PropTypes.func,
    }),
};

Menu.defaultProps = {
    iconAlign: 'left',
    checkboxSide: 'left',
    header: null,
    footer: null,
    onItemClick: null,
    items: [],
    components: {
        Header: null,
        List: MenuList,
        ListItem: MenuItem,
        Check: MenuCheckbox,
        Separator: MenuSeparator,
        Footer: null,
    },
};
