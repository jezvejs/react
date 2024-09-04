import { MenuGroupHeader } from '@jezvejs/react';
import classNames from 'classnames';

import PlusIcon from '../../../../../../common/assets/icons/plus.svg';
import MinusIcon from '../../../../../../common/assets/icons/minus.svg';

import './CollapsibleMenuGroupHeader.scss';

export const CollapsibleMenuGroupHeader = (props) => {
    const { activeItem } = props;

    const Icon = (props.expanded)
        ? MinusIcon
        : PlusIcon;

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
            <Icon className='menu-item__icon menu-group-header__toggle-icon' />
        </button>
    );
};

CollapsibleMenuGroupHeader.propTypes = {
    ...MenuGroupHeader.propTypes,
};

CollapsibleMenuGroupHeader.selector = '.menu-group__header';
