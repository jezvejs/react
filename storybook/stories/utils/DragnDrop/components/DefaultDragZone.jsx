import { useDragZone, useDragnDrop } from '@jezvejs/react';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';
import PropTypes from 'prop-types';

import { usePortalElement } from '../../../../hooks/usePortalElement.jsx';

import { Box } from './Box.jsx';
import { OriginalDragAvatar } from './OriginalDragAvatar.jsx';

// eslint-disable-next-line react/display-name
export const DefaultDragZone = forwardRef((props, ref) => {
    const {
        dragOriginal = false,
        Content = Box,
        ...dragZoneProps
    } = props;

    const innerRef = useRef(null);
    useImperativeHandle(ref, () => innerRef.current);

    const { state, setState } = useDragnDrop();

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

    useEffect(() => {
        setState((prev) => ({
            ...prev,
            left: (props.absolutePos) ? props.left : 0,
            origLeft: (props.absolutePos) ? props.left : 0,
            top: (props.absolutePos) ? props.top : 0,
            origTop: (props.absolutePos) ? props.top : 0,
            dragging: false,
        }));
    }, [props.left, props.top, props.absolutePos]);

    const origProps = {
        ...state,
        id: props.id,
        title: props.title,
        left: state.origLeft,
        top: state.origTop,
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

DefaultDragZone.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    left: PropTypes.number,
    top: PropTypes.number,
    dragOriginal: PropTypes.bool,
    absolutePos: PropTypes.bool,
    Content: PropTypes.object,
};
