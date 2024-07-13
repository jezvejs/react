import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './SortableTreeItem.scss';

// eslint-disable-next-line react/display-name
export const SortableTreeItem = forwardRef((props, ref) => {
    const {
        items,
        ...commonProps
    } = props;

    const itemProps = {
        className: classNames('tree-item', props.className),
        'data-id': props.id,
        style: props.style,
    };

    if (props.group) {
        itemProps['data-group'] = props.group;
    }

    const { ItemWrapper } = props.components;

    const renderItem = (item) => (
        (props.renderItem)
            ? props.renderItem(item)
            : (
                <ItemWrapper
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

    return (
        <div {...itemProps} ref={ref} >
            <span className="tree-item__title">{props.title}</span>
            <div className="tree-item__content">
                {items?.map((item) => (
                    renderItem(item)
                ))}
            </div>
        </div>
    );
});

SortableTreeItem.selector = '.tree-item';

const isComponent = PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
]);

SortableTreeItem.propTypes = {
    id: PropTypes.string,
    style: PropTypes.object,
    group: PropTypes.string,
    className: PropTypes.string,
    title: PropTypes.string,
    items: PropTypes.array,
    renderItem: PropTypes.func,
    components: PropTypes.shape({
        ItemWrapper: isComponent,
    }),
};
