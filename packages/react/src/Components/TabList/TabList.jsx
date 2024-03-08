import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Menu, MenuList } from '../Menu/Menu.jsx';

import { selectItem } from './helpers.js';
import './TabList.scss';

/**
 * Tabs list component
 */
export const TabList = (props) => {
    const { items } = props;
    let { selectedId } = props;
    if (items.length === 0) {
        selectedId = null;
    } else if (selectedId === null) {
        selectedId = items[0].id.toString();
    }

    const initialState = selectItem({
        ...TabList.defaultProps,
        ...props,
    }, selectedId);
    const [state, setState] = useState(initialState);

    const onChange = (selected) => {
        setState((prev) => selectItem(prev, selected));
    };

    const tabContentItem = state.items.find((item) => item.id === state.selectedId);

    return (
        <div
            className={classNames('tab-list', props.className)}
        >
            <MenuList
                className='tab-list_header'
                items={state.items}
                onItemClick={onChange}
                components={{
                    ...Menu.defaultProps.components,
                }}
            />
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

TabList.defaultProps = {
    items: [],
    selectedId: null,
};
