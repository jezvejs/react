import classNames from 'classnames';
import { useMemo } from 'react';

import { getClosestItemElement, getItemSelector } from '../../helpers.ts';
import {
    MenuGroupHeaderProps,
    MenuGroupItemProps,
    MenuItemProps,
    MenuListProps,
} from '../../types.ts';

import './MenuList.scss';

const defaultProps = {
    items: [],
    activeItem: null,
    beforeContent: false,
    afterContent: false,
};

/**
 * MenuList component
 */
export const MenuList = (p: MenuListProps) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const { components } = props;
    const { ListPlaceholder } = components;

    const getItemIdByElem = (elem: HTMLElement | null): string | null => {
        const selector = getItemSelector(props);
        const closestElem = getClosestItemElement(elem, selector) as HTMLElement;
        return closestElem?.dataset?.id ?? null;
    };

    /**
     * 'click' event handler
     * @param {React.MouseEvent} e
     */
    const onClick = (e: React.MouseEvent) => {
        e?.stopPropagation();

        const itemId = getItemIdByElem(e?.target as HTMLElement);
        if (itemId === null) {
            return;
        }

        props.onItemClick?.(itemId, e);
    };

    /**
     * 'mouseenter' and 'mouseover' events handler
     * @param {React.MouseEvent} e
     */
    const onMouseEnter = (e: React.MouseEvent) => {
        const itemId = getItemIdByElem(e?.target as HTMLElement);
        props.onMouseEnter?.(itemId, e);
    };

    /**
     * 'mouseleave' and 'mouseout' events handler
     * @param {React.MouseEvent} e
     */
    const onMouseLeave = (e: React.MouseEvent) => {
        const itemId = getItemIdByElem(e?.relatedTarget as HTMLElement);
        props.onMouseLeave?.(itemId, e);
    };

    const ItemComponent = (item: MenuItemProps) => {
        const {
            ListItem,
            Separator,
            GroupItem,
        } = props.components;

        if (item.type === 'separator') {
            return Separator && <Separator {...item} />;
        }

        if (item.type === 'group') {
            const list: MenuListProps = {
                ...props,
                items: (item.items ?? []),
            };
            const header: MenuGroupHeaderProps = {
                title: item.title,
            };

            const groupProps: MenuGroupItemProps = {
                ...item,
                items: (item.items ?? []),
                list,
                header,
                getItemProps: props.getItemProps,
                components: props.components,
            };

            return GroupItem && <GroupItem {...groupProps} />;
        }

        return ListItem && <ListItem {...item} />;
    };

    const itemProps = (item: MenuItemProps, state: MenuListProps) => (
        state.getItemProps?.(item, state) ?? item
    );

    const getPlaceholderProps = (state: MenuListProps) => (
        state.getPlaceholderProps?.(state) ?? state.placeholder ?? {}
    );

    const containerProps = useMemo(() => ({
        className: classNames(
            'menu-list',
            {
                'menu-list_left': props.beforeContent,
                'menu-list_right': props.afterContent,
            },
            props.className,
        ),
        onClick,
        onMouseEnter,
        onMouseLeave,
        onMouseOver: onMouseEnter,
        onMouseOut: onMouseLeave,
    }), [props.beforeContent, props.afterContent, props.className]);

    const placeholderProps = useMemo(() => (
        (props.items.length === 0)
            ? getPlaceholderProps(props)
            : {}
    ), [props.items, props.placeholder, props.getPlaceholderProps]);

    const listContent = useMemo(() => (
        (props.items.length > 0)
            ? props.items.map((item) => (
                <ItemComponent
                    {...itemProps(item, props)}
                    key={item.id}
                />
            ))
            : (ListPlaceholder && <ListPlaceholder {...placeholderProps} />)
    ), [props.items]);

    return (
        <div {...containerProps}>
            {listContent}
        </div>
    );
};
