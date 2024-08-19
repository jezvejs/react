import {
    ReactNode,
    useCallback,
    useEffect,
    useState,
} from 'react';
import classNames from 'classnames';

import './Collapsible.scss';

export interface CollapsibleProps {
    id: string,
    className: string,
    expanded: boolean,
    animated: boolean,
    toggleOnClick: boolean,
    header: ReactNode,
    children: ReactNode,
    onStateChange: (expanded: boolean) => void,
}

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

    const [state, setState] = useState({
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

    const contentRef = useCallback((node) => {
        if (node) {
            setState((prev) => ({
                ...prev,
                animationReady: true,
                expandedHeight: node.offsetHeight,
            }));
        }
    }, []);

    useEffect(() => {
        setState((prev) => (
            (props.expanded === prev.expanded)
                ? prev
                : {
                    ...prev,
                    expanded: props.expanded,
                    changed: true,
                    animationInProgress: prev.animated,
                }
        ));
    }, [props.expanded]);

    const toggle = () => {
        const newExpanded = !state.expanded;

        setState((prev) => ({
            ...prev,
            expanded: !prev.expanded,
            changed: true,
            animationInProgress: prev.animated,
        }));

        if (onStateChange) {
            onStateChange(newExpanded);
        }
    };

    const handleClick = () => {
        if (state.toggleOnClick) {
            toggle();
        }
    };

    const handleTransitionEnd = () => {
        setState((prev) => ({
            ...prev,
            animationInProgress: false,
            changed: false,
        }));
    };

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
            <div className='collapsible-header'>
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
