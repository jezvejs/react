import { MenuList } from '../../../../Menu/Menu.tsx';
import { DropDownMenuListComponent, DropDownMenuListProps } from '../../../types.ts';

/**
 * Drop Down Menu list component
 */
export const DropDownMenuList: DropDownMenuListComponent = (props: DropDownMenuListProps) => (
    <MenuList {...props} />
);
