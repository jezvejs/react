import { DragMaster } from '@jezvejs/react';
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { DefaultDragZone } from './DefaultDragZone.jsx';

export const DefaultDropTarget = (props) => {
    const dropTargetRef = useRef(null);

    useEffect(() => {
        const dropTarget = {
            id: props.id,
            elem: dropTargetRef?.current,
            onDragEnd(params) {
                const { avatar, e } = params;

                const avatarInfo = avatar.getDragInfo(e);
                avatar.onDragEnd?.();

                props.onDragEnd?.({ avatarInfo, e, dropTarget });
            },
        };

        DragMaster.registerDropTarget(dropTarget);

        return () => {
            DragMaster.unregisterDropTarget(dropTarget);
        };
    }, []);

    return (
        <div ref={dropTargetRef} className="inner-drop">
            {props.items.map((item) => (
                <DefaultDragZone key={`defdragzone_${item.id}`} {...item} />
            ))}
        </div>
    );
};

DefaultDropTarget.propTypes = {
    id: PropTypes.string,
    items: PropTypes.array,
    dragOriginal: PropTypes.bool,
    onDragEnd: PropTypes.func,
};
