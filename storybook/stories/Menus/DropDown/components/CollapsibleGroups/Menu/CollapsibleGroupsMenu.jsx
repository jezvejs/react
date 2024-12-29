import { DropDownMenu } from '@jezvejs/react';
import { forwardRef } from 'react';

export const DropDownCollapsibleGroupsMenu = forwardRef((props, ref) => (
    <DropDownMenu
        {...props}
        ref={ref}
    />
));

DropDownCollapsibleGroupsMenu.displayName = 'DropDownCollapsibleGroupsMenu';
