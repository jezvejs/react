export interface PieChartDataItem {
    id?: string | number;
    title?: string;
    value: number;
    category?: string | number;
    offset?: number;
}

export type PieChartColorItem = number;

/**
 * SVG circular arc
 */
export interface CircularArcType {
    centerX: number;
    centerY: number;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    deltaX: number;
    deltaY: number;
    large: number;
    command: string;
}

/**
 * Pie chart sector props
 */
export interface PieChartSectorProps {
    id: string;
    className: string;
    title?: string;
    category: string;
    color: number;
    x: number;
    y: number;
    r: number;
    ir: number;
    start: number;
    arc: number;
    offset: number;

    onItemClick: (params: PieChartMouseEvent) => void;
    onItemOver: (params: PieChartMouseEvent) => void;
    onItemOut: (params: PieChartMouseEvent) => void;
}

export interface PieChartMouseEvent {
    event: React.MouseEvent;
    sector?: PieChartSectorProps;
}

export interface PieChartProps {
    id: string;
    className: string;
    radius: number;
    innerRadius: number;
    offset: number;
    data: number[] | PieChartDataItem[];
    colors: PieChartColorItem[];

    onItemClick: (params: PieChartMouseEvent) => void;
    onItemOver: (params: PieChartMouseEvent) => void;
    onItemOut: (params: PieChartMouseEvent) => void;
}
