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

import { useDragnDrop } from '../../../../utils/DragnDrop/DragnDropProvider.tsx';
import { AnimationStages, isPlaceholder } from '../../helpers.ts';
import { px } from '../../../../utils/common.ts';

// eslint-disable-next-line react/display-name
export const SortableItemWrapper = forwardRef((props, ref) => {
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

    const cancelAnimation = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = 0;
        }
    };

    const clearTransition = () => {
        if (clearTransitionRef.current) {
            clearTransitionRef.current();
            clearTransitionRef.current = null;
        }
    };

    useEffect(() => {
        if (
            animation.initialTransform === props.initialTransform
            && animation.offsetTransform === props.offsetTransform
        ) {
            return;
        }

        clearTransition();
        setAnimationStage(AnimationStages.exited);

        if (props.offsetTransform) {
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

    const handleAnimationState = () => {
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
            if (!props.animated) {
                setAnimationStage(AnimationStages.exiting);
                return;
            }

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
    };

    useEffect(() => {
        handleAnimationState();

        return () => {
            cancelAnimation();
            clearTransition();
        };
    }, [animation.stage, animation.initialTransform, animation.offsetTransform]);

    const state = getState();

    const isEntered = animation.stage === AnimationStages.entered;
    const isExiting = animation.stage === AnimationStages.exiting;

    const listItemProps = useMemo(() => {
        const getItemState = (item) => ({
            ...item,
            className: classNames(
                item.className,
                {
                    [placeholderClass]: isPlaceholder(item, state),
                    [animatedClass]: (item.animated && isEntered),
                },
            ),
            items: (
                Array.isArray(item.items)
                    ? item.items.map(getItemState)
                    : item.items
            ),
        });

        const res = getItemState({
            ...props,
            id: props.id,
            group: props.group,
            title: props.title,
            style: {
            },
        });

        if (props.initialTransform && props.offsetTransform) {
            if (props.animated && (isEntered || isExiting)) {
                res.style.transitionProperty = 'transform, width';
            }

            res.style.transform = (
                (animation.offsetTransform && (isEntered || isExiting))
                    ? animation.offsetTransform
                    : animation.initialTransform
            );
        }

        if (props.targetRect) {
            res.style.width = px(props.targetRect.width);
        }

        const targetChild = props.targetRect?.childContainer;
        const origChild = props.rect?.childContainer;
        if (targetChild) {
            res.childContainer = { ...targetChild };

            if (origChild) {
                res.childContainer.height = origChild.height;
            }
        }

        return res;
    }, [
        props.title,
        props.group,
        props.id,
        props.items,
        props.animated,
        props.className,
        props.rect,
        props.targetRect,
        props.initialTransform,
        props.offsetTransform,
        props.childContainer,
        state.dragging,
        animation.initialTransform,
        animation.offsetTransform,
        animation.stage,
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

SortableItemWrapper.propTypes = {
    id: PropTypes.string,
    zoneId: PropTypes.string,
    group: PropTypes.string,
    items: PropTypes.array,
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
    rect: PropTypes.object,
    targetRect: PropTypes.object,
    childContainer: PropTypes.object,
    components: PropTypes.shape({
        ListItem: isComponent,
    }),
};
