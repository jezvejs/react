import { ComponentType } from 'react';
import classNames from 'classnames';

import { Tag, TagProps } from '../Tag/Tag.tsx';

import { removeItemsById } from './helpers.ts';
import './Tags.scss';

export const TagsHelpers = {
    removeItemsById,
};

export type ClickEventType = React.MouseEvent<Element, MouseEvent>;

export interface TagsProps<T extends TagProps = TagProps> {
    className?: string;

    itemSelector?: string | null;
    sortModeClass?: string;
    buttonClass?: string;

    activeItemId?: string | null;
    closeable?: boolean;
    disabled?: boolean;
    listMode?: string;

    items: T[];
    ItemComponent: ComponentType<T>;

    onItemClick?: (itemId: string, e: ClickEventType) => void;

    onCloseItem?: (itemId: string, e: ClickEventType) => void;
}

const defaultProps = {
    ItemComponent: Tag,
    activeItemId: null,
    closeable: false,
    disabled: false,
    listMode: 'list',
    itemSelector: Tag.selector,
    sortModeClass: 'tags_sort',
    buttonClass: Tag.buttonClass,
};

/**
 * Tags list components
 */
export function Tags<T extends TagProps = TagProps>(p: TagsProps<T>) {
    const props = {
        ...defaultProps,
        ...p,
    };

    const {
        disabled,
        ItemComponent,
    } = props;

    const selector = props?.itemSelector; // ?? ItemComponent?.selector

    const getClosestItemElement = (elem: HTMLElement): HTMLElement | null => (
        ((selector) ? (elem?.closest?.(selector) as HTMLElement) : null) ?? null
    );

    const getItemProps = (item: T, state: TagsProps<T>) => ({
        ...item,
        disabled: item.disabled || state.disabled,
        listMode: state.listMode,
        active: item.id === state.activeItemId,
        closeable: (
            ('closeable' in item && item.closeable)
            || (!('closeable' in item) && state.closeable)
        ),
    });

    /**
     * Item click event handler
     * @param {Event} e - click event object
     */
    const onItemClick = (e: React.MouseEvent) => {
        e?.stopPropagation();

        const target = e?.target as HTMLElement;
        const closestElem = getClosestItemElement(target) as HTMLElement;
        const itemId = closestElem?.dataset?.id ?? null;
        if (itemId === null) {
            return;
        }

        const { buttonClass } = props; // ItemComponent.buttonClass
        if (props.closeable && buttonClass) {
            if (target?.closest?.(`.${buttonClass}`)) {
                e.stopPropagation();

                props.onCloseItem?.(itemId, e);

                return;
            }
        }

        props.onItemClick?.(itemId, e);
    };

    const containerProps = {
        className: classNames(
            'tags',
            { tags_disabled: !!disabled },
            props.className,
        ),
        onClick: onItemClick,
    };

    return (
        <div {...containerProps}>
            {props.items.map((item) => (
                <ItemComponent
                    {...getItemProps(item, props)}
                    key={`tag_${item.id}`}
                />
            ))}
        </div>
    );
}
