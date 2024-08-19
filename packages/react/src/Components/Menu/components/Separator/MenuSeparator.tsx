import classNames from 'classnames';
import { MenuSeparatorProps } from '../../types.ts';
import './MenuSeparator.scss';

/**
 * MenuSeparator component
 */
export const MenuSeparator: React.FC<MenuSeparatorProps> = (props: MenuSeparatorProps) => {
    const { id, className } = props;

    return <div id={id} className={classNames('menu-separator', className)}></div>;
};
