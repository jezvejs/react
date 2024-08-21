import { asArray } from '@jezvejs/types';
import { Point } from '../../utils/types.ts';
import { formatCoord } from '../BaseChart/helpers.ts';
import {
    LineChartDataPath,
    LineChartPathProps,
    LineChartState,
} from './types.ts';

export const formatPath = (points: Point[]) => {
    const coords = points.map((point: Point) => {
        const x = formatCoord(point.x);
        const y = formatCoord(point.y);
        return `${x}, ${y}`;
    });

    return `M ${coords.join(' ')}`;
};

/** Returns path for specified nodes */
export const getLinePath = (
    data: LineChartPathProps,
    state: LineChartState,
): LineChartDataPath => {
    const firstGroupIndex = state.getFirstVisibleGroupIndex(state);
    const groupWidth = state.getGroupOuterWidth(state);
    const coords = asArray(data?.values).map((value: number, index: number) => ({
        x: state.getAlignedX?.({
            groupIndex: firstGroupIndex + index,
            groupWidth,
            alignColumns: state.alignColumns,
        }, state) ?? 0,
        y: value,
    }));

    const pathProps: LineChartDataPath = {
        ...data,
        shape: formatPath(coords),
        autoScale: state.autoScale,
        animate: state.animate,
        animateNow: state.animateNow,
    };

    return pathProps;
};
