import { DropDownMenu } from '@jezvejs/react';
import { forwardRef } from 'react';

// eslint-disable-next-line react/display-name
export const DropDownCollapsibleGroupsMenu = forwardRef((props, ref) => (
    <DropDownMenu
        {...props}
        ref={ref}
    />
));
