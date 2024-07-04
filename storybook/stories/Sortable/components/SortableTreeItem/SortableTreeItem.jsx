import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './SortableTreeItem.scss';

// eslint-disable-next-line react/display-name
export const SortableTreeItem = forwardRef((props, ref) => {
    const itemProps = {
        className: classNames('tree-item', props.className),
        'data-id': props.id,
    };

    if (props.group) {
        itemProps['data-group'] = props.group;
    }

    const renderItem = (item) => (
        (props.renderItem)
            ? props.renderItem(item)
            : (
                <SortableTreeItem
                    {...item}
                    renderItem={renderItem}
                    key={`srtlist_${props.id}_${item.id}`}
                />
            )
    );

    return (
        <div {...itemProps} ref={ref} >
            <span className="tree-item__title">{props.title}</span>
            <div className="tree-item__content">
                {props.items?.map((item) => (
                    renderItem(item)
                ))}
            </div>
        </div>
    );
});

SortableTreeItem.selector = '.tree-item';

SortableTreeItem.propTypes = {
    id: PropTypes.string,
    group: PropTypes.string,
    className: PropTypes.string,
    title: PropTypes.string,
    items: PropTypes.array,
    renderItem: PropTypes.func,
};
