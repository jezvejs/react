export interface RangeSliderAreaProps {
    top: number;
    left: number;
    shiftX: number;
    shiftY: number;
    offset: {
        top: number;
        left: number;
        width: number;
        height: number;
    };
    rect: {
        top: number;
        left: number;
        width: number;
        height: number;
    };
}

export interface RangeSliderRange {
    start: number;
    end: number;
}

export type RangeSliderValue = number | RangeSliderRange;

export type RangeSliderBeforeChangeType = 'value' | 'start' | 'end';

/**
 * Before area component props
 */
export interface RangeSliderBeforeAreaProps {
    axis: 'x' | 'y',
    range: boolean,
    beforeArea: boolean,
}

/**
 * After area component props
 */
export interface RangeSliderAfterAreaProps {
    axis: 'x' | 'y',
    range: boolean,
    afterArea: boolean,
}

/**
 * Selected area component props
 */
export interface RangeSliderSelectedAreaProps {
    id: string,
    axis: 'x' | 'y',
    range: boolean,
}

export type RangeSliderValueSliderType = 'startSlider' | 'endSlider';

/**
 * Value slider component props
 */
export interface RangeSliderValueSliderProps {
    id: string,
    axis: 'x' | 'y',
    type: RangeSliderValueSliderType,
    tabIndex?: number,
    disabled?: boolean,
}

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
    axis: 'x' | 'y',
    min: number,
    max: number,
    step: number,
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
