import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// eslint-disable-next-line react/display-name
export const SortableContainer = forwardRef((props, ref) => {
    const {
        table = false,
        children,
        ...containerProps
    } = props;

    if (table) {
        return (
            <table {...containerProps} ref={ref}>
                {children}
            </table>
        );
    }

    return (
        <div {...containerProps} ref={ref}>
            {children}
        </div>
    );
});

SortableContainer.propTypes = {
    className: PropTypes.string,
    table: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
};
