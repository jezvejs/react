import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './SortableTreeItem.scss';

// eslint-disable-next-line react/display-name
export const SortableTreeItem = forwardRef((props, ref) => {
    const commonProps = {
        group: props.group,
        zoneId: props.zoneId,
        animated: props.animated,
        placeholderClass: props.placeholderClass,
        animatedClass: props.animatedClass,
        transitionTimeout: props.transitionTimeout,
        components: props.components,
    };

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
                {props.items?.map((item) => (
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
    zoneId: PropTypes.string,
    animated: PropTypes.bool,
    transitionTimeout: PropTypes.number,
    placeholderClass: PropTypes.string,
    animatedClass: PropTypes.string,
    className: PropTypes.string,
    title: PropTypes.string,
    items: PropTypes.array,
    renderItem: PropTypes.func,
    components: PropTypes.shape({
        ItemWrapper: isComponent,
    }),
};
