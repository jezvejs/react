import { px } from '@jezvejs/react';
import { forwardRef } from 'react';
import classNames from 'classnames';

export type BoxRef = HTMLDivElement | null;

export type BoxProps = {
    id?: string;
    title?: string;
    left?: number;
    top?: number;
    type?: string;
    hidden?: boolean;
    dragging?: boolean;
    absolutePos?: boolean;
};

export const Box = forwardRef<
    BoxRef,
    BoxProps
>((props, ref) => {
    const style: React.CSSProperties = {
        left: px(props.left ?? 0),
        top: px(props.top ?? 0),
    };

    if (props.dragging) {
        style.zIndex = 9999;
        style.position = 'absolute';
    }

    if (props.hidden) {
        style.display = 'none';
    }

    return (
        <div
            ref={ref}
            id={props.id}
            className={classNames(
                'square',
                {
                    abs_pos_square: !!props.absolutePos,
                    semitransp: !!props.dragging,
                },
            )}
            style={style}
        >
            {props.title}
        </div>
    );
});

Box.displayName = 'Box';
