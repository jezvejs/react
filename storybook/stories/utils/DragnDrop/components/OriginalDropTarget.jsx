import { getOffset } from '@jezvejs/dom';
import { DragMaster } from '@jezvejs/react';
import { useEffect, useRef, useState } from 'react';

import { DefaultDragZone } from './DefaultDragZone.jsx';

export const OriginalDropTarget = () => {
    const dropTargetRef = useRef(null);

    const [state, setState] = useState({
        box: {
            id: 'orig',
            left: 0,
            top: 0,
            absolutePos: true,
        },
    });

    useEffect(() => {
        const dropTarget = {
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

                const page = DragMaster.getEventPageCoordinates(e);
                setState((prev) => ({
                    ...prev,
                    box: {
                        ...prev.box,
                        left: page.x - avatarInfo.mouseShift.x - offset.left - border.left,
                        top: page.y - avatarInfo.mouseShift.y - offset.top - border.top,
                        dragging: false,
                    },
                }));
            },
        };

        DragMaster.registerDropTarget(dropTarget);
    }, []);

    return (
        <div ref={dropTargetRef} className="section-h200 drag-area">
            <DefaultDragZone {...state.box} dragOriginal />
        </div>
    );
};
