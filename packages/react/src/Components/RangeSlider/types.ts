import { RangeType } from '../../utils/types.ts';

export interface RangeSliderAreaProps {
    top: number;
    left: number;

    original: {
        top: number;
        left: number;
    };

    shift: {
        x: number;
        y: number;
    };

    border: {
        top: number;
        left: number;
    };

    offset: {
        top: number;
        left: number;
    };
}

export type RangeSliderValue = number | RangeType;

export type RangeSliderAxisType = 'x' | 'y';

export type RangeSliderBeforeChangeType = 'value' | 'start' | 'end';

/**
 * Before area component props
 */
export interface RangeSliderBeforeAreaProps {
    axis: RangeSliderAxisType,
    range: boolean,
    beforeArea: boolean,
}

/**
 * After area component props
 */
export interface RangeSliderAfterAreaProps {
    axis: RangeSliderAxisType,
    range: boolean,
    afterArea: boolean,
}

/**
 * Selected area component props
 */
export interface RangeSliderSelectedAreaProps {
    id: string,
    axis: RangeSliderAxisType,
    range: boolean,
}

export type RangeSliderValueSliderType = 'startSlider' | 'endSlider';

export type RangeSliderType = RangeSliderValueSliderType | 'selectedArea';

/**
 * Value slider component props
 */
export interface RangeSliderValueSliderProps {
    id: string,
    axis: RangeSliderAxisType,
    type: RangeSliderValueSliderType,
    tabIndex?: number,
    disabled?: boolean,
}

/**
 * RangeSlider drag zone
 */
export interface RangeSliderDragZoneProps {
    id: string;
    axis: RangeSliderAxisType;
    type?: RangeSliderType;
    range: boolean;
    onPosChange: (position: number) => void;
}

export type RangeSliderDragZoneRef = HTMLDivElement | null;

/**
 * RangeSlider drop target
 */
export interface RangeSliderDropTargetProps {
    id: string;
    className: string;
    axis: RangeSliderAxisType;
    disabled: boolean;

    children: React.ReactNode;

    onClickCapture: (e: React.MouseEvent) => void;
    onFocusCapture: (e: React.FocusEvent<HTMLDivElement, Element>) => void;
    onBlurCapture: (e: React.FocusEvent<HTMLDivElement, Element>) => void;
    onKeyDownCapture: (e: React.KeyboardEvent) => void;
}

export type RangeSliderDropTargetRef = HTMLDivElement | null;

/**
 * RangeSlider component props
 */
export interface RangeSliderProps {
    id: string,
    className: string,
    tabIndex: number,
    value: number,
    start: number,
    end: number,
    axis: RangeSliderAxisType,
    min: number,
    max: number,
    step: number | null,
    disabled: boolean,
    range: boolean,
    beforeArea: boolean,
    afterArea: boolean,
    scrollOnClickOutsideRange: boolean,

    onClick: (e: React.MouseEvent<Element, MouseEvent>) => void,

    onFocus: (e: React.FocusEvent) => void,

    onBlur: (e: React.FocusEvent) => void,

    onKey: (e: React.KeyboardEvent) => void,

    onBeforeChange: (
        value: RangeSliderValue,
        changeType: RangeSliderBeforeChangeType,
    ) => RangeSliderValue,

    onChange: (value: RangeSliderValue) => void,

    onScroll: (value: RangeSliderValue) => void,
}

export interface RangeSliderState extends RangeSliderProps {
    precision: number | null,
    startSlider: RangeSliderAreaProps,
    endSlider: RangeSliderAreaProps,
    selectedArea: RangeSliderAreaProps,
    dragging: boolean,
    offset: object,
    rect: object,
    maxPos: number,
}
