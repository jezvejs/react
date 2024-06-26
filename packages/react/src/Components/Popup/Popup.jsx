import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Common hooks
import { useScrollLock } from '../../hooks/useScrollLock/useScrollLock.js';

// Common components
import { CloseButton } from '../CloseButton/CloseButton.jsx';

import './Popup.scss';

const defaultProps = {
    className: null,
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
export const Popup = (p) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const attrs = {
        id: props.id,
    };

    useScrollLock(props.nodim !== true && props.show);

    const onClose = (e) => {
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

Popup.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    show: PropTypes.bool,
    nodim: PropTypes.bool,
    scrollMessage: PropTypes.bool,
    closeButton: PropTypes.bool,
    onClose: PropTypes.func,
    title: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
    footer: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
    container: PropTypes.object,
};
