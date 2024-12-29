import { forwardRef, ReactNode } from 'react';

export interface SortableTableContainerProps {
    className?: string,
    wrapInTbody?: boolean,
    children?: ReactNode,
}

export type SortableTableContainerRef = HTMLTableElement | null;

export const SortableTableContainer = forwardRef<
    SortableTableContainerRef,
    SortableTableContainerProps
>((props, ref) => {
    const {
        wrapInTbody = false,
        children,
        ...containerProps
    } = props;

    return (
        <table {...containerProps} ref={ref}>
            {(wrapInTbody)
                ? (<tbody>{children}</tbody>)
                : children
            }
        </table>
    );
});

SortableTableContainer.displayName = 'SortableTableContainer';
