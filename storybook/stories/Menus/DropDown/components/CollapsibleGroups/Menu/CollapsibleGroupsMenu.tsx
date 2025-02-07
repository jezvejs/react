import {
    DropDownMenu,
    DropDownMenuComponent,
    DropDownMenuProps,
    DropDownMenuRef,
} from '@jezvejs/react';
import { forwardRef } from 'react';

export const DropDownCollapsibleGroupsMenu: DropDownMenuComponent = forwardRef<
    DropDownMenuRef,
    DropDownMenuProps
>((props, ref) => (
    <DropDownMenu
        {...props}
        ref={ref}
    />
));

DropDownCollapsibleGroupsMenu.displayName = 'DropDownCollapsibleGroupsMenu';
