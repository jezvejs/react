export interface CollapsibleProps {
    id?: string,
    className?: string,
    expanded?: boolean,
    animated?: boolean,
    toggleOnClick?: boolean,
    header?: React.ReactNode,
    children?: React.ReactNode,

    onStateChange?: (expanded: boolean) => void,
}

export interface CollapsibleState extends CollapsibleProps {
    /* Content measured flag */
    animationReady: boolean;
    animationInProgress: boolean;
    /* Used to prevent animation on first render */
    changed: boolean;
    /* Measured height of child content */
    expandedHeight: number | undefined;
}
