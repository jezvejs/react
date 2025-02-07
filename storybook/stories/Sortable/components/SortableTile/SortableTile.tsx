import { forwardRef } from 'react';
import classNames from 'classnames';
import './SortableTile.scss';
import { SortableListItemComponent } from '@jezvejs/react';

export type SortableTileRef = HTMLDivElement;

export type SortableTileProps = {
    id: string;
    className?: string;
    style?: React.CSSProperties;
    title?: string;
    icon?: React.FC<React.SVGProps<SVGElement>>;
};

export const SortableTile: SortableListItemComponent = forwardRef<
    SortableTileRef,
    SortableTileProps
>((props, ref) => {
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
