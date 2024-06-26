import { MenuList } from '../../../../Menu/Menu.jsx';

/**
 * Drop Down Menu list component
 */
export const DropDownMenuList = (props) => (
    <MenuList {...props} />
);

DropDownMenuList.propTypes = {
    ...MenuList.propTypes,
};
