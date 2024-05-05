import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './SortableTile.scss';

// eslint-disable-next-line react/display-name
export const SortableTile = forwardRef((props, ref) => {
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
        <div
            className={classNames('sortable-tile', props.className)}
            data-id={props.id}
            ref={ref}
        >
            {title}
            {icon}
        </div>
    );
});

SortableTile.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    title: PropTypes.string,
    icon: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
};
