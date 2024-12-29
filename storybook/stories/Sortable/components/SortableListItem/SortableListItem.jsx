import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './SortableListItem.scss';

export const SortableListItem = forwardRef((props, ref) => {
    const itemProps = {
        className: classNames('sortable-list-item', props.className),
        'data-id': props.id,
        style: props.style,
    };

    if (props.group) {
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

SortableListItem.propTypes = {
    id: PropTypes.string,
    group: PropTypes.string,
    className: PropTypes.string,
    title: PropTypes.string,
    style: PropTypes.object,
};
