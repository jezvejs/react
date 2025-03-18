import { SortableItemWrapperProps } from '@jezvejs/react';
import classNames from 'classnames';
import { forwardRef } from 'react';

import { SortableElementProps } from '../../../../common/Components/SortableListItem/SortableListItem.tsx';

import { WithSelector } from '../../types.ts';

export type ListItemWithHandleRef = HTMLDivElement | null;

export type ListItemWithHandleProps = SortableItemWrapperProps;

export type ListItemWithHandleComponent = React.ForwardRefExoticComponent<
    ListItemWithHandleProps & React.RefAttributes<ListItemWithHandleRef>
> & WithSelector;

export const ListItemWithHandle: ListItemWithHandleComponent = forwardRef<
    ListItemWithHandleRef,
    ListItemWithHandleProps
>((props, ref) => {
    const {
        title = 'Item',
    } = props;

    const itemProps: SortableElementProps = {
        className: classNames('list_item', props.className),
        'data-id': props.id,
        style: props.style,
    };

    if (typeof props.group === 'string') {
        itemProps['data-group'] = props.group;
    }

    return (
        <div {...itemProps} ref={ref}>
            <div className="drag-handle" />
            <span>{title}</span>
            <input type="text" />
        </div>
    );
});

ListItemWithHandle.displayName = 'ListItemWithHandle';
ListItemWithHandle.selector = '.list_item';
