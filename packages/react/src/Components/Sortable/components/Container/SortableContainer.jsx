import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// eslint-disable-next-line react/display-name
export const SortableContainer = forwardRef((props, ref) => {
    const {
        table = false,
        wrapInTbody = false,
        children,
        ...containerProps
    } = props;

    if (table) {
        return (
            <table {...containerProps} ref={ref}>
                {(wrapInTbody)
                    ? (<tbody>{children}</tbody>)
                    : children
                }
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
    wrapInTbody: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
};
