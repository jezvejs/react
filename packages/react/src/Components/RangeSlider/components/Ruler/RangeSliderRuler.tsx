import { FC, useMemo } from 'react';

import { useDragnDrop } from '../../../../utils/DragnDrop/DragnDropProvider.tsx';

import { ChartGrid } from '../../../ChartGrid/ChartGrid.ts';
import { RangeSliderState } from '../../types.ts';

import './RangeSliderRuler.scss';

export const RangeSliderRuler: FC = (() => {
    const { getState } = useDragnDrop<RangeSliderState>();

    const state = getState();
    const { showRuler = false, axis, rulerSize: size } = state;

    const horizontal = axis === 'y';

    const length = state.axis === 'x' ? state.width : state.height;
    const sliderLength = state.axis === 'x' ? state.sliderWidth : state.sliderHeight;
    const valuesMargin = (length - sliderLength) / length;

    const grid = useMemo(() => {
        if (!showRuler) {
            return null;
        }

        const result = new ChartGrid({
            scaleAroundAxis: false,
            height: length - sliderLength,
            margin: 0,
            minStep: sliderLength,
            maxStep: 100,
            valuesMargin: 0,
            stacked: false,
        });
        result.calculate([state.min ?? 0, state.max ?? 0]);

        return result;
    }, [showRuler, length, sliderLength, valuesMargin, state.min, state.max]);

    const items = useMemo(() => {
        if (!showRuler || !grid || !size) {
            return [];
        }

        const result: React.SVGProps<SVGPathElement>[] = [];
        let step = 0;
        let curPos = grid.yFirst + (sliderLength / 2);

        while (step <= grid.steps) {
            let roundPos = Math.round(curPos);
            if (roundPos > curPos || roundPos >= length) {
                roundPos -= 0.5;
            } else {
                roundPos += 0.5;
            }

            const gridLine: React.SVGProps<SVGPathElement> = {
                id: (horizontal) ? `ygrid_${step}` : `xgrid_${step}`,
                className: 'range-slider__ruler-line',
                d: (horizontal) ? `M0,${roundPos}L${size},${roundPos}` : `M${roundPos},0L${roundPos},${size}`,
            };

            result.push(gridLine);

            curPos += grid.yStep;
            step += 1;
        }

        return result;
    }, [showRuler, grid, length, size, axis]);

    if (!showRuler) {
        return null;
    }

    const svgProps: React.SVGProps<SVGSVGElement> = {
        className: 'range-slider__ruler',
        width: (horizontal) ? size : length,
        height: (horizontal) ? length : size,
    };

    return (
        <svg {...svgProps}>
            <g>
                {items.map((item) => (
                    <path {...item} key={item.id} />
                ))}
            </g>
        </svg>
    );
});

RangeSliderRuler.displayName = 'RangeSliderRuler';
