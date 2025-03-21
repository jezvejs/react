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
import { useAnimationStage } from '../../hooks/useAnimationStage/useAnimationStage.tsx';
import { AnimationStages } from '../../utils/types.ts';

import './Offcanvas.scss';

export type OffcanvasPlacement = 'left' | 'right' | 'top' | 'bottom';

const TRANSITION_END_TIMEOUT = 500;

export interface OffcanvasProps {
    id?: string,
    className?: string,
    placement?: OffcanvasPlacement,
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
    transitionInProgress: boolean,
}

type OffcanvasRef = HTMLDivElement | null;

interface OffcanvasTransform {
    transform?: string;
}

const defaultProps = {
    placement: 'left' as OffcanvasPlacement,
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

    const contentRef = useRef<HTMLDivElement | null>(null);
    const [state, setState] = useState<OffcanvasState>({
        ...props,
        transitionInProgress: false,
    });

    const showBackground = state.transitionInProgress || state.closed === false;

    const animation = useAnimationStage<OffcanvasRef, OffcanvasTransform>({
        ref: contentRef,
        id: 'offcanvasAnimation',
        transform: null,
        transitionTimeout: TRANSITION_END_TIMEOUT,
        isTransformApplied: (transform: OffcanvasTransform | null) => (
            !!transform?.transform
        ),
        onExiting: () => {
            animation.setTransform(null);
        },
        onExited: () => {
            onAnimationDone();
        },
    });

    const isEntering = animation.stage === AnimationStages.entering;
    const isExited = animation.stage === AnimationStages.exited;

    useEffect(() => {
        if (state.closed === props.closed) {
            return;
        }

        if (props.closed) {
            handleClose();
        } else {
            handleOpen();
        }
    }, [props.closed, state.closed]);

    useScrollLock(props.useScrollLock && showBackground);

    const handleOpen = () => {
        setState((prev) => ({
            ...prev,
            transitionInProgress: true,
            closed: false,
        }));

        animation.setTransform({ transform: 'opening' });

        props.onOpened?.();
    };

    const handleClose = () => {
        animation.setTransform({ transform: 'closing' });

        setState((prev) => ({
            ...prev,
            transitionInProgress: true,
            closed: true,
        }));

        props.onClosed?.();
    };

    const onAnimationDone = useCallback(() => {
        setState((prev) => ({
            ...prev,
            transitionInProgress: false,
        }));
    }, []);

    const background = (showBackground)
        ? (
            <div
                className={classNames('offcanvas__bg', { closed: !!state.closed })}
                onClick={handleClose}
            />
        )
        : null;

    const isClosed = state.closed && !state.transitionInProgress;
    const isOpening = !state.closed && state.transitionInProgress;
    const isClosing = state.closed && state.transitionInProgress;

    if (isClosed && isExited) {
        return null;
    }

    const container = props.container ?? document.body;
    const contentIsClosed = isClosing || isClosed || (isOpening && (isExited || isEntering));

    const content = (
        <>
            <div
                className={classNames(
                    'offcanvas',
                    {
                        offcanvas_closed: contentIsClosed,
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
