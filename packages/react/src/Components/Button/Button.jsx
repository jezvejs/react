import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Button.scss';

const buttonTypes = ['button', 'submit', 'reset'];

const ButtonContent = (title) => (
    title && <div className="btn__content">{title}</div>
);

export function Button({
    title,
    type,
    url,
    icon,
    iconAlign,
    ...props
}) {
    const titleContainer = (icon)
        ? ButtonContent(title)
        : title;

    const IconComponent = icon;
    const iconContent = (icon) ? (<IconComponent className="btn__icon" />) : null;

    const content = (
        <>
            {(iconAlign === 'left') ? iconContent : null}
            {titleContainer}
            {(iconAlign !== 'left') ? iconContent : null}
        </>
    );

    const commonProps = {
        className: classNames('btn', props.className),
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
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    url: PropTypes.string,
    title: PropTypes.string,
    tooltip: PropTypes.string,
    icon: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
};

Button.defaultProps = {
    type: 'button', // button, link or static
    disabled: false,
    iconAlign: 'left', // available value: 'left', 'right'
    onClick: null,
};
