import PropTypes from 'prop-types';
import classNames from 'classnames';

import './MenuItem.scss';

/**
 * MenuItem component
 */
export const MenuItem = (props) => {
    const {
        type,
        title,
        icon,
        className,
        url,
        iconAlign,
        checkboxSide,
        activeItem,
        ...rest
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
    };

    if (isLink) {
        commonProps.href = url;
    } else {
        commonProps.type = type;
    }

    const IconComponent = icon;
    const iconContent = (icon) ? (<IconComponent className="menu-item__icon" />) : null;

    const { Check } = props.components;
    const checkContent = (isCheckbox && Check && props.selected)
        ? (<Check />)
        : null;

    const titleContainer = (
        <div className='menu-item__content' title={title}>{title}</div>
    );

    const hasBeforeContent = (
        (iconAlign === 'left' && iconContent)
        || (checkboxSide === 'left' && checkContent)
    );
    const hasAfterContent = (
        (iconAlign === 'right' && iconContent)
        || (checkboxSide === 'right' && checkContent)
    );

    const beforeContent = (hasBeforeContent)
        ? <div className='menu-item__side-content menu-item__before'>{iconContent ?? checkContent}</div>
        : null;

    const afterContent = (hasAfterContent)
        ? <div className='menu-item__side-content menu-item__after'>{checkContent ?? iconContent}</div>
        : null;

    const content = (
        <>
            {beforeContent}
            {titleContainer}
            {afterContent}
        </>
    );

    if (isLink) {
        return <a {...rest} {...commonProps}>{content}</a>;
    }

    return <button {...rest} {...commonProps}>{content}</button>;
};

MenuItem.propTypes = {
    id: PropTypes.string,
    type: PropTypes.string.isRequired,
    url: PropTypes.string,
    className: PropTypes.string,
    title: PropTypes.string,
    selected: PropTypes.bool,
    activeItem: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.oneOf([null]),
    ]),
    iconAlign: PropTypes.oneOf(['left', 'right']),
    checkboxSide: PropTypes.oneOf(['left', 'right']),
    icon: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
    components: PropTypes.shape({
        Check: PropTypes.func,
    }),
};

MenuItem.defaultProps = {
    type: 'button',
    selected: false,
    components: {
        Check: null,
    },
};

MenuItem.selector = '.menu-item';
