import { DragMaster } from '@jezvejs/react';
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export const XAxisDropTarget = (props) => {
    const dropTargetRef = useRef(null);

    useEffect(() => {
        const dropTarget = {
            id: props.id,
            elem: dropTargetRef?.current,
            onDragEnd({ avatar }) {
                avatar.onDragEnd?.();
            },
        };

        DragMaster.registerDropTarget(dropTarget);

        return () => DragMaster.unregisterDropTarget(dropTarget);
    }, []);

    return (
        <div ref={dropTargetRef} className="x-axis-area">
            {props.children}
        </div>
    );
};

XAxisDropTarget.propTypes = {
    id: PropTypes.string,
    onDragEnd: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
};
