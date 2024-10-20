import classNames from 'classnames';
import { MenuGroupHeaderComponent, MenuGroupHeaderProps } from '../../types.ts';
import './MenuGroupHeader.scss';

export const MenuGroupHeader: MenuGroupHeaderComponent = (props: MenuGroupHeaderProps) => (
    <div
        className={classNames('menu-group__header', props.className)}
        data-id={props.id}
    >
        {props.title}
    </div>
);

MenuGroupHeader.selector = '.menu-group__header';
