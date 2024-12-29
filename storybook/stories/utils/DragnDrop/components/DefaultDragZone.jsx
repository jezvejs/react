import { useDragZone, useDragnDrop } from '@jezvejs/react';
import {
    forwardRef,
    useImperativeHandle,
    useRef,
} from 'react';
import PropTypes from 'prop-types';

import { usePortalElement } from '../../../../common/hooks/usePortalElement.jsx';

import { Box } from './Box.jsx';
import { OriginalDragAvatar } from './OriginalDragAvatar.jsx';

export const DefaultDragZone = forwardRef((props, ref) => {
    const {
        dragOriginal = false,
        Content = Box,
        ...dragZoneProps
    } = props;

    const innerRef = useRef(null);
    useImperativeHandle(ref, () => innerRef.current);

    const { getState } = useDragnDrop();

    const portalElement = usePortalElement();

    const {
        showOriginal,
        showAvatar,
        dragZoneRef,
        avatarRef,
    } = useDragZone({
        ...dragZoneProps,
        dragOriginal,
    });

    const state = getState();

    const origProps = {
        ...state,
        id: props.id,
        title: props.title,
        absolutePos: props.absolutePos,
        dragging: false,
        hidden: !showOriginal,
    };

    const avatarProps = {
        ...state,
        id: props.id,
        title: props.title,
    };

    const content = <Content {...origProps} ref={dragZoneRef} />;

    const avatar = (showAvatar && (
        <OriginalDragAvatar container={portalElement}>
            <Content {...avatarProps} ref={avatarRef} />
        </OriginalDragAvatar>
    ));

    return (
        <div ref={innerRef}>
            {content}
            {avatar}
        </div>
    );
});

DefaultDragZone.displayName = 'DefaultDragZone';
DefaultDragZone.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    left: PropTypes.number,
    top: PropTypes.number,
    dragOriginal: PropTypes.bool,
    absolutePos: PropTypes.bool,
    Content: PropTypes.object,
};
