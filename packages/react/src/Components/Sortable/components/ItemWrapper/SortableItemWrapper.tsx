import classNames from 'classnames';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
} from 'react';

// Utils
import { px } from '../../../../utils/common.ts';
import { useDragnDrop } from '../../../../utils/DragnDrop/DragnDropProvider.tsx';
import { AnimationStages } from '../../../../utils/types.ts';

// Hooks
import { useAnimationStage } from '../../../../hooks/useAnimationStage/useAnimationStage.tsx';

import { isPlaceholder } from '../../helpers.ts';
import {
    SortableItemWrapperProps,
    SortableItemWrapperRef,
    SortableState,
} from '../../types.ts';

export interface SortableItemTransform {
    initial?: string | null;
    offset?: string | null;
}

const defaultProps = {
    transitionTimeout: 500,
};

export const SortableItemWrapper = forwardRef<
    SortableItemWrapperRef,
    SortableItemWrapperProps
>((p, ref) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const {
        placeholderClass,
        animatedClass,
        transitionTimeout,
    } = props;

    const innerRef = useRef<HTMLElement | null>(null);
    useImperativeHandle<SortableItemWrapperRef, SortableItemWrapperRef>(ref, () => (
        innerRef?.current
    ));

    const animation = useAnimationStage<SortableItemWrapperRef, SortableItemTransform>({
        ref: innerRef,
        id: props.id,
        transform: null,
        transitionTimeout,
        isTransformApplied: (transform: SortableItemTransform | null) => (
            !!transform?.offset
        ),
    });

    const {
        cancel,
        clearTransition,
        setStage,
        setTransform,
    } = animation;

    const { getState } = useDragnDrop<SortableState>();

    useEffect(() => {
        if (
            animation.transform?.initial === props.initialTransform
            && animation.transform?.offset === props.offsetTransform
        ) {
            return undefined;
        }

        clearTransition();
        setStage(AnimationStages.exited);

        if (props.offsetTransform) {
            setTransform({
                initial: animation.transform?.offset ?? props.initialTransform,
                offset: props.offsetTransform,
            });
        } else {
            setTransform({
                initial: props.initialTransform,
                offset: props.offsetTransform,
            });
        }

        return () => cancel();
    }, [props.initialTransform, props.offsetTransform]);

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

            const transform = (animation.transform?.offset && (isEntered || isExiting))
                ? animation.transform?.offset
                : animation.transform?.initial;

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
        animation.transform,
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

SortableItemWrapper.displayName = 'SortableItemWrapper';
