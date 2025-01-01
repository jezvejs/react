import { FunctionComponent, memo, SVGProps } from 'react';
import classNames from 'classnames';
import {
    MenuItemComponent,
    MenuItemProps,
    NativeButtonType,
} from '../../types.ts';
import './MenuItem.scss';

interface MenuItemCommonProps {
    className?: string;
    'data-id'?: string;
    disabled?: boolean;
    href?: string;
    type?: string;
    tabIndex?: number;
}

const defaultProps = {
    type: 'button',
    selectable: true,
    selected: false,
    disabled: false,
    renderNotSelected: false,
    components: {
        Check: null,
    },
};

/**
 * MenuItem component
 */
export const MenuItem: MenuItemComponent = memo<MenuItemProps>((p: MenuItemProps) => {
    const props = {
        ...defaultProps,
        ...p,
        components: {
            ...defaultProps.components,
            ...(p?.components ?? {}),
        },
    };

    const {
        type,
        title,
        icon,
        className,
        url,
        iconAlign,
        checkboxSide,
        before,
        after,
    } = props;

    const isButton = type === 'button' || type === 'checkbox' || type === 'parent';
    const isLink = type === 'link' || type === 'checkbox-link';
    const isCheckbox = type === 'checkbox' || type === 'checkbox-link';

    const commonProps: MenuItemCommonProps = {
        className: classNames(
            'menu-item',
            {
                'button-menu-item': isButton,
                'link-menu-item': isLink,
                'checkbox-menu-item': isCheckbox,
                'menu-item_selected': !!props.selected,
                'menu-item_active': !!props.active,
            },
            className,
        ),
        'data-id': props.id,
        disabled: props.disabled,
    };

    if (isLink) {
        commonProps.href = url;
    } else {
        commonProps.type = type;
    }

    if (!props.tabThrough || props.disabled) {
        commonProps.tabIndex = -1;
    }

    const IconComponent = icon as FunctionComponent<SVGProps<SVGSVGElement>>;
    const iconContent = (icon) ? (<IconComponent className='menu-item__icon' />) : null;

    const { Check } = props.components;
    const checkContent = (isCheckbox && Check && (props.selected || props.renderNotSelected))
        ? (<Check />)
        : null;

    const titleContainer = (
        <div className='menu-item__content' title={title}>{title}</div>
    );

    const hasBeforeContent = (
        !!before
        || (iconAlign === 'left' && iconContent)
        || (checkboxSide === 'left' && checkContent)
    );
    const hasAfterContent = (
        !!after
        || (iconAlign === 'right' && iconContent)
        || (checkboxSide === 'right' && checkContent)
    );

    const beforeContent = hasBeforeContent && (
        <div className='menu-item__side-content menu-item__before'>
            {before ?? iconContent ?? checkContent}
        </div>
    );

    const afterContent = hasAfterContent && (
        <div className='menu-item__side-content menu-item__after'>
            {after ?? checkContent ?? iconContent}
        </div>
    );

    const content = (
        <>
            {beforeContent}
            {titleContainer}
            {afterContent}
        </>
    );

    if (isLink) {
        return <a {...commonProps}>{content}</a>;
    }

    const btnType = (isCheckbox) ? 'button' : (type as NativeButtonType);
    return (
        <button
            {...commonProps}
            type={btnType}
        >
            {content}
        </button>
    );
});

MenuItem.displayName = 'MenuItem';
MenuItem.selector = '.menu-item';
