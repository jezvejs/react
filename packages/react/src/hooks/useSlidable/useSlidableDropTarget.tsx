import PropTypes from 'prop-types';
import { isFunction } from '@jezvejs/types';

import { useDropTarget } from '../../utils/DragnDrop/useDropTarget.tsx';
import { useDragnDrop } from '../../utils/DragnDrop/DragnDropProvider.tsx';

export function useSlidableDropTarget(props) {
    const { getState } = useDragnDrop();

    const dropTarget = useDropTarget({
        ...props,

        getTargetElem() {
            return this.elem;
        },

        onDragEnd(params) {
            const state = getState();
            const { position, totalDistance, velocity } = state;

            const { avatar } = params;
            avatar?.onDragEnd?.();

            if (Math.abs(totalDistance) > 0 && isFunction(props.onDragEnd)) {
                props.onDragEnd(position, totalDistance, velocity);
            }
        },

    });

    return dropTarget;
}

useSlidableDropTarget.propTypes = {
    id: PropTypes.string,
    onDragEnd: PropTypes.func,
};
