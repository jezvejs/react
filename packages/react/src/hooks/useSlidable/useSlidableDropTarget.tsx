import { useDragnDrop } from '../../utils/DragnDrop/DragnDropProvider.tsx';
import { OnDragEndParams } from '../../utils/DragnDrop/types.ts';
import { useDropTarget } from '../../utils/DragnDrop/useDropTarget.tsx';

import { SlidableState, UseSlidableDropTargetProps } from './types.ts';

export function useSlidableDropTarget(props: UseSlidableDropTargetProps) {
    const { getState } = useDragnDrop<SlidableState>();

    const dropTargetProps: UseSlidableDropTargetProps = {
        ...props,

        getTargetElem() {
            return this.elem as HTMLElement;
        },

        isDropAllowed({ avatar, dropTarget }) {
            return !!avatar?.id && avatar.id === dropTarget?.id;
        },

        onDragEnd(params: OnDragEndParams) {
            const state = getState();
            const { position, totalDistance, velocity } = state;

            const { avatar } = params;
            avatar?.onDragEnd?.();

            if (Math.abs(totalDistance) > 0) {
                props.onSlideEnd?.(position, totalDistance, velocity);
            }
        },

    };

    const dropTarget = useDropTarget(dropTargetProps);

    return dropTarget;
}
