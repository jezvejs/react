/* eslint no-bitwise: "off" */

/** Returns value normalized to specified range */
export const minmax = (min, max, value) => (
    Math.max(
        Math.min(min, max),
        Math.min(Math.max(min, max), value),
    )
);

/** Return string for value in pixels */
export const px = (val) => `${parseInt(val, 10)}px`;

/** Check bit flag is set */
export const hasFlag = (x, flag) => ((x & flag) === flag);

/**
 * Runs only last call of function after timeout
 * @param {Function} func - function to debounce
 * @param {Number} ms - timeout
 * @param {object} options - options object
 * @param {Boolean} options.immediate - run function on start of timeout
 * @param {Boolean} options.cancellable - return object with 'cancel' method last function call
 * @returns {Function}
 */
export function debounce(func, ms, options = {}) {
    const {
        immediate = false,
        cancellable = false,
    } = options;

    let timeout = null;

    const run = function (...args) {
        const savedThis = this;
        const savedArgs = args;

        const later = () => {
            timeout = null;
            if (!immediate) {
                func.apply(savedThis, savedArgs);
            }
        };

        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, ms);
        if (callNow) {
            func.apply(savedThis, savedArgs);
        }
    };

    if (cancellable) {
        return {
            run,
            cancel: () => {
                clearTimeout(timeout);
                timeout = null;
            },
        };
    }

    return run;
}
