import { MenuGroupItem, MenuGroupItemComponent } from '@jezvejs/react';
import classNames from 'classnames';
import './CollapsibleMenuGroupItem.scss';

const defaultProps = {
    expanded: false,
};

export const CollapsibleMenuGroupItem: MenuGroupItemComponent = (p) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    return (
        <MenuGroupItem
            {...props}
            className={classNames(
                'menu-group_collapsible',
                { expanded: !!props.expanded },
                props.className,
            )}
            allowActiveGroupHeader
        />
    );
};
