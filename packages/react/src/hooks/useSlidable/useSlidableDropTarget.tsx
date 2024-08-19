import { useDragnDrop } from '../../utils/DragnDrop/DragnDropProvider.tsx';
import { OnDragEndParams } from '../../utils/DragnDrop/types.ts';
import { useDropTarget, UseDropTargetProps } from '../../utils/DragnDrop/useDropTarget.tsx';

import { SlidableState } from './useSlidable.tsx';

export interface UseSlidableDropTargetProps extends UseDropTargetProps {
    id: string,

    onWheel?: (e: WheelEvent) => void;

    onSlideEnd?: (position: number, totalDistance: number, velocity: number) => void,
}

export function useSlidableDropTarget(props: UseSlidableDropTargetProps) {
    const dragDrop = useDragnDrop();
    const getState = () => dragDrop?.getState() as SlidableState ?? null;

    const dropTargetProps: UseSlidableDropTargetProps = {
        ...props,

        getTargetElem() {
            return this.elem as HTMLElement;
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
