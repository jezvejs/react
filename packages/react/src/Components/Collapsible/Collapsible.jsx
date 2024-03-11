import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Collapsible.scss';

/**
 * Collapsible component
 */
export const Collapsible = (props) => {
    const { onStateChange } = props;
    const [state, setState] = useState({
        ...props,
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

    const animationStyle = {};
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
                        state.expanded || (!state.expanded && state.animationInProgress)
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

Collapsible.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    expanded: PropTypes.bool,
    animated: PropTypes.bool,
    toggleOnClick: PropTypes.bool,
    header: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
    onStateChange: PropTypes.func,
};

Collapsible.defaultProps = {
    expanded: false,
    animated: false,
    toggleOnClick: true,
    header: 'Show',
    content: null,
    onStateChange: null,
};
