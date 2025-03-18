import {
    PieChart,
    PieChartDataItem,
    PieChartProps,
    PieChartSectorProps,
} from '@jezvejs/react';
import { useState } from 'react';

export type PieChartSelected = {
    title: string;
};

export type SelectablePieChartDataState = {
    data: PieChartDataItem[];
    selected: PieChartSelected | null;
};

export type SelectablePieChartProps = PieChartProps & {
    infoClassName?: string;
};

export const toPieChartDataItem = (value: number | PieChartDataItem): PieChartDataItem => (
    (typeof value === 'number')
        ? { value }
        : value
);

const toggleSectorOffset = (data: PieChartDataItem[], sector: PieChartSectorProps) => (
    data.map((item) => ({
        ...item,
        offset: (sector.id === item.id && item.offset !== 10) ? 10 : 0,
    }))
);

export const SelectablePieChart = (args: SelectablePieChartProps) => {
    const [state, setState] = useState<SelectablePieChartDataState>({
        data: args.data?.map(toPieChartDataItem) ?? [],
        selected: null,
    });

    const chartProps: PieChartProps = {
        ...args,
        data: state.data,
        onItemOver: ({ sector }) => {
            if (!sector) {
                return;
            }

            setState((prev) => ({
                ...prev,
                selected: { title: sector.title ?? '' },
            }));
        },
        onItemOut: () => {
            setState((prev) => ({
                ...prev,
                selected: null,
            }));
        },
        onItemClick: ({ sector }) => {
            if (!sector) {
                return;
            }

            setState((prev) => ({
                ...prev,
                data: toggleSectorOffset(prev.data, sector),
                selected: { title: sector.title ?? '' },
            }));
        },
    };

    return (
        <div>
            <PieChart {...chartProps} />

            <div className={args.infoClassName}>
                {state.selected?.title}
            </div>
        </div>
    );
};
