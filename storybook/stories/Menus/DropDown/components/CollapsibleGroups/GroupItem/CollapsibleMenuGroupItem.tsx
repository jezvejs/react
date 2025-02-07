import { MenuGroupItem, MenuGroupItemComponent } from '@jezvejs/react';
import classNames from 'classnames';

import { DropDownCollapsibleMenuGroupHeader } from '../GroupHeader/CollapsibleMenuGroupHeader.tsx';
import './CollapsibleMenuGroupItem.scss';

const defaultProps = {
    expanded: true,
    components: {
        GroupHeader: DropDownCollapsibleMenuGroupHeader,
    },
};

export const DropDownCollapsibleMenuGroupItem: MenuGroupItemComponent = (p) => {
    const props = {
        ...defaultProps,
        ...p,
        components: {
            ...defaultProps.components,
            ...(p?.components ?? {}),
        },
    };

    return (
        <MenuGroupItem
            {...props}
            className={classNames(
                'menu-group_collapsible',
                { expanded: props.expanded },
            )}
            allowActiveGroupHeader
        />
    );
};
