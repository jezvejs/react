export type SortableElementProps = React.HTMLAttributes<HTMLDivElement> & {
    'data-id': string,
    'data-group'?: string,
};

export type WithSelector = {
    selector?: string;
};
