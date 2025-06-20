import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import classNames from 'classnames';
import { CollapsibleProps, CollapsibleState } from './types.ts';

import './Collapsible.scss';

export * from './types.ts';

export const defaultProps: CollapsibleState = {
    expanded: false,
    animated: false,
    toggleOnClick: true,
    header: 'Show',

    /* Content measured flag */
    animationReady: false,
    animationInProgress: false,
    /* Used to prevent animation on first render */
    changed: false,
    /* Measured height of child content */
    expandedHeight: undefined,
};

/**
 * Collapsible component
 */
export const Collapsible = (props: CollapsibleProps) => {
    const {
        expanded = false,
        animated = false,
        toggleOnClick = true,
        header = 'Show',
        onStateChange = null,
        ...rest
    } = props;

    const [state, setState] = useState<CollapsibleState>({
        expanded,
        animated,
        toggleOnClick,
        header,
        ...rest,
        /* Content measured flag */
        animationReady: false,
        animationInProgress: false,
        /* Used to prevent animation on first render */
        changed: false,
        /* Measured height of child content */
        expandedHeight: undefined,
    });

    const headerElemRef = useRef<HTMLDivElement | null>(null);
    const contentElemRef = useRef<HTMLDivElement | null>(null);

    const contentRef = useCallback((node: HTMLDivElement | null) => {
        if (node) {
            setState((prev) => ({
                ...prev,
                animationReady: true,
                expandedHeight: node.offsetHeight,
            }));
        }

        contentElemRef.current = node;
    }, []);

    useEffect(() => {
        setState((prev: CollapsibleState) => (
            (props.expanded === prev.expanded)
                ? prev
                : {
                    ...prev,
                    expanded: props.expanded,
                    changed: true,
                    animationInProgress: !!prev.animated,
                }
        ));
    }, [props.expanded]);

    const toggle = () => {
        const newExpanded = !state.expanded;

        setState((prev: CollapsibleState) => ({
            ...prev,
            expanded: !prev.expanded,
            changed: true,
            animationInProgress: !!prev.animated,
        }));

        if (onStateChange) {
            onStateChange(newExpanded);
        }
    };

    const resizeHandler = () => {
        const rect = contentElemRef.current?.getBoundingClientRect() ?? null;
        if (!rect) {
            return;
        }

        setState((prev) => ({
            ...prev,
            expandedHeight: rect.height,
        }));
    };

    // ResizeObserver
    useEffect(() => {
        if (!contentElemRef.current) {
            return undefined;
        }

        const observer = new ResizeObserver(resizeHandler);
        observer.observe(contentElemRef.current);

        return () => {
            observer.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contentElemRef.current]);

    const handleClick = useCallback((e: React.MouseEvent) => {
        if (!headerElemRef.current || !toggleOnClick) {
            return;
        }

        const target = e.target as HTMLElement;
        if (headerElemRef.current.contains(target)) {
            toggle();
        }
    }, [toggleOnClick]);

    const handleTransitionEnd = useCallback(() => {
        setState((prev: CollapsibleState) => ({
            ...prev,
            animationInProgress: false,
            changed: false,
        }));
    }, [state.expanded]);

    const animationStyle: {
        height?: number,
    } = {};
    if (state.animated && state.animationReady) {
        animationStyle.height = (state.expanded) ? state.expandedHeight : 0;
    }

    return (
        <div
            className={classNames(
                'collapsible',
                props.className,
                {
                    collapsible_animated: (
                        state.animationInProgress
                    ),
                    collapsible__expanded: (
                        state.expanded
                    ),
                    collapsible__expanding: (
                        !state.expanded && state.animationInProgress
                    ),
                },
            )}
            onClick={handleClick}
            onTransitionEndCapture={handleTransitionEnd}
        >
            <div className='collapsible-header' ref={headerElemRef}>
                {props.header}
            </div>
            <div className='collapsible-content' style={animationStyle}>
                <div className="collapse__content-wrapper" ref={contentRef}>
                    {props.children}
                </div>
            </div>
        </div>
    );
};
