import { createPortal } from 'react-dom';
import { ReactNode } from 'react';
import classNames from 'classnames';

// Common hooks
import { useScrollLock } from '../../hooks/useScrollLock/useScrollLock.ts';

// Common components
import { CloseButton } from '../CloseButton/CloseButton.tsx';

import './Popup.scss';

export interface PopupProps {
    id?: string,
    className?: string,
    show?: boolean,
    nodim?: boolean,
    scrollMessage?: boolean,
    closeButton?: boolean,
    onClose?: ((e: React.MouseEvent) => void) | null,
    title?: ReactNode,
    footer?: ReactNode,
    children?: ReactNode,
    container?: Element | DocumentFragment,
}

const defaultProps: Partial<PopupProps> = {
    title: null,
    footer: null,
    closeButton: false,
    show: false,
    nodim: false,
    scrollMessage: false,
    onClose: null,
};

/**
 * Popup component
 */
export const Popup = (p: PopupProps) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const attrs = {
        id: props.id,
    };

    useScrollLock(props.nodim !== true && props.show);

    const onClose = (e: React.MouseEvent) => {
        props.onClose?.(e);
    };

    if (!props.show) {
        return null;
    }

    const container = props.container ?? document.body;

    return createPortal(
        <div
            {...attrs}
            className={classNames(
                'popup',
                props.className,
                {
                    popup_nodim: props.nodim,
                    'popup_scroll-message': props.scrollMessage,
                },
            )}
        >
            <div className='popup__wrapper'>
                <div className='popup__content'>
                    <div className='popup__header'>
                        {props.title && <div className='popup__title'>{props.title}</div>}
                        {props.closeButton && <CloseButton small={false} onClick={onClose} />}
                    </div>
                    <div className='popup__message'>
                        {props.children}
                    </div>
                    {props.footer && <div className='popup__footer'>{props.footer}</div>}
                </div>
            </div>
        </div>,
        container,
    );
};
