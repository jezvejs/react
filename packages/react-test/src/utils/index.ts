import { isFunction } from '@jezvejs/types';
import { expect, Locator } from '@playwright/test';
import { setTimeout } from 'node:timers';

import { WaitForConditionFunc, WaitForFunctionConditionFunc, WaitForOptions } from './types.ts';

export const classNameRegExp = (className: string) => (
    new RegExp(`(^|\\s)${className}(\\s|$)`, 'g')
);

export const expectToHaveClass = (
    locator: Locator,
    className: string,
    value: boolean = true,
) => (
    (value)
        ? expect(locator).toHaveClass(classNameRegExp(className))
        : expect(locator).not.toHaveClass(classNameRegExp(className))
);

export const waitFor = async (
    conditionFunc: WaitForConditionFunc,
    options: WaitForOptions = {},
) => {
    const {
        timeout = 30000,
        polling = 200,
    } = options;

    return new Promise((resolve, reject) => {
        let qTimer: NodeJS.Timeout | string | number = 0;
        const limit = setTimeout(() => {
            if (qTimer) {
                clearTimeout(qTimer);
            }
            reject(new Error('Wait timeout'));
        }, timeout);

        async function queryCondition(condition: WaitForConditionFunc) {
            const res = await condition();

            if (res) {
                clearTimeout(limit);
                resolve(res.value);
            } else {
                qTimer = setTimeout(() => queryCondition(condition), polling);
            }
        }

        queryCondition.call(this, conditionFunc);
    });
};

/** Wait for specified function until it return truly result or throw by timeout */
export const waitForFunction = async (condition: WaitForFunctionConditionFunc, options = {}) => {
    if (!options) {
        throw new Error('Invalid options specified');
    }
    if (!isFunction(condition)) {
        throw new Error('Invalid options specified');
    }

    return waitFor(async () => {
        const res = await condition();

        if (res) {
            return { value: res };
        }

        return false;
    }, options);
};
