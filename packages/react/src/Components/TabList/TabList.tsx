import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { MenuProps, MenuList, MenuHelpers } from '../Menu/Menu.tsx';

import { selectItem } from './helpers.ts';
import './TabList.scss';

const defaultProps = {
    items: [],
    selectedId: null,
};

/**
 * Tabs list component
 */
export const TabList = (p) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const { items } = props;
    let { selectedId } = props;
    if (items.length === 0) {
        selectedId = null;
    } else if (selectedId === null) {
        selectedId = items[0].id.toString();
    }

    const initialState = selectItem({
        ...props,
    }, selectedId);
    const [state, setState] = useState(initialState);

    const onChange = (selected) => {
        setState((prev) => selectItem(prev, selected));
    };

    const tabContentItem = state.items.find((item) => item.id === state.selectedId);

    const menuDefaultProps = MenuProps.getDefaultProps();

    const listProps = {
        ...props,
        className: 'tab-list_header',
        items: MenuHelpers.createItems(state.items, state),
        getItemProps: MenuHelpers.getItemProps,
        onItemClick: onChange,
        components: {
            ...menuDefaultProps.components,
        },
    };

    return (
        <div
            className={classNames('tab-list', props.className)}
        >
            <MenuList {...listProps} />
            <div className='tab-list__content'>{tabContentItem?.content}</div>
        </div>
    );
};

TabList.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    selectedId: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        type: PropTypes.string,
        className: PropTypes.string,
        title: PropTypes.string,
        icon: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.elementType,
        ]),
        content: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.elementType,
        ]),
    })),
};
