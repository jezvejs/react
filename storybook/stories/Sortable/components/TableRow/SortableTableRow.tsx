import { SortableAvatarColumn } from '@jezvejs/react';
import { forwardRef } from 'react';
import classNames from 'classnames';

import { SortableElementProps } from 'common/Components/SortableListItem/SortableListItem.tsx';

import { WithSelector } from '../../types.ts';

export type SortableTableRowRef = HTMLTableRowElement | null;

export type SortableTableRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
    id: string;
    group?: string;
    columns: SortableAvatarColumn[];
};

export type SortableTableTbodyRowComponent = React.ForwardRefExoticComponent<
    SortableTableRowProps & React.RefAttributes<SortableTableRowRef>
> & WithSelector;

export const SortableTableRow: SortableTableTbodyRowComponent = forwardRef<
    SortableTableRowRef,
    SortableTableRowProps
>((props, ref) => {
    const itemProps: SortableElementProps = {
        className: classNames('tbl_list_item', props.className),
        'data-id': props.id ?? '',
        style: props.style,
    };

    if (typeof props.group === 'string') {
        itemProps['data-group'] = props.group;
    }

    return (
        <tr {...itemProps} ref={ref} >
            {props.columns.map((column) => (
                <td key={column.id} style={column.style}>
                    <div style={column.innerStyle}>
                        {column.content}
                    </div>
                </td>
            ))}
        </tr>
    );
});

SortableTableRow.displayName = 'SortableTableRow';
SortableTableRow.selector = '.tbl_list_item';
