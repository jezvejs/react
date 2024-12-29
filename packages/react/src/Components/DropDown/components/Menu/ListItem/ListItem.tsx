import classNames from 'classnames';
import { memo } from 'react';

import { MenuItem } from '../../../../Menu/Menu.tsx';
import { MenuItemComponent } from '../../../../Menu/types.ts';
import { DropDownMenuItemProps } from '../../../types.ts';

const defaultProps = {
    hidden: false,
};

export const DropDownListItem: MenuItemComponent = memo((p: DropDownMenuItemProps) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    return (
        <MenuItem
            {...props}
            className={classNames('dd__list-item', props.className)}
        />
    );
});

DropDownListItem.displayName = 'DropDownListItem';
DropDownListItem.selector = MenuItem.selector;
