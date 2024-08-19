export interface ScreenRectangle {
    top: number,
    left: number,
    bottom: number,
    right: number,
    width: number,
    height: number,
}

export type EventListener = (e: Event) => void;
export interface EventListenerOptions {
    passive?: boolean,
    capture?: boolean,
}

export type PopupPositions =
    'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end';

export interface PopupPositionProps {
    elem?: Element | null,
    refElem?: Element | null,
    updateProps?: object | null,
    position?: PopupPositions,
    margin?: number,
    screenPadding?: number,
    bottomSafeArea?: number,
    useRefWidth?: boolean,
    allowFlip?: boolean,
    allowHorizontalFlip?: boolean,
    allowChangeAxis?: boolean,
    scrollOnOverflow?: boolean,
    allowResize?: boolean,
    minRefHeight?: number,
    onScrollDone?: () => void,
    onWindowScroll?: (e: Event) => void,
    onViewportResize?: (e: Event) => void,
}

export interface PopupPositionState extends PopupPositionProps {
    current: {
        left?: number,
        top?: number,
        width?: number,
        height?: number,
    },
    screen?: ScreenRectangle | null,
    offset?: ScreenRectangle | null,
    reference?: ScreenRectangle | null,
    scrollParentBox?: ScreenRectangle | null,

    isInitial: boolean,
    listeningWindow: boolean,
    scrollRequested: boolean,
    fixedElement?: boolean,
    scrollParent?: HTMLElement | null,
    fixedParent?: HTMLElement | null,
    absoluteParent?: boolean,

    flip?: boolean,
    crossFlip?: boolean,

    windowDist?: {
        left: number,
        right: number,
        top: number,
        bottom: number,
    },
    dist?: {
        left: number,
        right: number,
        top: number,
        bottom: number,
    },
    refScrollParent?: {
        left: number,
        top: number,
        width: number,
        height: number,
    },
    refScroll?: {
        left: number,
        top: number,
    },

    scrollLeft?: number,
    scrollTop?: number,
    scrollWidth?: number,
    scrollHeight?: number,
    scrollRight?: number,
    scrollBottom?: number,

    maxWidth?: number,
    minLeft?: number,
    width?: number,

    horScrollAvailable?: boolean,
    vertScrollAvailable?: boolean,

    margin?: number,
    bottomSafe?: number,

    vertOverflowBottom?: number,
    vertOverflowTop?: number,
    horOverflowLeft?: number,
    horOverflowRight?: number,

    horOverflowBottom?: number,
    horOverflowTop?: number,
    vertOverflowLeft?: number,
    vertOverflowRight?: number,
}
