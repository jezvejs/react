import { MenuGroupHeader, MenuCheckbox } from '@jezvejs/react';
import classNames from 'classnames';
import './CheckboxMenuGroupHeader.scss';

export const CheckboxMenuGroupHeader = (props) => {
    const { activeItem } = props;

    return (
        <button
            className={classNames(
                'menu-group__header',
                'menu-item',
                {
                    'menu-item_selected': !!props.selected,
                    'menu-item_active': (activeItem && props.id === activeItem),
                },
            )}
            data-id={props.id}
        >
            <span className='menu-group-header__title'>{props.title}</span>
            <MenuCheckbox />
        </button>
    );
};

CheckboxMenuGroupHeader.propTypes = {
    ...MenuGroupHeader.propTypes,
};

CheckboxMenuGroupHeader.defaultProps = {
    ...MenuGroupHeader.defaultProps,
};

CheckboxMenuGroupHeader.selector = '.menu-group__header';
