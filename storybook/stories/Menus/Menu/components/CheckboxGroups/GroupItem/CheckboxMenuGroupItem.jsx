import { MenuGroupItem } from '@jezvejs/react';
import classNames from 'classnames';
import './CheckboxMenuGroupItem.scss';

export const CheckboxMenuGroupItem = (props) => (
    <MenuGroupItem
        {...props}
        className={classNames(
            'checkbox-menu-group',
            { selected: !!props.selected },
            props.className,
        )}
    />
);

CheckboxMenuGroupItem.propTypes = {
    ...MenuGroupItem.propTypes,
};

CheckboxMenuGroupItem.defaultProps = {
    ...MenuGroupItem.defaultProps,
};
