import PropTypes from 'prop-types';
import classNames from 'classnames';
import { forwardRef } from 'react';

import './Button.scss';

const buttonTypes = ['button', 'submit', 'reset'];

const ButtonContent = (title) => (
    title && <div className="btn__content">{title}</div>
);

// eslint-disable-next-line react/display-name
export const Button = forwardRef((props, ref) => {
    const {
        className,
        title,
        children,
        type = 'button',
        url,
        icon,
        iconAlign = 'left',
        ...btnProps
    } = props;

    const btnContent = title ?? children;
    const titleContainer = (icon)
        ? ButtonContent(btnContent)
        : btnContent;

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
        ...btnProps,
        ref,
        className: classNames('btn', className),
    };

    if (type === 'link') {
        return <a {...commonProps} href={url}>{content}</a>;
    }
    if (type === 'static') {
        return <div {...commonProps}>{content}</div>;
    }
    if (buttonTypes.includes(type)) {
        return <button type={type} {...commonProps}>{content}</button>;
    }

    throw new Error('Invalid button type');
});

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
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
};
