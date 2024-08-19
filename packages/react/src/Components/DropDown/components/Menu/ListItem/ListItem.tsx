import classNames from 'classnames';
import { MenuItem } from '../../../../Menu/Menu.tsx';
import { DropDownMenuItemProps } from '../../../types.ts';

const defaultProps = {
    hidden: false,
};

export const DropDownListItem = (p: DropDownMenuItemProps) => {
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
};

DropDownListItem.selector = MenuItem.selector;
