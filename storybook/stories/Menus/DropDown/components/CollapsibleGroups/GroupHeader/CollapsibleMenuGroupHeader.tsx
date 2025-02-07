import { DropDownGroupHeaderComponent } from '@jezvejs/react';

import PlusIcon from '../../../../../../common/assets/icons/plus.svg';
import MinusIcon from '../../../../../../common/assets/icons/minus.svg';

import './CollapsibleMenuGroupHeader.scss';

const defaultProps = {
    title: null,
    expanded: true,
};

export const DropDownCollapsibleMenuGroupHeader: DropDownGroupHeaderComponent = (p) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const Icon = (props.expanded) ? MinusIcon : PlusIcon;

    return (
        <button
            className='menu-item menu-group__header dd__list-group__label'
            type='button'
            tabIndex={-1}
            data-id={props.id}
        >
            <span className='menu-group-header__title'>{props.title}</span>
            <Icon className='menu-item__icon menu-group-header__toggle-icon' />
        </button>
    );
};

DropDownCollapsibleMenuGroupHeader.selector = '.menu-group__header';
