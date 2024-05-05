import { DragMaster, useDragnDrop, useDropTarget } from '@jezvejs/react';
import PropTypes from 'prop-types';

export const OriginalDropTarget = (props) => {
    const { setState } = useDragnDrop();

    const { dropTargetRef } = useDropTarget({
        onDragEnd(params) {
            const { avatarInfo, offset, border } = params;
            const { id } = avatarInfo;

            const page = DragMaster.getEventPageCoordinates(params.e);
            setState((prev) => ({
                ...prev,
                [id]: {
                    ...(prev[id] ?? {}),
                    left: page.x - avatarInfo.mouseShift.x - offset.left - border.left,
                    top: page.y - avatarInfo.mouseShift.y - offset.top - border.top,
                    dragging: false,
                },
            }));
        },
    });

    return (
        <div ref={dropTargetRef} className="section-h200 drag-area">
            {props.children}
        </div>
    );
};

OriginalDropTarget.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
};
