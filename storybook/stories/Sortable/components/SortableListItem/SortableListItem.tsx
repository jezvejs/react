import { SortableItemWrapperProps, SortableListItemComponent } from '@jezvejs/react';
import classNames from 'classnames';
import { forwardRef } from 'react';

import { SortableElementProps } from '../../types.ts';

import './SortableListItem.scss';

export type SortableListItemRef = HTMLDivElement;

export const SortableListItem: SortableListItemComponent = forwardRef<
    SortableListItemRef,
    SortableItemWrapperProps
>((props, ref) => {
    const itemProps: SortableElementProps = {
        className: classNames('sortable-list-item', props.className),
        'data-id': props.id,
        style: props.style,
    };

    if (typeof props.group === 'string') {
        itemProps['data-group'] = props.group;
    }

    return (
        <div {...itemProps} ref={ref} >
            <span>{props.title}</span>
        </div>
    );
});

SortableListItem.displayName = 'SortableListItem';
SortableListItem.selector = '.sortable-list-item';
