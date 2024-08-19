import React, {
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
    ReactNode,
} from 'react';
import classNames from 'classnames';

import { DragMaster } from '../../../utils/DragnDrop/DragMaster.ts';

export interface RangeSliderDropTargetProps {
    id: string;
    className: string;
    axis: 'x' | 'y';
    disabled: boolean;

    children: ReactNode;

    onClickCapture: (e: React.MouseEvent) => void;
    onFocusCapture: (e: React.FocusEvent<HTMLDivElement, Element>) => void;
    onBlurCapture: (e: React.FocusEvent<HTMLDivElement, Element>) => void;
    onKeyDownCapture: (e: React.KeyboardEvent) => void;
    // onDragEnd: () => void;
}

type RangeSliderDropTargetRef = HTMLDivElement | null;

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
