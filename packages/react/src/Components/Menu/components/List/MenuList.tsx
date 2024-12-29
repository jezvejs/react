import classNames from 'classnames';
import { ReactNode, useCallback, useMemo } from 'react';

import { useMenuStore } from '../../hooks/useMenuStore.ts';
import { getItemIdByElem } from '../../helpers.ts';
import {
    MenuGroupHeaderProps,
    MenuGroupItemProps,
    MenuItemProps,
    MenuListProps,
    MenuProps,
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
    const { getState } = useMenuStore(props as MenuProps);

    /**
     * 'click' event handler
     * @param {React.MouseEvent} e
     */
    const onClick = useCallback((e: React.MouseEvent) => {
        e?.stopPropagation();

        const itemId = getItemIdByElem(e?.target as HTMLElement, props);
        if (itemId === null) {
            return;
        }

        props.onItemClick?.(itemId, e);
    }, []);

    /**
     * 'mouseenter' and 'mouseover' events handler
     * @param {React.MouseEvent} e
     */
    const onMouseEnter = useCallback((e: React.MouseEvent) => {
        const itemId = getItemIdByElem(e?.target as HTMLElement, props);
        props.onMouseEnter?.(itemId, e);
    }, []);

    /**
     * 'mouseleave' and 'mouseout' events handler
     * @param {React.MouseEvent} e
     */
    const onMouseLeave = useCallback((e: React.MouseEvent) => {
        const itemId = getItemIdByElem(e?.relatedTarget as HTMLElement, props);
        props.onMouseLeave?.(itemId, e);
    }, []);

    const itemProps = (item: MenuItemProps, state: MenuListProps) => (
        state.getItemProps?.(item, state) ?? item
    );

    const ItemComponent = useCallback((item: MenuItemProps): ReactNode => {
        const {
            ListItem,
            Separator,
            GroupItem,
        } = props.components;
        const st = getState();

        const CustomItem = st.getItemComponent?.(item, props);
        if (CustomItem) {
            return CustomItem && <CustomItem {...item} />;
        }

        if (item.type === 'separator') {
            return Separator && <Separator {...item} />;
        }

        if (item.type === 'group') {
            const list: MenuListProps = {
                ...props,
                items: (item.items ?? []),
                activeItem: st.activeItem,
            };
            const header: MenuGroupHeaderProps = {
                ...item,
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
    }, []);

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
    ), [props.items, props.activeItem, placeholderProps]);

    return (
        <div {...containerProps}>
            {listContent}
        </div>
    );
};
