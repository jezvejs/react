import classNames from 'classnames';
import {
    ComponentType,
    forwardRef,
    FunctionComponent,
    ReactNode,
    SVGProps,
} from 'react';

import './Button.scss';

const buttonTypes = ['button', 'submit', 'reset'];

const ButtonContent = (title: ReactNode) => (
    title && <div className="btn__content">{title}</div>
);

export type NativeButtonType = 'button' | 'submit' | 'reset';
export type ButtonTypes = NativeButtonType | 'link' | 'static';

export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
    className?: string;
    tabIndex?: number;
    type?: ButtonTypes;
    iconAlign?: 'left' | 'right';
    disabled?: boolean;
    url?: string;
    title?: string;
    tooltip?: string;
    icon?: ComponentType | string | null;

    children?: ReactNode;

    onClick?: (e: React.MouseEvent) => void;
}

export type ButtonRef = HTMLElement | null;

const defaultProps = {
    type: 'button',
    iconAlign: 'left',
    disabled: false,
    url: '',
    tooltip: '',
    icon: null,
};

export const Button = forwardRef<ButtonRef, ButtonProps>((p, ref) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const {
        className,
        title,
        children,
        type,
        url,
        icon,
        iconAlign,
        ...btnProps
    } = props;

    /** 'click' event handler */
    const onClick = (e: React.MouseEvent) => {
        if (props.disabled) {
            if (e.cancelable) {
                e.preventDefault();
            }

            return;
        }

        props.onClick?.(e);
    };

    const btnContent = title ?? children;
    const titleContainer = (icon)
        ? ButtonContent(btnContent)
        : btnContent;

    const IconComponent = icon as FunctionComponent<SVGProps<SVGSVGElement>>;
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
        onClick,
        className: classNames('btn', className),
    };

    if (props.disabled) {
        commonProps.tabIndex = -1;
    }

    if (type === 'link') {
        return (
            <a
                {...commonProps}
                href={url}
            >
                {content}
            </a>
        );
    }

    if (type === 'static') {
        return (
            <div
                {...commonProps}
                ref={ref as React.Ref<HTMLDivElement>}
            >
                {content}
            </div>
        );
    }

    if (buttonTypes.includes(type)) {
        const btnType = type as NativeButtonType;
        return (
            <button
                {...commonProps}
                type={btnType}
                ref={ref as React.Ref<HTMLButtonElement>}
            >
                {content}
            </button>
        );
    }

    // Invalid type of button
    return null;
});

Button.displayName = 'Button';
