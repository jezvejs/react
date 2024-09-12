import { afterTransition, CancelTransitionCallback } from '@jezvejs/dom';
import { useEffect, useRef, useState } from 'react';
import { AnimationStages } from '../../utils/types.ts';

export interface UseAnimationStageProps<
    RefType extends Node | null,
    Transform,
> {
    ref: React.RefObject<RefType | null>,

    id?: string;
    transform?: Transform | null;
    transitionTimeout?: number;
    animated?: boolean;

    isTransformApplied: (transform: Transform | null) => boolean;
    onStateChanged?: (stage: AnimationStages) => void;
    onEntering?: () => void;
    onEntered?: () => void;
    onExiting?: () => void;
    onExited?: () => void;
}

export interface UseAnimationStageResult<Transform> {
    stage: AnimationStages;
    transform: Transform | null;
    setStage: (stage: AnimationStages) => void;
    setTransform: (transform: Transform | null) => void;
    cancel: () => void;
    clearTransition: () => void;
    cancelAnimation: () => void;
}

export interface AnimationState<Transform> {
    stage: AnimationStages;
    transform: Transform | null;
}

/**
 * Runs only last call of function after timeout

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
            return;
        }

        // Exited -> Entering
        if (
            animation.stage === AnimationStages.exited
            && transformApplied
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
            if (!ref.current.parentNode) {
                setAnimationStage(AnimationStages.exiting);
                return;
            }

            clearTransitionRef.current = afterTransition(
                ref.current.parentNode as Element,
                {
                    elem: ref.current,
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

        // return () => cancel();
    }, [animation.stage, JSON.stringify(animation.transform)]);

    return res;
}
