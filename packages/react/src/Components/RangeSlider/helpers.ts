import { minmax } from '../../utils/common.ts';
import { RangeSliderAxisType } from './types.ts';

export const valueToPosition = (
    value: number,
    minValue: number,
    maxValue: number,
    maxPos: number,
): number => {
    const fixedValue = minmax(minValue, maxValue, value);
    return maxPos * Math.abs((fixedValue - minValue) / (minValue - maxValue));
};

export const positionToValue = (
    pos: number,
    minValue: number,
    maxValue: number,
    maxPos: number,
): number => (
    minmax(
        minValue,
        maxValue,
        minValue + (pos * Math.abs(maxValue - minValue)) / Math.floor(maxPos),
    )
);

export const getStepPrecision = (step: number | null): number | null => {
    if (!Number.isFinite(step) || step === 0 || step === null) {
        return null;
    }

    const absStep = Math.abs(step);
    const fractional = absStep - Math.floor(absStep);
    if (fractional === 0) {
        return 1;
    }

    const exp = Math.floor(Math.log10(fractional));
    return (exp < 0) ? -exp : 1;
};

export const roundToPrecision = (value: number, prec: number): number => (
    Number.isFinite(prec)
        ? parseFloat(value.toFixed(prec))
        : value
);

export const stepValue = (value: number, step: number, prec: number): number => (
    (Number.isFinite(prec) && step !== 0)
        ? roundToPrecision(Math.round(value / step) * step, prec)
        : value
);

export const getMaxPos = (
    slider: HTMLElement | null,
    axis: RangeSliderAxisType,
): number => {
    if (!slider?.offsetParent) {
        return 0;
    }

    const rect = slider.getBoundingClientRect();
    const offset = slider.offsetParent.getBoundingClientRect();
    return (axis === 'x')
        ? (offset.width - rect.width)
        : (offset.height - rect.height);
};

/**
 * Returns new identifier for slider
 *
 * @param {string} prefix optional string to prepend id with
 */
export const generateId = (prefix: string = ''): string => {
    const id = Date.now() * Math.random() * 10000;
    return `${prefix}${id.toString(36)}`;
};
