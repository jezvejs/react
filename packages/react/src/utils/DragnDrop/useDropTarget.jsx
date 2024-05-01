import { getOffset } from '@jezvejs/dom';
import { DragMaster } from '@jezvejs/react';
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export function useDropTarget(props) {
    const dropTargetRef = useRef(null);

    useEffect(() => {
        const dropTarget = {
            ...props,
            elem: dropTargetRef?.current,
            onDragEnd(params) {
                const { avatar, e } = params;

                const elem = dropTargetRef?.current;
                const offset = getOffset(elem);
                const border = {
                    top: elem.clientTop,
                    left: elem.clientLeft,
                };

                const avatarInfo = avatar.getDragInfo(e);
                avatar.onDragEnd?.();

                props.onDragEnd?.({
                    ...params,
                    avatarInfo,
                    dropTarget,
                    offset,
                    border,
                });
            },
        };

        DragMaster.registerDropTarget(dropTarget);

        return () => DragMaster.unregisterDropTarget(dropTarget);
    }, []);

    return {
        dropTargetRef,
    };
}

useDropTarget.propTypes = {
    getTargetElem: PropTypes.func,
    hideHoverIndication: PropTypes.func,
    showHoverIndication: PropTypes.func,
    onDragMove: PropTypes.func,
    onDragEnd: PropTypes.func,
    onDragEnter: PropTypes.func,
    onDragLeave: PropTypes.func,
};
