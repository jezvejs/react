export interface PieChartDataItem {
    id?: string | number,
    title?: string,
    value: number,
    category?: string | number,
}

export type PieChartColorItem = number;

/**
 * Pie chart sector props
 */
export interface PieChartSectorProps {
    id: string,
    className: string,
    category: string,
    color: number,
    x: number,
    y: number,
    r: number,
    ir: number,
    start: number,
    arc: number,
    offset: number,

    onItemClick: (params: PieChartMouseEvent) => void,
    onItemOver: (params: PieChartMouseEvent) => void,
    onItemOut: (params: PieChartMouseEvent) => void,
}

export interface PieChartMouseEvent {
    event: React.MouseEvent,
    sector?: PieChartSectorProps,
}

export interface PieChartProps {
    id: string,
    className: string,
    radius: number,
    innerRadius: number,
    offset: number,
    data: number[] | PieChartDataItem[],
    colors: PieChartColorItem[],

    onItemClick: (params: PieChartMouseEvent) => void,
    onItemOver: (params: PieChartMouseEvent) => void,
    onItemOut: (params: PieChartMouseEvent) => void,
}
