import classNames from 'classnames';
import { useMemo } from 'react';

import {
    MenuGroupHeaderProps,
    MenuGroupItemComponent,
    MenuGroupItemProps,
    MenuListProps,
} from '../../types.ts';

import './MenuGroupItem.scss';

const defaultProps = {
    items: [],
    components: {},
};

export const MenuGroupItem: MenuGroupItemComponent = (p: MenuGroupItemProps) => {
    const props = {
        ...defaultProps,
        ...p,
        components: {
            ...defaultProps.components,
            ...(p?.components ?? {}),
        },
    };

    const { GroupHeader, List } = props.components;
    if (!GroupHeader) {
        throw new Error('Invalid group header component');
    }
    if (!List) {
        throw new Error('Invalid menu list component');
    }

    const { id, className } = props;

    const containerProps = {
        className: classNames(
            'menu-item menu-group',
            className,
        ),
        'data-id': id,
    };

    const headerProps: MenuGroupHeaderProps = useMemo(() => ({
        ...props.header,
    }), [props.header]);

    const listProps: MenuListProps = useMemo(() => ({
        ...props.list,
        id,
        items: props.items.map((item) => ({
            ...item,
            active: !!props.activeItem && item.id === props.activeItem,
            disabled: props.disabled || item.disabled,
            checkboxSide: props.checkboxSide || item.checkboxSide,
            tabThrough: props.tabThrough || item.tabThrough,
            renderNotSelected: props.renderNotSelected || item.renderNotSelected,
        })),
        components: {
            ...(props.components ?? {}),
        },
    }), [
        props.list,
        props.items,
        props.activeItem,
        props.disabled,
        props.checkboxSide,
        props.tabThrough,
        props.renderNotSelected,
        props.components,
    ]);

    return (
        <div {...containerProps}>
            <GroupHeader {...headerProps} />
            <List {...listProps} />
        </div>
    );
};

MenuGroupItem.selector = '.menu-item.menu-group';
