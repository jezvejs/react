import classNames from 'classnames';
import { MenuSeparatorProps } from '../../types.ts';
import './MenuSeparator.scss';

/**
 * MenuSeparator component
 */
export const MenuSeparator: React.FC<MenuSeparatorProps> = (props: MenuSeparatorProps) => {
    const { className } = props;

    const separatorProps = {
        className: classNames('menu-separator', className),
        'data-id': props.id,
    };

    return <div {...separatorProps}></div>;
};
