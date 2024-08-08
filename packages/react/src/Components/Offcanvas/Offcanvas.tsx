import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useScrollLock } from '../../hooks/useScrollLock/useScrollLock.ts';

import './Offcanvas.scss';

const defaultProps = {
    placement: 'left',
    closed: true,
    useScrollLock: true,
    onOpened: null,
    onClosed: null,
    onToggle: null,
};

export const Offcanvas = (p) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const [state, setState] = useState(props);
    const showBackground = state.transitionInProgress || state.closed === false;

    useEffect(() => {
        setState((prev) => (
            (props.closed === prev.closed)
                ? prev
                : {
                    ...prev,
                    closed: props.closed,
                }
        ));
    }, [props.closed]);

    useScrollLock(props.useScrollLock && showBackground);

    const handleClose = () => {
        setState((prev) => ({
            ...prev,
            transitionInProgress: true,
            closed: true,
        }));

        props.onClosed?.();
    };

    const handleTransitionEnd = () => {
        setState((prev) => ({
            ...prev,
            transitionInProgress: false,
        }));
    };

    const background = (showBackground)
        ? (
            <div
                className={classNames('offcanvas__bg', { closed: !!state.closed })}
                onClick={handleClose}
            />
        )
        : null;

    const container = props.container ?? document.body;

    return createPortal(
        <>
            <div
                className={classNames(
                    'offcanvas',
                    {
                        offcanvas_closed: !!state.closed,
                        offcanvas_right: state.placement === 'right',
                        offcanvas_top: state.placement === 'top',
                        offcanvas_bottom: state.placement === 'bottom',
                    },
                    props.className,
                )}
                onTransitionEndCapture={handleTransitionEnd}
            >
                <div className='offcanvas__content'>
                    {props.children}
                </div>
            </div>
            {background}
        </>,
        container,
    );
};

Offcanvas.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    placement: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
    closed: PropTypes.bool,
    useScrollLock: PropTypes.bool,
    onOpened: PropTypes.func,
    onClosed: PropTypes.func,
    onToggle: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
    container: PropTypes.object,
};
