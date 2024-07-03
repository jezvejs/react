import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import { afterTransition } from '@jezvejs/dom';

import { useDragnDrop } from '../../../../utils/DragnDrop/DragnDropProvider.jsx';
import { AnimationStages } from '../../helpers.js';

// eslint-disable-next-line react/display-name
export const SortableListItem = forwardRef((props, ref) => {
    const {
        placeholderClass,
        animatedClass,
    } = props;

    const [animation, setAnimation] = useState({
        stage: AnimationStages.exited,
        initialTransform: props.initialTransform,
        offsetTransform: props.offsetTransform,
    });

    const { getState } = useDragnDrop();

    const innerRef = useRef(0);
    useImperativeHandle(ref, () => innerRef.current);

    const animationFrameRef = useRef(0);
    const clearTransitionRef = useRef(0);

    const setAnimationStage = (stage) => {
        setAnimation((prev) => ({ ...prev, stage }));
    };

    const setAnimationTransform = ({ initialTransform, offsetTransform }) => {
        setAnimation((prev) => ({ ...prev, initialTransform, offsetTransform }));
    };

    useEffect(() => {
        if (
            animation.initialTransform === props.initialTransform
            && animation.offsetTransform === props.offsetTransform
        ) {
            return;
        }

        if (props.offsetTransform) {
            setAnimationStage(AnimationStages.exited);

            setAnimationTransform({
                initialTransform: animation.offsetTransform,
                offsetTransform: props.offsetTransform,
            });
        } else {
            setAnimationTransform({
                initialTransform: props.initialTransform,
                offsetTransform: props.offsetTransform,
            });
        }
    }, [props.initialTransform, props.offsetTransform]);

    useEffect(() => {
        if (!innerRef.current) {
            return;
        }

        // Exiting -> Exited
        if (
            animation.stage === AnimationStages.exiting
            && !animation.offsetTransform
        ) {
            setAnimationStage(AnimationStages.exited);
            return;
        }

        // Exited -> Entering
        if (
            animation.stage === AnimationStages.exited
            && animation.offsetTransform
        ) {
            setAnimationStage(AnimationStages.entering);
            return;
        }

        // Entering -> Entered
        if (
            animation.stage === AnimationStages.entering
            && animationFrameRef.current === 0
        ) {
            animationFrameRef.current = requestAnimationFrame(() => {
                animationFrameRef.current = 0;
                setAnimationStage(AnimationStages.entered);
            });

            return;
        }

        // Entered -> Exiting
        if (
            !clearTransitionRef.current
            && animation.stage === AnimationStages.entered
        ) {
            clearTransitionRef.current = afterTransition(
                innerRef.current.parentNode,
                {
                    elem: innerRef.current,
                    duration: props.transitionTimeout,
                    property: 'transform',
                },
                () => {
                    clearTransitionRef.current = null;

                    setAnimationStage(AnimationStages.exiting);
                },
            );
        }
    }, [animation.stage, animation.initialTransform, animation.offsetTransform]);

    const state = getState();
    const isPlaceholder = (
        props.placeholder
        || (
            state.dragging
            && props.id === state.itemId
        )
    );

    const isEntered = animation.stage === AnimationStages.entered;
    const isExiting = animation.stage === AnimationStages.exiting;

    const listItemProps = useMemo(() => ({
        ...props,
        id: props.id,
        group: props.group,
        title: props.title,
        className: classNames(
            props.className,
            {
                [placeholderClass]: isPlaceholder,
                [animatedClass]: (!!props.animated && isEntered),
            },
        ),
        style: {
            transitionProperty: (isEntered || isExiting) ? 'transform' : '',
            transform: (
                (animation.offsetTransform && (isEntered || isExiting))
                    ? animation.offsetTransform
                    : animation.initialTransform
            ),
        },
    }), [
        props.title,
        props.group,
        props.id,
        props.animated,
        props.className,
        animation.initialTransform,
        animation.offsetTransform,
        animation.stage,
        isPlaceholder,
    ]);

    const { ListItem } = props.components;
    if (!ListItem) {
        return null;
    }

    return (
        <ListItem {...listItemProps} ref={innerRef} />
    );
});

const isComponent = PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
]);

SortableListItem.propTypes = {
    id: PropTypes.string,
    zoneId: PropTypes.string,
    group: PropTypes.string,
    className: PropTypes.string,
    placeholderClass: PropTypes.string,
    animatedClass: PropTypes.string,
    title: PropTypes.string,
    placeholder: PropTypes.bool,
    animated: PropTypes.bool,
    transitionTimeout: PropTypes.number,
    initialTransform: PropTypes.string,
    offsetTransform: PropTypes.string,
    style: PropTypes.object,
    components: PropTypes.shape({
        ListItem: isComponent,
    }),
};
