import { SortableItemWrapperProps } from '@jezvejs/react';
import classNames from 'classnames';
import { forwardRef } from 'react';

import { SortableElementProps, WithSelector } from '../../types.ts';

export type ListItemWithInputRef = HTMLDivElement | null;

export type ListItemWithInputProps = SortableItemWrapperProps;

export type ListItemWithInputComponent = React.ForwardRefExoticComponent<
    ListItemWithInputProps & React.RefAttributes<ListItemWithInputRef>
> & WithSelector;

export const ListItemWithInput: ListItemWithInputComponent = forwardRef<
    ListItemWithInputRef,
    ListItemWithInputProps
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
            <span>{title}</span>
            <input type="text" />
        </div>
    );
});

ListItemWithInput.displayName = 'ListItemWithInput';
ListItemWithInput.selector = '.list_item';
