import { expect, Locator } from '@playwright/test';

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
