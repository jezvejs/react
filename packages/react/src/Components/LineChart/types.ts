import {
    BaseChartBaseItem,
    BaseChartComponents,
    BaseChartDataCategory,
    BaseChartHorizontalAlign,
    BaseChartProps,
    BaseChartState,
    BaseChartVisibleItems,
} from '../BaseChart/types.ts';

export type LineChartItemProps = BaseChartBaseItem;

/**
 * Data types
 */
export interface LineChartDataItemType extends LineChartItemProps {
    cx: number;
    cy: number;
    r: number;
}

export type LineChartDataGroup = (LineChartDataItemType | null)[];

export interface LineChartPathProps {
    values: number[];
    categoryIndex: number;
    category: BaseChartDataCategory;
    active: boolean;
}

export interface LineChartDataPath extends LineChartPathProps {
    shape: string;
    autoScale: boolean;
    animate: boolean;
    animateNow: boolean;
}

/**
 * LineChart DataItem component
 */
export interface LineChartDataItemProps {
    cx: number;
    cy: number;
    r: number;
    categoryIndex: number;
    category: BaseChartDataCategory;
    stacked: boolean;
    active: boolean;
    autoScale: boolean;
    animate: boolean;
    animateNow: boolean;
}

export type LineChartDataItemRef = SVGCircleElement | null;

export type LineChartDataItemComponent = React.ForwardRefExoticComponent<
    LineChartDataItemProps & React.RefAttributes<LineChartDataItemRef>
>;

/**
 * LineChart DataPath component
 */
export interface LineChartDataPathProps {
    shape: string;
    categoryIndex: number;
    category: BaseChartDataCategory;
    stacked: boolean;
    active: boolean;
    autoScale: boolean;
    animate: boolean;
    animateNow: boolean;
}

export type LineChartDataPathRef = SVGPathElement | null;

export type LineChartDataPathComponent = React.ForwardRefExoticComponent<
    LineChartDataPathProps & React.RefAttributes<LineChartDataPathRef>
>;

/**
 * LineChart DataSeries component
 */
export type LineChartDataSeriesProps = BaseChartState;

export type LineChartDataSeriesComponent = React.FC<LineChartDataSeriesProps>;

/**
 * LineChart child components
 */
export type LineChartComponents = BaseChartComponents & {
    DataItem?: LineChartDataItemComponent;
    DataPath?: LineChartDataPathComponent;
};

export interface LineChartAlignedXOptions {
    groupIndex: number;
    groupWidth: number;
    alignColumns: BaseChartHorizontalAlign;
}

/**
 * LineChart props
 */
export interface LineChartProps extends BaseChartProps {
    drawNodeCircles?: boolean;
    columnGap?: number;
    nodeCircleRadius?: number;

    getGroupWidth?: (state: LineChartState) => number;
    getColumnOuterWidth?: (state: LineChartState) => number;
    getX?: (item: LineChartAlignedXOptions, groupWidth: number) => number;
    getAlignedX?: (options: LineChartAlignedXOptions, state: LineChartState) => number;
    createItem?: (data: LineChartItemProps, state: LineChartState) => LineChartDataItemType | null;

    components: LineChartComponents;
}

type LineChartBaseState = LineChartProps & BaseChartState;

export interface LineChartVisibleItems extends BaseChartVisibleItems {
    items: LineChartDataGroup[];
    paths: LineChartDataPath[];
}

/**
 * LineChart component state
 */
export interface LineChartState extends LineChartBaseState {
    popupTargetRef: React.LegacyRef<LineChartDataItemRef>;
    pinnedPopupTargetRef: React.LegacyRef<LineChartDataItemRef>;

    dataSeries: LineChartVisibleItems;
}
