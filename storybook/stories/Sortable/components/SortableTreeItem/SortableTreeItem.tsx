import { forwardRef } from 'react';
import classNames from 'classnames';
import {
    px,
    SortableItemWrapperProps,
    SortableListItemComponent,
    StyledHTMLAttributes,
} from '@jezvejs/react';

import { SortableElementProps } from 'common/Components/SortableListItem/SortableListItem.tsx';

import './SortableTreeItem.scss';

export type SortableTreeItemRef = HTMLDivElement | null;

export type SortableTreeItemProps = SortableItemWrapperProps;

export const SortableTreeItem: SortableListItemComponent = forwardRef<
    SortableTreeItemRef,
    SortableTreeItemProps
>((props, ref) => {
    const commonProps = {
        group: props.group,
        zoneId: props.zoneId,
        animated: props.animated,
        placeholderClass: props.placeholderClass,
        animatedClass: props.animatedClass,
        transitionTimeout: props.transitionTimeout,
        components: props.components,
    };

    const itemProps: SortableElementProps = {
        className: classNames('tree-item', props.className),
        'data-id': props.id,
        style: props.style,
    };

    if (typeof props.group === 'string') {
        itemProps['data-group'] = props.group;
    }

    const { ItemWrapper } = props.components ?? {};

    const renderItem = (item: SortableItemWrapperProps) => (
        (props.renderItem)
            ? props.renderItem(item)
            : (
                !!ItemWrapper && <ItemWrapper
                    {...({
                        ...commonProps,
                        ...item,
                        components: {
                            ...(props.components ?? {}),
                            ...(item.components ?? {}),
                            ListItem: SortableTreeItem,
                        },
                    })}
                    renderItem={renderItem}
                    key={`srtlist_${props.id}_${item.id}`}
                />
            )
    );

    const childContentProps: StyledHTMLAttributes = {
        style: {},
    };

    if (props.childContainer) {
        const { width, height } = props.childContainer;
        const { style } = childContentProps;
        if (!!width && width > 0) {
            style.width = px(width);
        }
        if (!!height && height > 0) {
            style.height = px(height);
        }
    }

    return (
        <div {...itemProps} ref={ref} >
            <span className="tree-item__title">{props.title}</span>
            <div className="tree-item__content" {...childContentProps}>
                {props.items?.map((item) => (
                    renderItem(item)
                ))}
            </div>
        </div>
    );
});

SortableTreeItem.displayName = 'SortableTreeItem';
SortableTreeItem.selector = '.tree-item';
