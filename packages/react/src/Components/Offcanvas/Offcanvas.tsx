import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';

import { useScrollLock } from '../../hooks/useScrollLock/useScrollLock.ts';

import './Offcanvas.scss';

export type OffcanvasPlacement = 'left' | 'right' | 'top' | 'bottom';

export interface OffcanvasProps {
    id?: string,
    className?: string,
    placement: OffcanvasPlacement,
    closed?: boolean,
    useScrollLock?: boolean,
    onOpened?: (() => void) | null,
    onClosed?: (() => void) | null,
    onToggle?: (() => void) | null,
    children?: ReactNode,
    container?: Element | DocumentFragment,
}

interface OffcanvasState extends OffcanvasProps {
    transitionInProgress?: boolean,
}

const defaultProps = {
    placement: 'left',
    closed: true,
    useScrollLock: true,
    onOpened: null,
    onClosed: null,
    onToggle: null,
};

export const Offcanvas = (p: OffcanvasProps) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const [state, setState] = useState<OffcanvasState>(props);
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
