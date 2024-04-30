import { px } from '@jezvejs/react';
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// eslint-disable-next-line react/display-name
export const Box = forwardRef((props, ref) => {
    const style = {
        left: px(props.left),
        top: px(props.top),
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

Box.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    left: PropTypes.number,
    top: PropTypes.number,
    hidden: PropTypes.bool,
    dragging: PropTypes.bool,
    absolutePos: PropTypes.bool,
};
