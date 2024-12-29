import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './SortableTile.scss';

export const SortableTile = forwardRef((props, ref) => {
    const itemProps = {
        className: classNames('sortable-tile', props.className),
        'data-id': props.id,
        style: props.style,
    };

    const title = props.title && (
        <span className='sortable-tile__title'>{props.title}</span>
    );

    const Icon = props.icon;
    const icon = Icon && (
        <span className='sortable-tile__icon-container'>
            <Icon className="sortable-tile__icon" />
        </span>
    );

    return (
        <div {...itemProps} ref={ref} >
            {title}
            {icon}
        </div>
    );
});

SortableTile.displayName = 'SortableTile';
SortableTile.selector = '.sortable-tile';

SortableTile.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    title: PropTypes.string,
    icon: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
};
