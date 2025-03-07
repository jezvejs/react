import classNames from 'classnames';
import { ReactNode, useCallback, useMemo } from 'react';

import { MenuHelpers } from '../../MenuContainer.tsx';

import { getItemIdByElem } from '../../helpers.ts';
import {
    MenuGroupHeaderProps,
    MenuGroupItemProps,
    MenuItemContentAlign,
    MenuItemProps,
    MenuListComponent,
    MenuListProps,
} from '../../types.ts';

import './MenuList.scss';

const defaultProps = {
    items: [],
    activeItem: null,
    beforeContent: false,
    afterContent: false,
    checkboxSide: 'left' as MenuItemContentAlign,
};

/**
 * MenuList component
 */
export const MenuList: MenuListComponent = (p: MenuListProps) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const { components } = props;
    const { ListPlaceholder } = components ?? {};

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

    const renderItem = (itemData: MenuItemProps): ReactNode => {
        const {
            ListItem,
            Separator,
            GroupItem,
        } = props.components ?? {};
        const st = props;

        const item = {
            ...(props.getItemProps?.(itemData, st as MenuListProps) ?? itemData),
            active: !!st.activeItem && itemData.id === st.activeItem,
            components: {
                ...(props.components ?? {}),
            },
        };

        const CustomItem = props.getItemComponent?.(item, props);
        if (CustomItem) {
            return CustomItem && <CustomItem {...item} key={item.id} />;
        }

        if (item.type === 'separator') {
            return !!Separator && <Separator {...item} key={item.id} />;
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
                activeItem: st.activeItem,
                list,
                header,
                getItemProps: props.getItemProps,
                tabThrough: props.tabThrough,
                renderNotSelected: props.renderNotSelected,
            };

            return GroupItem && <GroupItem {...groupProps} key={item.id} />;
        }

        return ListItem && <ListItem {...item} key={item.id} />;
    };

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

    const visibleItems = useMemo(() => (
        MenuHelpers.filterItems(props.items, (item) => !!item && !item.hidden)
    ), [props.items]);

    const placeholderProps = useMemo(() => (
        (visibleItems.length === 0)
            ? getPlaceholderProps(props)
            : {}
    ), [visibleItems, props.placeholder, props.getPlaceholderProps]);

    const listContent = useMemo(() => (
        (visibleItems.length > 0)
            ? visibleItems.map((item) => renderItem(item))
            : (ListPlaceholder && <ListPlaceholder {...placeholderProps} />)
    ), [visibleItems, props.activeItem, placeholderProps]);

    return (
        <div {...containerProps}>
            {listContent}
        </div>
    );
};
