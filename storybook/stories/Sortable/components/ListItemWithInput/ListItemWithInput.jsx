import classNames from 'classnames';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// eslint-disable-next-line react/display-name
export const ListItemWithInput = forwardRef((props, ref) => {
    const {
        title = 'Item',
    } = props;

    const itemProps = {
        className: classNames('list_item', props.className),
        'data-id': props.id,
        style: props.style,
    };

    if (props.group) {
        itemProps['data-group'] = props.group;
    }

    return (
        <div {...itemProps} ref={ref}>
            <span>{title}</span>
            <input type="text" />
        </div>
    );
});

ListItemWithInput.selector = '.list_item';

ListItemWithInput.propTypes = {
    id: PropTypes.string,
    group: PropTypes.string,
    className: PropTypes.string,
    title: PropTypes.string,
    style: PropTypes.object,
};
