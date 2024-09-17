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
