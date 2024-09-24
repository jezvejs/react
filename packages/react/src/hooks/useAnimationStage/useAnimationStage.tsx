import { afterTransition, CancelTransitionCallback } from '@jezvejs/dom';
import { useEffect, useRef, useState } from 'react';
import { AnimationStages } from '../../utils/types.ts';
import { AnimationState, UseAnimationStageProps, UseAnimationStageResult } from './types.ts';

/**
 * Animation stages hook
 * @param {UseAnimationStageProps} props
 * @returns {UseAnimationStageResult}
 */
export function useAnimationStage<
    RefType extends Node | null,
    Transform,
>(
    props: UseAnimationStageProps<RefType, Transform>,
): UseAnimationStageResult<Transform> {
    const [animation, setAnimation] = useState<AnimationState<Transform>>({
        stage: AnimationStages.exited,
        transform: props.transform ?? null,
    });

    const { ref } = props;
    const animationFrameRef = useRef(0);
    const clearTransitionRef = useRef<CancelTransitionCallback | null>(null);

    const isTransformApplied = () => (
        props.isTransformApplied?.(animation.transform)
    );

    const setAnimationStage = (stage: AnimationStages) => {
        setAnimation((prev) => ({ ...prev, stage }));

        props.onStateChanged?.(stage);
    };

    const setAnimationTransform = (transform: Transform | null) => {
        setAnimation((prev) => ({ ...prev, transform }));
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

    const cancel = () => {
        cancelAnimation();
        clearTransition();
    };

    const res: UseAnimationStageResult<Transform> = {
        stage: animation.stage,
        transform: animation.transform ?? null,
        setStage: setAnimationStage,
        setTransform: setAnimationTransform,
        cancel,
        clearTransition,
        cancelAnimation,
    };

    const handleAnimationState = () => {
        if (!ref?.current) {
            return;
        }

        const transformApplied = isTransformApplied();

        // Exiting -> Exited
        if (
            animation.stage === AnimationStages.exiting
            && !transformApplied
        ) {
            setAnimationStage(AnimationStages.exited);
            props.onExited?.();
            return;
        }

        // Exited -> Entering
        if (
            animation.stage === AnimationStages.exited
            && transformApplied
        ) {
            setAnimationStage(AnimationStages.entering);
            props.onEntering?.();
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
                props.onEntered?.();
            });

            return;
        }

        // Entered -> Exiting
        if (
            !clearTransitionRef.current
            && animation.stage === AnimationStages.entered
        ) {
            if (!ref.current.parentNode) {
                setAnimationStage(AnimationStages.exiting);
                props.onExiting?.();
                return;
            }

            const target = props.targetRef ?? ref;
            const targetRef = (typeof target === 'function')
                ? target()
                : target;

            clearTransitionRef.current = afterTransition(
                ref.current.parentNode as Element,
                {
                    target: targetRef?.current,
                    duration: props.transitionTimeout,
                    property: 'transform',
                },
                () => {
                    clearTransitionRef.current = null;

                    setAnimationStage(AnimationStages.exiting);
                    props.onExiting?.();
                },
            );
        }
    };

    useEffect(() => {
        handleAnimationState();

        // return () => cancel();
    }, [animation.stage, JSON.stringify(animation.transform)]);

    return res;
}
