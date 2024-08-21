import {
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
} from 'react';
import classNames from 'classnames';

import { DragMaster } from '../../../utils/DragnDrop/DragMaster.ts';
import { RangeSliderDropTargetProps, RangeSliderDropTargetRef } from '../types.ts';
import { OnDragEndParams } from '../../../utils/DragnDrop/types.ts';

// eslint-disable-next-line react/display-name
export const RangeSliderDropTarget = forwardRef<
    RangeSliderDropTargetRef,
    RangeSliderDropTargetProps
>((props, ref) => {
    const {
        onClickCapture,
        onFocusCapture,
        onBlurCapture,
        onKeyDownCapture,
        disabled = false,
    } = props;

    const innerRef = useRef<RangeSliderDropTargetRef>(null);
    useImperativeHandle<
        RangeSliderDropTargetRef,
        RangeSliderDropTargetRef
    >(ref, () => innerRef.current);

    useEffect(() => {
        const dropTarget = {
            id: props.id,
            elem: innerRef?.current,

            onDragEnd(param: OnDragEndParams) {
                const avatar = param?.avatar ?? null;
                avatar?.onDragEnd?.();
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
