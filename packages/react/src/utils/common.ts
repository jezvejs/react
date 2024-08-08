/* eslint no-bitwise: "off" */

/** Returns value normalized to specified range */
export const minmax = (min: number, max: number, value: number): number => (
    Math.max(
        Math.min(min, max),
        Math.min(Math.max(min, max), value),
    )
);

/** Return string for value in pixels */
export const px = (val: string) => `${parseInt(val, 10)}px`;

/** Check bit flag is set */
export const hasFlag = (x: number, flag: number) => ((x & flag) === flag);

interface DebounceOptions {
    immediate?: boolean,
    cancellable?: boolean,
}

interface DebounceCallback {
    (n?: number): void;
};

interface DebounceRunFunction {
    (args: any[]): void;
};

interface DebounceCancelFunction {
    (): void;
};

interface DebounceCancellableReturnResult {
    run: DebounceRunFunction,
    cancel: DebounceCancelFunction,
};

type DebounceReturnResult = DebounceRunFunction | DebounceCancellableReturnResult;

/**
 * Runs only last call of function after timeout
 * @param {Function} func - function to debounce
 * @param {Number} ms - timeout
 * @param {DebounceOptions} options - options object
 * @param {Boolean} options.immediate - run function on start of timeout
 * @param {Boolean} options.cancellable - return object with 'cancel' method last function call
 * @returns {DebounceReturnResult}
 */
export function debounce(
    func: DebounceCallback,
    ms: number,
    options: DebounceOptions = {},
): DebounceReturnResult {
    const {
        immediate = false,
        cancellable = false,
    } = options;

    let timeout: number = 0;

    const run = function (...args: any[]) {
        const callFunc = () => func(...args);

        const later = () => {
            timeout = 0;
            if (!immediate) {
                callFunc();
            }
        };

        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = window.setTimeout(later, ms);
        if (callNow) {
            callFunc();
        }
    };

    if (cancellable) {
        return {
            run,
            cancel: () => {
                clearTimeout(timeout);
                timeout = 0;
            },
        };
    }

    return run;
}
