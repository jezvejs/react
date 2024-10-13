import { DragMaster, useDragnDrop, useDropTarget } from '@jezvejs/react';
import PropTypes from 'prop-types';

export const OriginalDropTarget = (props) => {
    const { setState } = useDragnDrop();

    const { dropTargetRef } = useDropTarget({
        onDragEnd(params) {
            const { avatarInfo, offset, border } = params;
            const { id } = avatarInfo;

            const page = DragMaster.getEventPageCoordinates(params.e);
            const left = page.x - avatarInfo.mouseShift.x - offset.left - border.left;
            const top = page.y - avatarInfo.mouseShift.y - offset.top - border.top;

            setState((prev) => ({
                ...prev,
                [id]: {
                    ...(prev[id] ?? {}),
                    left,
                    top,
                    origLeft: left,
                    origTop: top,
                    dragging: false,
                },
                left,
                top,
                origLeft: left,
                origTop: top,
                dragging: false,
                draggingId: null,
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
