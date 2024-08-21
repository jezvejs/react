import { useMemo } from 'react';
import {
    debounce,
    DebounceCallback,
    DebounceOptions,
    DebounceReturnResult,
} from '../../utils/common.ts';

/**
 * Runs only last call of function after timeout
 * @param {Function} func - function to debounce
 * @param {Number} ms - timeout
 * @param {object} options - options object
 * @param {Boolean} options.immediate - run function on start of timeout
 * @param {Boolean} options.cancellable - return object with 'cancel' method last function call
 * @returns {DebounceReturnResult}
 */
export function useDebounce(
    func: DebounceCallback,
    ms: number,
    options: DebounceOptions = {},
): DebounceReturnResult {
    const debounced = useMemo(() => (
        debounce(func, ms, options)
    ), [func, ms, JSON.stringify(options)]);

    return debounced;
}
