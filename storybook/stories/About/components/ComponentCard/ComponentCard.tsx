import classNames from 'classnames';
import { ComponentCardProps } from '../../types.ts';
import './ComponentCard.scss';

export const ComponentCard = ({
    className,
    title,
    url,
    description,
    vertical,
    children,
}: ComponentCardProps) => {
    const headerEl = !!title && (
        <header className="component-card__title">{title}</header>
    );

    const titleEl = (url)
        ? (<a className="component-card__header" href={url}>{headerEl}</a>)
        : headerEl;

    return (
        <div className={classNames('component-card', className)}>
            {titleEl}
            <p className="component-card__descr">{description ?? ''}</p>
            <div
                className={classNames(
                    'component-card__content',
                    { 'component-card__content-vertical': vertical },
                )}
            >
                {children}
            </div>
        </div>
    );
};
