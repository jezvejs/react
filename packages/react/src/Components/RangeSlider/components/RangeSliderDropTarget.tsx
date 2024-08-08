import {
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { DragMaster } from '../../../utils/DragnDrop/DragMaster.ts';

// eslint-disable-next-line react/display-name
export const RangeSliderDropTarget = forwardRef((props, ref) => {
    const {
        onClickCapture = null,
        onFocusCapture = null,
        onBlurCapture = null,
        onKeyDownCapture = null,
        disabled = false,
    } = props;

    const innerRef = useRef(null);
    useImperativeHandle(ref, () => innerRef.current);

    useEffect(() => {
        const dropTarget = {
            id: props.id,
            elem: innerRef?.current,
            onDragEnd({ avatar }) {
                avatar.onDragEnd?.();
            },
        };

        DragMaster.registerDropTarget(dropTarget);

        return () => DragMaster.unregisterDropTarget(dropTarget);
    }, []);

    const dropTargetProps = {
        className: classNames(
            'range-slider',
            {
                'range-slider_x-axis': props.axis === 'x',
                'range-slider_y-axis': props.axis === 'y',
            },
            props.className,
        ),
        onClickCapture,
        onFocusCapture,
        onBlurCapture,
        onKeyDownCapture,
        disabled,
    };

    return (
        <div {...dropTargetProps} ref={innerRef}>
            {props.children}
        </div>
    );
});

RangeSliderDropTarget.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    axis: PropTypes.oneOf(['x', 'y']),
    disabled: PropTypes.bool,
    onClickCapture: PropTypes.func,
    onFocusCapture: PropTypes.func,
    onBlurCapture: PropTypes.func,
    onKeyDownCapture: PropTypes.func,
    onDragEnd: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
};
