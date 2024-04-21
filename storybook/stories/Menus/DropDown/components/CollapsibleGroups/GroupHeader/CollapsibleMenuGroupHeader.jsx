import { DropDownGroupHeader } from '@jezvejs/react';
import PropTypes from 'prop-types';

import PlusIcon from '../../../../../../assets/icons/plus.svg';
import MinusIcon from '../../../../../../assets/icons/minus.svg';

import './CollapsibleMenuGroupHeader.scss';

export const DropDownCollapsibleMenuGroupHeader = (props) => {
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

DropDownCollapsibleMenuGroupHeader.propTypes = {
    ...DropDownGroupHeader.propTypes,
    id: PropTypes.string,
    title: PropTypes.string,
    expanded: PropTypes.bool,
};

DropDownCollapsibleMenuGroupHeader.defaultProps = {
    ...DropDownGroupHeader.defaultProps,
    title: null,
    expanded: true,
};
