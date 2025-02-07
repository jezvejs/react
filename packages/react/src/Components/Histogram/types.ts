import { CSSProperties } from 'react';
import {
    BaseChartBaseItem,
    BaseChartComponents,
    BaseChartDataCategory,
    BaseChartDataGroup,
    BaseChartHorizontalAlign,
    BaseChartPopupProps,
    BaseChartProps,
    BaseChartState,
    BaseChartVisibleItems,
} from '../BaseChart/types.ts';

export interface HistogramItemProps extends BaseChartBaseItem {
    groupName: BaseChartDataGroup;
    animateNow: boolean;
}

/**
 * Histogram popup component
 */
export type HistogramPopupProps = BaseChartPopupProps<HistogramItemProps>;

export type HistogramPopupComponent = React.ComponentType<HistogramPopupProps>;

export interface HistogramDataItemType extends HistogramItemProps {
    x: number;
    y: number;
    width: number;
    height: number;

    // Parent chart props
    autoScale: boolean;
    animate: boolean;
    stacked: boolean;
}

export type HistogramDataGroup = (HistogramDataItemType | null)[];

export interface HistogramAlignedXOptions {
    item: HistogramDataItemType | null;
    groupWidth: number;
    columnWidth: number;
    groupsGap: number;
    alignColumns: BaseChartHorizontalAlign;
}

/**
 * Histogram DataItem component
 */
export interface HistogramDataItemAttrs {
    x: number;
    y: number;
    width: number;
    height: number;
    style?: CSSProperties;
}

export interface HistogramDataItemProps {
    x: number;
    y: number;
    width: number;
    height: number;
    columnIndex: number;
    categoryIndex: number;
    category: BaseChartDataCategory;
    stacked: boolean;
    active: boolean;
    autoScale: boolean;
    animate: boolean;
    animateNow: boolean;
}

export type HistogramDataItemRef = SVGRectElement | null;

export type HistogramDataItemComponent = React.ForwardRefExoticComponent<
    HistogramDataItemProps & React.RefAttributes<HistogramDataItemRef>
>;

/**
 * Histogram DataSeries component
 */
export type HistogramDataSeriesProps = BaseChartState;

export type HistogramDataSeriesComponent = React.FC<HistogramDataSeriesProps>;

/**
 * Histogram children components
 */
export type HistogramComponents = BaseChartComponents & {
    DataItem?: HistogramDataItemComponent;
};

/**
 * Histogram props
 */
export interface HistogramProps extends BaseChartProps {
    columnGap?: number;

    getColumnOuterWidth?: (state: HistogramState) => number;
    getGroupWidth?: (state: HistogramState) => number;
    getX?: (item: HistogramDataItemType, groupWidth: number, columnWidth: number) => number;
    getAlignedX?: (options: HistogramAlignedXOptions, state: HistogramState) => number;
    createItem?: (data: HistogramItemProps, state: HistogramState) => HistogramDataItemType | null;

    components: HistogramComponents;
}

type HistogramBaseState = HistogramProps & BaseChartState;

export type HistogramVisibleItems = BaseChartVisibleItems<HistogramDataGroup>;

/**
 * Histogram component state
 */
export interface HistogramState extends HistogramBaseState {
    popupTargetRef: React.LegacyRef<HistogramDataItemRef>;
    pinnedPopupTargetRef: React.LegacyRef<HistogramDataItemRef>;

    dataSeries: HistogramVisibleItems,
}
