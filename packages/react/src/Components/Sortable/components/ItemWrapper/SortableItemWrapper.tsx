import { afterTransition } from '@jezvejs/dom';
import classNames from 'classnames';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';

import { px } from '../../../../utils/common.ts';
import { useDragnDrop } from '../../../../utils/DragnDrop/DragnDropProvider.tsx';
import { isPlaceholder } from '../../helpers.ts';

import {
    SortableAnimationTransform,
    SortableItemWrapperProps,
    SortableItemWrapperRef,
    SortableState,
} from '../../types.ts';

enum AnimationStages {
    exited = 0,
    entering,
    entered,
    exiting,
}

interface Callable {
    (): void,
}

// eslint-disable-next-line react/display-name
export const SortableItemWrapper = forwardRef<
    SortableItemWrapperRef,
    SortableItemWrapperProps
>((props, ref) => {
    const {
        placeholderClass,
        animatedClass,
    } = props;

    const [animation, setAnimation] = useState({
        stage: AnimationStages.exited,
        initialTransform: props.initialTransform,
        offsetTransform: props.offsetTransform,
    });

    const dragDrop = useDragnDrop();
    const getState = () => dragDrop?.getState() as SortableState ?? null;

    const innerRef = useRef<HTMLElement>(null);
    useImperativeHandle<SortableItemWrapperRef, SortableItemWrapperRef>(ref, () => (
        innerRef?.current
    ));

    const animationFrameRef = useRef(0);
    const clearTransitionRef = useRef<Callable | null>(null);

    const setAnimationStage = (stage: AnimationStages) => {
        setAnimation((prev) => ({ ...prev, stage }));
    };

    const setAnimationTransform = (params: SortableAnimationTransform) => {
        setAnimation((prev) => ({ ...prev, ...params }));
    };

    const cancelAnimation = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = 0;
        }
    };

    const clearTransition = () => {
        if (typeof clearTransitionRef.current === 'function') {
            clearTransitionRef.current?.();
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
            if (!props.animated || !innerRef.current.parentNode) {
                setAnimationStage(AnimationStages.exiting);
                return;
            }

            clearTransitionRef.current = afterTransition(
                innerRef.current.parentNode as Element,
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
        const getItemState = (item: SortableItemWrapperProps): SortableItemWrapperProps => ({
            ...item,
            className: classNames(
                item.className,
                (placeholderClass)
                    ? { [placeholderClass]: isPlaceholder(item, state) }
                    : {},
                (animatedClass)
                    ? { [animatedClass]: (item.animated && isEntered) }
                    : {},
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
                res.style!.transitionProperty = 'transform, width';
            }

            const transform = (animation.offsetTransform && (isEntered || isExiting))
                ? animation.offsetTransform
                : animation.initialTransform;

            if (transform) {
                res.style!.transform = transform;
            }
        }

        if (props.targetRect) {
            res.style!.width = px(props.targetRect.width ?? 0);
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

    const { ListItem } = props.components ?? {};
    if (!ListItem) {
        return null;
    }

    return (
        <ListItem {...listItemProps} ref={innerRef} />
    );
});
