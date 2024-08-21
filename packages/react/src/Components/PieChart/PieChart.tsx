import { asArray, isObject } from '@jezvejs/types';
import classNames from 'classnames';

import { PieChartSector } from './components/PieChartSector/PieChartSector.tsx';

import { arraySum } from './helpers.ts';
import { PieChartProps, PieChartSectorProps } from './types.ts';
import './PieChart.scss';

export const PieChart = (props: PieChartProps) => {
    const {
        radius = 150,
        innerRadius = 0,
        offset = 0,
        colors = [],
    } = props;

    const getNextColor = (val: number) => {
        if (!val) {
            return colors[0];
        }

        const ind = colors.indexOf(val);
        if (ind === -1 || ind === colors.length - 1) {
            return colors[0];
        }

        return colors[ind + 1];
    };

    /** Sector item 'click' event handler */
    const onItemClick = (event: React.MouseEvent, sector: PieChartSectorProps) => {
        props.onItemClick?.({ sector, event });
    };

    /** Sector item 'mouseover' event handler */
    const onItemOver = (event: React.MouseEvent, sector: PieChartSectorProps) => {
        props.onItemOver?.({ sector, event });
    };

    /** Sector item 'mouseout' from bar event handler */
    const onItemOut = (event: React.MouseEvent, sector: PieChartSectorProps) => {
        props.onItemOut?.({ sector, event });
    };

    const items = asArray(props.data);
    const data = items.map((item) => {
        const res = isObject(item) ? { ...item } : { value: item };

        if (!('value' in res)) {
            throw new Error('Value property expected');
        }
        const value = parseFloat(res.value);
        if (Number.isNaN(value)) {
            throw new Error(`Invalid data value: ${res.value}`);
        }
        res.value = value;

        if ('offset' in res) {
            const offs = parseFloat(res.offset);
            if (Number.isNaN(offs)) {
                throw new Error(`Invalid offset value: ${res.offset}`);
            }
            res.offset = offs;
        }

        return res;
    });

    let values = asArray(data);
    const total = arraySum(values);

    if (total > 0) {
        values = values
            .filter((item) => item.value > 0)
            .map((item) => ({
                ...item,
                arc: 360 * (item.value / total),
            }));
        values.sort((a, b) => (a.value - b.value));
    }

    let start = 0;
    let prevColor = 0;

    const r = radius;
    if (Number.isNaN(r) || r === 0.0) {
        throw new Error('Invalid radius');
    }
    const ir = innerRadius;
    if (Number.isNaN(ir) || ir < 0 || ir > r) {
        throw new Error('Invalid radius');
    }

    const width = (radius + offset) * 2;
    const height = (radius + offset) * 2;

    const chartProps = {
        className: classNames('pie-chart', props.className),
        viewBox: `0 0 ${width} ${height}`,
    };

    return (
        <svg {...chartProps}>
            <g>
                {values.map((item, ind) => {
                    const category = item.category ?? (ind + 1);

                    const sector = {
                        ...item,
                        x: width / 2,
                        y: height / 2,
                        r,
                        ir,
                        start,
                        arc: item.arc,
                        offset: item.offset,
                        category: category.toString(),
                    };

                    if (colors.length > 0) {
                        sector.color = getNextColor(prevColor);
                        prevColor = sector.color;
                    }

                    const sectorProps = {
                        ...sector,
                        onItemClick: (e: React.MouseEvent) => onItemClick(e, sector),
                        onItemOver: (e: React.MouseEvent) => onItemOver(e, sector),
                        onItemOut: (e: React.MouseEvent) => onItemOut(e, sector),
                    };

                    start += item.arc;

                    return (
                        <PieChartSector
                            {...sectorProps}
                            id={sectorProps.id?.toString()}
                            key={`${props.id}${ind}`}
                        />
                    );
                })}
            </g>
        </svg>
    );
};
