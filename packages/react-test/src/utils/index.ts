import { asArray, isFunction } from '@jezvejs/types';
import { expect, Locator } from '@playwright/test';
import { setTimeout } from 'node:timers';

import {
    IncludeGroupItemsParam,
    ToFlatListParam,
    WaitForConditionFunc,
    WaitForFunctionConditionFunc,
    WaitForOptions,
} from './types.ts';
import { MenuItemState } from '../components/MenuItem/MenuItem.ts';

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

/**
 * Returns true if specified item support child items
 *
 * @param {<T = MenuItemState>} item
 * @returns {boolean}
 */
export function isChildItemsAvailable<T extends MenuItemState = MenuItemState>(
    item: T,
): boolean {
    return (
        item.type === 'group'
        || item.type === 'parent'
    );
}

/**
 * Returns true if specified item itself should be included to the tree data processing
 *
 * @param {<T = MenuItemState>} item
 * @param {ToFlatListParam} options
 * @returns {boolean}
 */
export function shouldIncludeParentItem<
    T extends MenuItemState = MenuItemState,
    OPT extends IncludeGroupItemsParam = IncludeGroupItemsParam,
>(
    item: T,
    options?: OPT | null,
): boolean {
    return !!(
        (item.type === 'group' && options?.includeGroupItems)
        || (item.type === 'parent')
    );
}

/**
 * Returns true if children of specified item should be included to the tree data processing
 *
 * @param {<T = MenuItemState>} item
 * @param {ToFlatListParam} options
 * @returns {boolean}
 */
export function shouldIncludeChildItems<
    T extends MenuItemState = MenuItemState,
    OPT extends IncludeGroupItemsParam = IncludeGroupItemsParam,
>(
    item: T,
    options?: OPT | null,
): boolean {
    return !!(
        (item.type === 'group')
        || (item.type === 'parent' && !!options?.includeChildItems)
    );
}

/**
 * Converts multilevel menu list to flat array of items and returns result
 *
 * @param {<T = MenuItemState>[]} items
 * @param {ToFlatListParam} options
 * @returns {T[]}
 */
export function toFlatList<T extends MenuItemState = MenuItemState>(
    items: T[],
    options?: ToFlatListParam,
): T[] {
    const res: T[] = [];
    const parentId = options?.parentId;

    for (let index = 0; index < items.length; index += 1) {
        const item = items[index];
        const disabled = options?.disabled || item.disabled;

        if (isChildItemsAvailable(item)) {
            if (shouldIncludeParentItem(item, options)) {
                res.push({ ...item, parentId, disabled });
            }

            if (shouldIncludeChildItems(item, options)) {
                res.push(
                    ...toFlatList<T>(
                        asArray(item.items),
                        {
                            ...options,
                            parentId: item.id,
                            disabled,
                            includeGroupItems: options?.includeGroupItems,
                        },
                    ),
                );
            }
        } else {
            res.push({ ...item, parentId, disabled });
        }
    }

    return res;
}
