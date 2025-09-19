import { forwardRef } from 'react';
import classNames from 'classnames';
import { SortableAvatarColumn } from '@jezvejs/react';

import { SortableElementProps } from 'common/Components/SortableListItem/SortableListItem.tsx';

import { WithSelector } from '../../types.ts';

export type SortableTableTbodyRowRef = HTMLTableSectionElement;

export type SortableTableTbodyRowProps = React.HTMLAttributes<HTMLTableSectionElement> & {
    id: string;
    group?: string;
    columns: SortableAvatarColumn[];
};

export type SortableTableTbodyRowComponent = React.ForwardRefExoticComponent<
    SortableTableTbodyRowProps & React.RefAttributes<SortableTableTbodyRowRef>
> & WithSelector;

export const SortableTableTbodyRow: SortableTableTbodyRowComponent = forwardRef<
    SortableTableTbodyRowRef,
    SortableTableTbodyRowProps
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
        <tbody {...itemProps} ref={ref} >
            <tr>
                {props.columns.map((column) => (
                    <td key={column.id} style={column.style}>
                        <div style={column.innerStyle}>
                            {column.content}
                        </div>
                    </td>
                ))}
            </tr>
        </tbody>
    );
});

SortableTableTbodyRow.displayName = 'SortableTableTbodyRow';
SortableTableTbodyRow.selector = '.tbl_list_item';
