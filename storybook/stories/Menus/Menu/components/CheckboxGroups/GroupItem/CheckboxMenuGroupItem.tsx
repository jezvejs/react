import { MenuGroupItem, MenuGroupItemComponent } from '@jezvejs/react';
import classNames from 'classnames';
import './CheckboxMenuGroupItem.scss';

export const CheckboxMenuGroupItem: MenuGroupItemComponent = (props) => (
    <MenuGroupItem
        {...props}
        className={classNames(
            'checkbox-menu-group',
            { selected: !!props.selected },
            props.className,
        )}
    />
);
