import { BaseChartProps } from '../BaseChart/types.ts';
import { RangeSliderProps } from '../RangeSlider/types.ts';

export type RangeScrollChartData = Partial<BaseChartProps>;

export type ChartType = 'histogram' | 'linechart';

export type RangeScrollChartChangeType =
    'start'
    | 'end'
    | 'value'
    | 'reset'
    | 'scroll'
    | 'resize';

// Main chart props
export interface RangeScrollChartMainProps extends Partial<BaseChartProps> {
    type: ChartType;
}

// Navigation chart props
export interface RangeScrollChartNavigationProps extends BaseChartProps {
    type: ChartType;
}

export interface RangeScrollChartProps {
    className: string;
    type: ChartType;
    hideScrollBar: boolean;
    mainChart: RangeScrollChartMainProps;
    navigationChart: RangeScrollChartNavigationProps;
    navigationSlider: RangeSliderProps;
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
