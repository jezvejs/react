import { afterTransition } from '@jezvejs/dom';
import {
    ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';

import { useScrollLock } from '../../hooks/useScrollLock/useScrollLock.ts';

import './Offcanvas.scss';

export type OffcanvasPlacement = 'left' | 'right' | 'top' | 'bottom';

const TRANSITION_END_TIMEOUT = 500;

interface Callable {
    (): void,
}

export interface OffcanvasProps {
    id?: string,
    className?: string,
    placement: OffcanvasPlacement,
    closed?: boolean,
    usePortal?: boolean,
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
    usePortal: true,
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

    const animationFrameRef = useRef(0);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const clearTransitionRef = useRef<Callable | null>(null);

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

        handleAnimationEnd();
    };

    const onAnimationDone = useCallback(() => {
        clearTransitionRef.current = null;

        setState((prev) => ({
            ...prev,
            transitionInProgress: false,
        }));
    }, []);

    const cancelAnimation = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = 0;
        }

        if (clearTransitionRef.current) {
            clearTransitionRef.current?.();
            clearTransitionRef.current = null;
        }
    };

    const handleAnimationEnd = () => {
        cancelAnimation();

        animationFrameRef.current = requestAnimationFrame(() => {
            animationFrameRef.current = 0;

            if (!contentRef.current) {
                return;
            }

            clearTransitionRef.current = afterTransition(
                contentRef.current,
                {
                    duration: TRANSITION_END_TIMEOUT,
                    target: contentRef.current,
                },
                () => onAnimationDone(),
            );
        });
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

    const content = (
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
                ref={contentRef}
            >
                <div className='offcanvas__content'>
                    {props.children}
                </div>
            </div>
            {background}
        </>
    );

    return (props.usePortal) ? createPortal(content, container) : content;
};
