import classNames from 'classnames';

import { circularArc, hexColor, svgValue } from '../../helpers.ts';
import { PieChartSectorProps } from '../../types.ts';

export const PieChartSector = (props: PieChartSectorProps) => {
    const {
        x,
        y,
        r,
        ir,
        start,
        arc,
        offset = 0,
        category,
        color = null,
    } = props;

    const cx = x;
    const cy = y;
    if (Number.isNaN(cx) || Number.isNaN(cy)) {
        throw new Error(`Invalid coordinates: (${x}; ${y})`);
    }

    const radius = r;
    if (Number.isNaN(radius) || radius === 0.0) {
        throw new Error(`Invalid radius: ${r}`);
    }

    const innerRadius = ir;
    if (Number.isNaN(innerRadius) || innerRadius < 0 || innerRadius > radius) {
        throw new Error(`Invalid inner radius: ${ir}`);
    }

    const getFullSectorPath = () => {
        const offs = offset;
        if (Number.isNaN(offs)) {
            throw new Error(`Invalid offset: ${offset}`);
        }

        const outer1 = circularArc(x, y, r + offs, 0, 180, 0, true);
        const outer2 = circularArc(x, y, r + offs, 180, 180, 0, true);
        const outerSX = svgValue(outer1.startX);
        const outerSY = svgValue(outer1.startY);
        const outer = `m${outerSX} ${outerSY} ${outer1.command} ${outer2.command}z`;

        if (ir === 0) {
            return outer;
        }

        const inner1 = circularArc(x, y, ir + offs, 0, 180, 0, false);
        const inner2 = circularArc(x, y, ir + offs, 180, 180, 0, false);
        const dX = svgValue(outer1.endX - inner1.startX);
        const dY = svgValue(outer1.endY - inner1.startY);
        const inner = `m${dX} ${dY} ${inner1.command} ${inner2.command}z`;

        return `${outer} ${inner}`;
    };

    const getSectorPath = () => {
        if (arc === 360) {
            return getFullSectorPath();
        }

        // Outer arc
        const outerArc = circularArc(x, y, r, start, arc, offset, true);
        const fsx = svgValue(outerArc.startX);
        const fsy = svgValue(outerArc.startY);
        const outer = `m${fsx} ${fsy} ${outerArc.command}`;

        if (innerRadius === 0) {
            // shift from arc end point to center of circle
            const lx = svgValue(outerArc.centerX - outerArc.endX);
            const ly = svgValue(outerArc.centerY - outerArc.endY);

            return `${outer} l${lx} ${ly}z`;
        }

        // Use inner radius
        const innerArc = circularArc(x, y, ir, start, arc, offset, false);
        // shift from outer arc end point to inner arc end point
        const elx = svgValue(innerArc.endX - outerArc.endX);
        const ely = svgValue(innerArc.endY - outerArc.endY);
        // shift from inner arc start point to outer arc start point
        const slx = svgValue(outerArc.startX - innerArc.startX);
        const sly = svgValue(outerArc.startY - innerArc.startY);

        const inner = `l${elx} ${ely} ${innerArc.command}`;

        return `${outer} ${inner} l${slx} ${sly}z`;
    };

    const onClick = (event: React.MouseEvent) => props.onItemClick?.({ event });

    const onMouseOver = (event: React.MouseEvent) => props.onItemOver?.({ event });

    const onMouseOut = (event: React.MouseEvent) => props.onItemOut?.({ event });

    const pathProps: React.SVGAttributes<SVGPathElement> = {
        className: classNames(
            'pie__sector',
            `pie__sector-${category}`,
            props.className,
        ),
        d: getSectorPath(),
        onClick,
        onMouseOver,
        onMouseOut,
    };

    if (color) {
        pathProps.fill = hexColor(color);
    }

    return (
        <path {...pathProps} />
    );
};
