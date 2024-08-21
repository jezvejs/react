import { BaseChartProps } from '../BaseChart/types.ts';
import { RangeSliderProps } from '../RangeSlider/types.ts';

export type RangeScrollChartData = BaseChartProps;

export type ChartType = 'histogram' | 'linechart';

export type RangeScrollChartChangeType =
    'start'
    | 'end'
    | 'value'
    | 'reset'
    | 'scroll'
    | 'resize';

export interface RangeScrollChartProps {
    className: string,
    type: ChartType,
    hideScrollBar: boolean,
    mainChart: RangeScrollChartData,
    navigationChart: RangeScrollChartData,
    navigationSlider: RangeSliderProps,
}

export interface RangeScrollChartState extends RangeScrollChartProps {
    start: number;
    end: number;
    scrollLeft: number;
    scrollWidth: number;
    scrollerWidth: number;
    columnWidth: number;
    groupsGap: number;
    scrollBarSize: number;
    chartScrollRequested: boolean;
}
