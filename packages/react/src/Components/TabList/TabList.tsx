import { useState } from 'react';
import classNames from 'classnames';

import { MenuDefProps, MenuList, MenuHelpers } from '../Menu/Menu.tsx';
import { MenuListProps, MenuState } from '../Menu/types.ts';

import { TabListItemProps, TabListProps } from './types.ts';
import * as TabListHelpers from './helpers.ts';
import './TabList.scss';

const defaultProps = {
    items: [],
    selectedId: null,
};

const { generateId, selectItem } = TabListHelpers;

export {
    TabListHelpers,
};

export * from './types.ts';

/**
 * Tabs list component
 */
export const TabList = (p: TabListProps) => {
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

    const onChange = (selected: string | null) => {
        setState((prev) => selectItem(prev, selected));
    };

    const tabContentItem = state.items?.find?.((item: TabListItemProps) => (
        item.id === state.selectedId
    ));

    const menuDefaultProps = MenuDefProps.getDefaultProps();

    const listProps: MenuListProps = {
        ...props,
        id: props.id ?? `tabs${generateId()}`,
        className: 'tab-list_header',
        items: MenuHelpers.createItems(state.items ?? [], (state as object) as MenuState),
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
