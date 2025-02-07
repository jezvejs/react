import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { useState } from 'react';
import {
    PieChart,
    PieChartDataItem,
    PieChartProps,
    PieChartSectorProps,
} from '@jezvejs/react';

// Common components
import { ActionButton } from '../../../common/Components/ActionButton/ActionButton.tsx';
import { SectionControls } from '../../../common/Components/SectionControls/SectionControls.tsx';

import './PieChart.stories.scss';

type Story = StoryObj<typeof PieChart>;

const meta: Meta<typeof PieChart> = {
    title: 'Charts/PieChart',
    component: PieChart,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

const toggleSectorOffset = (data: PieChartDataItem[], sector: PieChartSectorProps) => (
    data.map((item) => ({
        ...item,
        offset: (sector.id === item.id && item.offset !== 10) ? 10 : 0,
    }))
);

export const Default: Story = {
    args: {
        className: 'small_pie',
        colors: [
            0xDCF900, 0x00B74A, 0xFF8700, 0xDB0058, 0x086CA2,
            0xFFBA00, 0xFF3900, 0xDC0055, 0x00B64F,
        ],
        data: [100, 150, 120, 20, 10, 6, 8, 220],
        radius: 50,
    },
};

type PieChartSelected = {
    title: string;
};

type SelectablePieChartDataState = {
    data: PieChartDataItem[];
    selected: PieChartSelected | null;
};

const toDataItem = (value: number | PieChartDataItem): PieChartDataItem => (
    (typeof value === 'number')
        ? { value }
        : value
);

type SelectablePieChartProps = PieChartProps & {
    infoClassName?: string;
};

const SelectablePieChart = (args: SelectablePieChartProps) => {
    const [state, setState] = useState<SelectablePieChartDataState>({
        data: args.data.map(toDataItem),
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

type SelectableStory = StoryObj<typeof SelectablePieChart>;

export const Offset: SelectableStory = {
    name: 'Title and offset sector',
    args: {
        className: 'middle_pie',
        infoClassName: 'info-bottom',
        radius: 100,
        offset: 10,
        data: [
            {
                id: 1,
                value: 10,
                title: 'First category',
                offset: 10,
            },
            { id: 2, value: 10, title: 'Second category' },
            { id: 3, value: 10, title: 'Third category' },
            { id: 4, value: 20, title: 'Fourth category' },
        ],
    },
    render: SelectablePieChart,
};

export const InnerRadius: SelectableStory = {
    args: {
        className: 'middle_pie',
        infoClassName: 'info-inner',
        radius: 100,
        innerRadius: 70,
        offset: 10,
        data: [
            {
                id: 1,
                value: 10,
                title: 'First category',
                offset: 10,
            },
            { id: 2, value: 10, title: 'Second category' },
            { id: 3, value: 10, title: 'Third category' },
            { id: 4, value: 20, title: 'Fourth category' },
            { id: 5, value: 3, title: 'Fiveth category' },
            { id: 6, value: 5, title: 'Sixth category' },
        ],
    },
    render: SelectablePieChart,
};

export const SingleValue: SelectableStory = {
    args: {
        className: 'middle_pie',
        radius: 100,
        offset: 10,
        data: [{ value: 100 }],
    },
    render: SelectablePieChart,
};

export const SingleValueInnerRadius: SelectableStory = {
    args: {
        className: 'middle_pie',
        radius: 100,
        innerRadius: 70,
        offset: 10,
        data: [{ value: 100 }],
    },
    render: SelectablePieChart,
};

export const NoData: Story = {
    args: {
        className: 'middle_pie',
        radius: 100,
        innerRadius: 70,
        offset: 10,
        data: [
            { category: 2, value: 10, title: 'First category' },
            { category: 3, value: 10, title: 'Second category' },
            { category: 5, value: 10, title: 'Third category' },
            { category: 7, value: 20, title: 'Fourth category' },
            { category: 8, value: 0, title: 'Fiveth category' },
            { category: 'gray', value: 5, title: 'Sixth category' },
        ],
    },
    render: function Render(args) {
        const [state, setState] = useState<SelectablePieChartDataState>({
            data: args.data.map(toDataItem),
            selected: null,
        });

        const chartProps: PieChartProps = {
            ...args,
            data: state.data,
            onItemOver: ({ sector }) => {
                if (!sector) {
                    return;
                }

                setState((prev: SelectablePieChartDataState) => ({
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
        };

        const setNoData = () => {
            setState((prev) => ({
                ...prev,
                data: [],
                selected: null,
            }));
        };

        const setData = () => {
            setState((prev) => ({
                ...prev,
                data: args.data.map(toDataItem),
                selected: null,
            }));
        };

        return (
            <div>
                <PieChart {...chartProps} />

                <SectionControls>
                    <ActionButton
                        title="Set no data"
                        onClick={setNoData}
                    />
                    <ActionButton
                        title="Set data"
                        onClick={setData}
                    />
                </SectionControls>
            </div>
        );
    },
};
