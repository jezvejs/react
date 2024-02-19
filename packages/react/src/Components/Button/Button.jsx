import PropTypes from 'prop-types';

import './Button.css';

const buttonTypes = ['button', 'submit', 'reset'];

export function Button({
    title,
    type,
    url,
    icon,
    iconAlign,
    ...props
}) {
    const titleContainer = (icon)
        ? (<div className="btn__content">{title}</div>)
        : title;

    const IconComponent = icon;
    const iconContent = (icon) ? (<IconComponent className="btn__icon" />) : null;

    const content = (iconAlign === 'left')
        ? [iconContent, titleContainer]
        : [titleContainer, iconContent];

    const commonProps = {
        className: ['btn', props.className].join(' '),
    };

    if (type === 'link') {
        return <a href={url} {...props} {...commonProps}>{content}</a>;
    }
    if (type === 'static') {
        return <div {...props} {...commonProps}>{content}</div>;
    }
    if (buttonTypes.includes(type)) {
        return <button type={type} {...props} {...commonProps}>{content}</button>;
    }

    throw new Error('Invalid button type');
}

Button.propTypes = {
    className: PropTypes.string,
    type: PropTypes.oneOf(['button', 'link', 'static']),
    iconAlign: PropTypes.oneOf(['left', 'right']),
    enabled: PropTypes.bool,
    onClick: PropTypes.func,
    url: PropTypes.string,
    title: PropTypes.string,
    tooltip: PropTypes.string,
    icon: PropTypes.elementType,
};

Button.defaultProps = {
    type: 'button', // button, link or static
    enabled: true,
    iconAlign: 'left', // available value: 'left', 'right'
    onClick: null,
};
