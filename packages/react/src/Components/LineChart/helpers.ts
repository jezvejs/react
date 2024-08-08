import { asArray } from '@jezvejs/types';
import { formatCoord } from '../BaseChart/helpers.ts';

export const formatPath = (points) => {
    const coords = points.map((point) => {
        const x = formatCoord(point.x);
        const y = formatCoord(point.y);
        return `${x}, ${y}`;
    });

    return `M ${coords.join(' ')}`;
};

/** Returns path for specified nodes */
export const getLinePath = (data, state) => {
    const firstGroupIndex = state.getFirstVisibleGroupIndex(state);
    const groupWidth = state.getGroupOuterWidth(state);
    const coords = asArray(data?.values).map((value, index) => ({
        x: state.getAlignedX({
            groupIndex: firstGroupIndex + index,
            groupWidth,
            alignColumns: state.alignColumns,
        }, state),
        y: value,
    }));

    const pathProps = {
        ...data,
        shape: formatPath(coords),
        autoScale: state.autoScale,
        animate: state.animate,
        animateNow: state.animateNow,
    };

    return pathProps;
};
