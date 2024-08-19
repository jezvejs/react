import { forwardRef, ReactNode } from 'react';

export interface SortableContainerProps {
    className?: string,
    children?: ReactNode,
}

export type SortableContainerRef = HTMLDivElement | null;

// eslint-disable-next-line react/display-name
export const SortableContainer = forwardRef<
    SortableContainerRef,
    SortableContainerProps
>((props, ref) => {
    const {
        children,
        ...containerProps
    } = props;

    return (
        <div {...containerProps} ref={ref}>
            {children}
        </div>
    );
});
