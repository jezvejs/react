import { forwardRef, ReactNode } from 'react';

export interface SortableContainerProps {
    className?: string,
    children?: ReactNode,
}

export type SortableContainerRef = HTMLDivElement | null;

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

SortableContainer.displayName = 'SortableContainer';
