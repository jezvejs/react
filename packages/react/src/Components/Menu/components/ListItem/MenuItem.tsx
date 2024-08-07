import PropTypes from 'prop-types';
import classNames from 'classnames';

import './MenuItem.scss';

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
export const MenuItem = (p) => {
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
        activeItem,
        before,
        after,
    } = props;

    const isButton = type === 'button' || type === 'checkbox';
    const isLink = type === 'link' || type === 'checkbox-link';
    const isCheckbox = type === 'checkbox' || type === 'checkbox-link';

    const commonProps = {
        className: classNames(
            'menu-item',
            {
                'button-menu-item': isButton,
                'link-menu-item': isLink,
                'checkbox-menu-item': isCheckbox,
                'menu-item_selected': !!props.selected,
                'menu-item_active': (activeItem && props.id === activeItem),
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

    const IconComponent = icon;
    const iconContent = (icon) ? (<IconComponent className="menu-item__icon" />) : null;

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

    return <button {...commonProps}>{content}</button>;
};

MenuItem.propTypes = {
    id: PropTypes.string,
    type: PropTypes.string.isRequired,
    url: PropTypes.string,
    className: PropTypes.string,
    title: PropTypes.string,
    selectable: PropTypes.bool,
    selected: PropTypes.bool,
    disabled: PropTypes.bool,
    tabThrough: PropTypes.bool,
    renderNotSelected: PropTypes.bool,
    activeItem: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.oneOf([null]),
    ]),
    iconAlign: PropTypes.oneOf(['left', 'right']),
    checkboxSide: PropTypes.oneOf(['left', 'right']),
    before: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
    beforeContent: PropTypes.bool,
    after: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
    afterContent: PropTypes.bool,
    icon: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
    components: PropTypes.shape({
        Check: PropTypes.func,
    }),
};

MenuItem.selector = '.menu-item';
