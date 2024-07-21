import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// eslint-disable-next-line react/display-name
export const SortableTableTbodyRow = forwardRef((props, ref) => {
    const itemProps = {
        className: classNames('tbl_list_item', props.className),
        'data-id': props.id,
        style: props.style,
    };

    if (props.group) {
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

SortableTableTbodyRow.selector = '.tbl_list_item';

SortableTableTbodyRow.propTypes = {
    id: PropTypes.string,
    group: PropTypes.string,
    className: PropTypes.string,
    columns: PropTypes.array,
    style: PropTypes.object,
};
