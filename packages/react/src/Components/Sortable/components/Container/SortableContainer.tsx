import PropTypes from 'prop-types';
import { forwardRef, ReactNode } from 'react';

export interface SortableContainerProps {
    className?: string,
    table?: boolean,
    wrapInTbody?: boolean,
    children?: ReactNode,
};

export type SortableContainerRef = HTMLElement;

// eslint-disable-next-line react/display-name
export const SortableContainer = forwardRef<SortableContainerRef, SortableContainerProps>((props, ref) => {
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
